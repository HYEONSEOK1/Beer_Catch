import argparse
import os
import time
import json

from PIL import Image
import torch
from torchvision import transforms, models
from models import *  # set ONNX_EXPORT in models.py
from utils.datasets import *
from utils.utils import *
from efficientnet_pytorch import EfficientNet


### detect에 다 때려박지말고 코드 분리할것.
def detect(save_img=False):
    imgsz = (320, 192) if ONNX_EXPORT else opt.img_size  # (320, 192) or (416, 256) or (608, 352) for (height, width)
    out, source, weights, half, view_img, save_txt = opt.output, opt.source, opt.weights, opt.half, opt.view_img, opt.save_txt
    webcam = source == '0' or source.startswith('rtsp') or source.startswith('http') or source.endswith('.txt')

    # Initialize
    device = torch_utils.select_device(device='cpu' if ONNX_EXPORT else opt.device)
    cleardir(source)
    cleardir(out)

    # Initialize model
    model = Darknet(opt.cfg, imgsz)
    modelc = models.resnet34(pretrained=True)
#     modelc = EfficientNet.from_pretrained('efficientnet-b0', num_classes=4)
    
    # Load weights
    ## Recognition model 
    attempt_download(weights)
    if weights.endswith('.pt'):  # pytorch format
        model.load_state_dict(torch.load(weights, map_location=device)['model'])
    else:  # darknet format
        load_darknet_weights(model, weights)
    
    ## Classification model
    num_ftrs = modelc.fc.in_features
    # Here the size of each output sample is set to 2.
    # Alternatively, it can be generalized to nn.Linear(num_ftrs, len(class_names)).
    modelc.fc = nn.Linear(num_ftrs, 37) # Generalized 할것
    modelc.load_state_dict(torch.load('forServiceTest/weights/37class_resnet34.pt'))


#     modelc.load_state_dict(torch.load('forServiceTest/weights/efficient.pt'))
    
#     # Second-stage classifier
#     classify = False
#     if classify:
#         modelc = torch_utils.load_classifier(name='resnet101', n=4)  # initialize
#         modelc.load_state_dict(torch.load('weights/resnet101.pt', map_location=device), strict = False)  # load weights
#         modelc.to(device).eval()

    # Eval mode
    model.to(device).eval()
    modelc.to(device).eval()

    # Fuse Conv2d + BatchNorm2d layers
    # model.fuse()

    # Export mode
    if ONNX_EXPORT:
        model.fuse()
        img = torch.zeros((1, 3) + imgsz)  # (1, 3, 320, 192)
        f = opt.weights.replace(opt.weights.split('.')[-1], 'onnx')  # *.onnx filename
        torch.onnx.export(model, img, f, verbose=False, opset_version=11,
                          input_names=['images'], output_names=['classes', 'boxes'])

        # Validate exported model
        import onnx
        model = onnx.load(f)  # Load the ONNX model
        onnx.checker.check_model(model)  # Check that the IR is well formed
        print(onnx.helper.printable_graph(model.graph))  # Print a human readable representation of the graph
        return

    # Half precision
    half = half and device.type != 'cpu'  # half precision only supported on CUDA
    if half:
        model.half()
    
    # Iterate detection process
    print('Start detection process')
    while True:
        # Wait for source file to arrive.
        if len(os.listdir(source)) < 1:
#             print("no source")
#             time.sleep(3)
            continue
        
        cleardir(out)
        
        # Set Dataloader
        vid_path, vid_writer = None, None
        if webcam:
            view_img = True
            torch.backends.cudnn.benchmark = True  # set True to speed up constant image size inference
            dataset = LoadStreams(source, img_size=imgsz)
        else:
            save_img = True
            dataset = LoadImages(source, img_size=imgsz)
    
        # Get names and colors
        names = load_classes(opt.names)
        colors = [[random.randint(0, 255) for _ in range(3)] for _ in range(len(names))]
    
        # Run inference
        t0 = time.time()
        img = torch.zeros((1, 3, imgsz, imgsz), device=device)  # init img
        _ = model(img.half() if half else img.float()) if device.type != 'cpu' else None  # run once
        
        for path, img, im0s, vid_cap in dataset:
            img = torch.from_numpy(img).to(device)
            img = img.half() if half else img.float()  # uint8 to fp16/32
            img /= 255.0  # 0 - 255 to 0.0 - 1.0
            if img.ndimension() == 3:
                img = img.unsqueeze(0)
    
            # Inference
            t1 = torch_utils.time_synchronized()
            pred = model(img, augment=opt.augment)[0]
            
    
            # to float
            if half:
                pred = pred.float()      
            # Apply NMS
            pred = non_max_suppression(pred, opt.conf_thres, opt.iou_thres,
                                       multi_label=False, classes=opt.classes, agnostic=opt.agnostic_nms)
            t2 = torch_utils.time_synchronized()
    
            # Process detections
            for i, det in enumerate(pred):  # detections for image i
                if webcam:  # batch_size >= 1
                    p, s, im0 = path[i], '%g: ' % i, im0s[i].copy()
                else:
                    p, s, im0 = path, '', im0s
    
                save_path = str(Path(out) / Path(p).name)
                s += '%gx%g ' % img.shape[2:]  # print string
#                 gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]  #  normalization gain whwh
                
                if det is not None and len(det):
                    # Rescale boxes from imgsz to im0 size
                    det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()

                    # Print results
                    for c in det[:, -1].unique():
                        n = (det[:, -1] == c).sum()  # detections per class
                        s += '%g %ss, ' % (n, names[int(c)])  # add to string
                    
                    # Crop detected images
                    queryDic = {} # { 'file_name' : [x, y, x, y, id] } 
                    for j, x in enumerate(det.cpu().numpy()):
                        h, w = im0s.shape[:2]
                        crop_name = 'crop_%g.jpg' % j
                        
                        coord = x[:4].astype(np.int)
                        crop_img = im0s[coord[1]:coord[3], coord[0]:coord[2]]
                        
                        # Make query dicionary for webserver
                        queryDic[crop_name] = list(coord)
                        
                        assert cv2.imwrite('%s/%s' % (out, crop_name), crop_img), 'Failure extracting classifier boxes'
#                         print('Crop_%g saved' % j)
                    
#                     print(queryDic)
                # Print time (inference + NMS)
                print('%sDone. (%.3fs)' % (s, t2 - t1))
            print('Dectect Done. (%.3fs)' % (time.time() - t0))
            
            # Classify
            class_names = {
                0: "asahi",      
                1: "kronenbourg1664blanc",  
                2: "carlsberg",
                3: "cassfresh",
                4: "casslite",
                5: "filitebarley",
                6: "filitefresh",
                7: "guinnessdraught",
                8: "heineken",
                9: "hoegaarden",
                10: "hophouse13",
                11: "kloud",
                12: "kozeldark",
                13: "pilsnerurquell",
                14: "fitz",
                15: "sapporo",
                16: "stellaartois",
                17: "terra",
                18: "tiger",
                19: "tsingtao",
                20: "gompyo",
                21: "malpyo",
                22: "grimbergenblanche",
                23: "macarthur",
                24: "budweiser",
                25: "becks",
                26: "bluemoons",
                27: "sunhanipa",
                28: "jejuwitale",
                29: "jejupellongale",
                30: "kronenbourg1664lager",
                31: "klouddraft",
                32: "filgoodseven",
                33: "filgoodoriginal",
                34: "hiteextracold",
                35: "heungcheongmangcheong",
                36: "somersby"
            }

            preprocess = transforms.Compose([
                    transforms.Resize((224, 224)),
                    transforms.ToTensor(),
                    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
                ])

            # TODO:listdir 개수가 0이면 캔 recognition이 안된 것, 나중에 처리하기.
            crop_list = os.listdir(out)
            
            if len(crop_list) < 1:
                print('Nothing found')
                
                web_path = '/home/K/Dev/webserver/result/result.json'
                with open(web_path, 'w') as f:
                    json.dump([], f)
                break
                
            
            list.sort(crop_list)

            for crop_name in crop_list:
                img_can = Image.open('%s/%s' % (out, crop_name)).convert('RGB')
                img_can = preprocess(img_can)
                inputs = torch.unsqueeze(img_can, 0)
                inputs = inputs.to(device)
                outputs = modelc(inputs)
                
                _, preds = torch.max(outputs, 1)
                ### TODO:여기서 전체적으로 일정 컨피던스 아래면 '없다' 판정
                
                predict = int(preds[0].cpu())
                queryDic[crop_name].append(predict) # 여기 값에 좌표와 id 담겨있음.
                
                percentage = torch.nn.functional.softmax(outputs, dim=1)[0] * 100
#                 if percentage[predict].item() > 50:
                print('%-10s -> %-10s : %g' % (crop_name, class_names[predict], percentage[predict].item()))
#                 print(percentage)
#                 web_path = '/home/K/Dev/webserver/result/result.json'
#                 with open(web_path, 'w') as f:
#                     json.dump(result, f)
                
            print('Classify Done. (%.3fs)' % (time.time() - t0))
        
            # Send results to webserver
            send = False
            
            if send:
                result = []
                val_names = ['x1', 'y1', 'x2', 'y2', 'id']  
    
                for v in sorted(queryDic.values(), key=lambda x:x[0]):
                    result.append(dict(zip(val_names, list(map(int, v)))))
    
                web_path = '/home/K/Dev/webserver/result/result.json'
                with open(web_path, 'w') as f:
                    json.dump(result, f)
            
#             # Apply Classifier -> 안먹힘
#             if classify:
#                 pred = apply_classifier(pred, modelc, img, im0s)
        print('\nWaiting for next query...')
    
        # 디버깅용 소스 이미지 복사
#             shutil.copyfile('%s/source.izg'source, '%s/source.img' % out) 
        cleardir(source)

def cleardir(path):
    if os.path.exists(path):
        shutil.rmtree(path)  # delete path folder
    os.makedirs(path)  # make new path folder

def classify(path):
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")  # set gpu
    
    class_names = {
        0: "blanc",      
        1: "heineken",  
        2: "hop",
        3: "terra",
    }

    preprocess = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

    # TODO:listdir 개수가 0이면 캔 recognition이 안된 것, 나중에 처리하기.
    crop_list = os.listdir(path)

    for crop in crop_list:
        img_can = Image.open('%s/%s' % (path, crop)).convert('RGB')
        img_can = preprocess(img_can)
        inputs = torch.unsqueeze(img_can, 0)
        inputs = inputs.to(device)

        outputs = model(inputs)
        _, preds = torch.max(outputs, 1)
        print(str(preds.cpu().numpy()))
        print(torch.nn.functional.softmax(outputs, dim=1)[0] * 100)
    

        
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--cfg', type=str, default='forServiceTest/cfg/yolov3-spp.cfg', help='*.cfg path')
    parser.add_argument('--names', type=str, default='forServiceTest/names/can.names', help='*.names path')
    parser.add_argument('--weights', type=str, default='forServiceTest/weights/first.pt', help='weights path')
    parser.add_argument('--source', type=str, default='forServiceTest/source', help='source')  # input file/folder, 0 for webcam
    parser.add_argument('--output', type=str, default='forServiceTest/output', help='output folder')  # output folder
    parser.add_argument('--img-size', type=int, default=512, help='inference size (pixels)')
    parser.add_argument('--conf-thres', type=float, default=0.3, help='object confidence threshold')
    parser.add_argument('--iou-thres', type=float, default=0.6, help='IOU threshold for NMS')
    parser.add_argument('--fourcc', type=str, default='mp4v', help='output video codec (verify ffmpeg support)')
    parser.add_argument('--half', action='store_true', help='half precision FP16 inference')
    parser.add_argument('--device', default='', help='device id (i.e. 0 or 0,1) or cpu')
    parser.add_argument('--view-img', action='store_true', help='display results')
    parser.add_argument('--save-txt', action='store_true', help='save results to *.txt')
    parser.add_argument('--classes', nargs='+', type=int, help='filter by class')
    parser.add_argument('--agnostic-nms', action='store_true', help='class-agnostic NMS')
    parser.add_argument('--augment', action='store_true', help='augmented inference')
    opt = parser.parse_args()
    opt.cfg = check_file(opt.cfg)  # check file
    opt.names = check_file(opt.names)  # check file
    print(opt)

    with torch.no_grad():
        detect()
