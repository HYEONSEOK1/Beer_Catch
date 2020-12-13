import argparse
import os
import time
import json
import shutil
from pathlib import Path

import numpy as np
import cv2
import torch
import torch.nn as nn
import torch.backends.cudnn as cudnn
from torchvision import transforms, models
from numpy import random
from PIL import Image

# from models import *  # set ONNX_EXPORT in models.py
from models.experimental import attempt_load
from utils.datasets import LoadStreams, LoadImages
from utils.general import check_img_size, non_max_suppression, apply_classifier, scale_coords, xyxy2xywh, \
    plot_one_box, strip_optimizer, set_logging, increment_dir
from utils.torch_utils import select_device, load_classifier, time_synchronized


from efficientnet_pytorch import EfficientNet
import rexnetv1


class_names = {
    0: "asahi",      
    1: "kronenbourg1664blanc",  
    2: "carlsberg",
    3: "cassfresh",
    4: "casslight",
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
    36: "somersby",
    37: "desperadosoriginal",
    38: "paulanerweissbier",
    39: "guinnessoriginal",
    40: "filiteweizen",
    41: "heinekendark",
    42: "leffebrune",
    43: "peroni",
    44: "gooseisland312",
    45: "tigerradlergrapefruit",
    46: "gwanghwamun",
    47: "seongsanilchulbong"
}


### detect에 다 때려박지말고 코드 분리할것.
def detect(save_img=False):
    save_dir, source, weights, view_img, save_txt, imgsz = \
        Path(opt.save_dir), opt.source, opt.weights, opt.view_img, opt.save_txt, opt.img_size
    webcam = source.isnumeric() or source.endswith('.txt') or \
             source.lower().startswith(('rtsp://', 'rtmp://', 'http://'))
    
    # Directories
    if save_dir == Path('runs/detect'):  # if default
        save_dir.mkdir(parents=True, exist_ok=True)  # make base
        save_dir = Path(increment_dir(save_dir / 'exp', opt.name))  # increment run
    (save_dir / 'labels' if save_txt else save_dir).mkdir(parents=True, exist_ok=True)  # make new dir
    
    # Initialize
    set_logging()
    device = select_device(opt.device)
    half = device.type != 'cpu'  # half precision only supported on CUDA
    cleardir(source)
    cleardir(save_dir)
    
    # Load model
    model = attempt_load(weights, map_location=device)  # load FP32 model
    modelc = models.resnet50(pretrained=True)
#     modelc = EfficientNet.from_pretrained('efficientnet-b0', num_classes=37)
    
    imgsz = check_img_size(imgsz, s=model.stride.max())  # check img_size
    if half:
        model.half()  # to FP16
    
    ## Classification model
    num_ftrs = modelc.fc.in_features
#     Here the size of each output sample is set to 2.
#     Alternatively, it can be generalized to nn.Linear(num_ftrs, len(class_names)).
    modelc.fc = nn.Linear(num_ftrs, len(class_names)) # Generalized 할것
    modelc.load_state_dict(torch.load('forServiceTest/weights/Resnet50_48class_1206.pt'))
#     modelc.load_state_dict(torch.load('forServiceTest/weights/b0.pt'))





#     modelc = rexnetv1.ReXNetV1(width_mult=1.0, classes=len(class_names)).cuda()
#     modelc.load_state_dict(torch.load('forServiceTest/weights/RexNet_48class_1205.pt'))


    # Second-stage classifier
#     classify = False
#     if classify:
#         modelc = load_classifier(name='resnet101', n=2)  # initialize
#         modelc.load_state_dict(torch.load('weights/resnet101.pt', map_location=device)['model'])  # load weights
#         modelc.to(device).eval()

    # Eval mode
#     model.to(device).eval()
    modelc.to(device).eval()

    # Fuse Conv2d + BatchNorm2d layers
    # model.fuse()

    # Export mode
#     if ONNX_EXPORT:
#         model.fuse()
#         img = torch.zeros((1, 3) + imgsz)  # (1, 3, 320, 192)
#         f = opt.weights.replace(opt.weights.split('.')[-1], 'onnx')  # *.onnx filename
#         torch.onnx.export(model, img, f, verbose=False, opset_version=11,
#                           input_names=['images'], output_names=['classes', 'boxes'])

#         # Validate exported model
#         import onnx
#         model = onnx.load(f)  # Load the ONNX model
#         onnx.checker.check_model(model)  # Check that the IR is well formed
#         print(onnx.helper.printable_graph(model.graph))  # Print a human readable representation of the graph
#         return

    
    # Iterate detection process
    print('Start detection process')
    while True:
        # Wait for source file to arrive.
        if len(os.listdir(source)) < 1:
#             print("no source")
#             time.sleep(3)
            continue
        
        cleardir(save_dir)
        
        # Set Dataloader
        vid_path, vid_writer = None, None
        if webcam:
            view_img = True
            cudnn.benchmark = True  # set True to speed up constant image size inference
            dataset = LoadStreams(source, img_size=imgsz)
        else:
            save_img = True
            dataset = LoadImages(source, img_size=imgsz)

        # Get names and colors
        names = model.module.names if hasattr(model, 'module') else model.names
        colors = [[random.randint(0, 255) for _ in range(3)] for _ in range(len(names))]
        
        
        
        ###
        # Run inference
        t0 = time.time()
        img = torch.zeros((1, 3, imgsz, imgsz), device=device)  # init img
        _ = model(img.half() if half else img) if device.type != 'cpu' else None  # run once
        for path, img, im0s, vid_cap in dataset:
            img = torch.from_numpy(img).to(device)
            img = img.half() if half else img.float()  # uint8 to fp16/32
            img /= 255.0  # 0 - 255 to 0.0 - 1.0
            if img.ndimension() == 3:
                img = img.unsqueeze(0)

            # Inference
            t1 = time_synchronized()
            pred = model(img, augment=opt.augment)[0]

            # Apply NMS
            pred = non_max_suppression(pred, opt.conf_thres, opt.iou_thres, classes=opt.classes, agnostic=opt.agnostic_nms)
            t2 = time_synchronized()

            # Apply Classifier
#             if classify:
#                 pred = apply_classifier(pred, modelc, img, im0s)

            # Process detections
            for i, det in enumerate(pred):  # detections per image
                if webcam:  # batch_size >= 1
                    p, s, im0 = Path(path[i]), '%g: ' % i, im0s[i].copy()
                else:
                    p, s, im0 = Path(path), '', im0s

                save_path = str(save_dir / p.name)
                txt_path = str(save_dir / 'labels' / p.stem) + ('_%g' % dataset.frame if dataset.mode == 'video' else '')
                s += '%gx%g ' % img.shape[2:]  # print string
#                 gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]  # normalization gain whwh
                if det is not None and len(det):
                    # Rescale boxes from img_size to im0 size
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
                        
                        assert cv2.imwrite('%s/%s' % (save_dir, crop_name), crop_img), 'Failure extracting classifier boxes'
#                         print('Crop_%g saved' % j)

                    # Write results
#                     for *xyxy, conf, cls in reversed(det):
#                         if save_txt:  # Write to file
#                             xywh = (xyxy2xywh(torch.tensor(xyxy).view(1, 4)) / gn).view(-1).tolist()  # normalized xywh
#                             line = (cls, *xywh, conf) if opt.save_conf else (cls, *xywh)  # label format
#                             with open(txt_path + '.txt', 'a') as f:
#                                 f.write(('%g ' * len(line) + '\n') % line)

#                         if save_img or view_img:  # Add bbox to image
#                             label = '%s %.2f' % (names[int(cls)], conf)
#                             plot_one_box(xyxy, im0, label=label, color=colors[int(cls)], line_thickness=3)
                
                # Print time (inference + NMS)
#                 print('%sDone. (%.3fs)' % (s, t2 - t1))
            
                # Stream results
                if view_img:
                    cv2.imshow(p, im0)
                    if cv2.waitKey(1) == ord('q'):  # q to quit
                        raise StopIteration

                # Save results (image with detections)
#                 if save_img:
#                     if dataset.mode == 'images':
#                         cv2.imwrite(save_path, im0)
#                     else:
#                         if vid_path != save_path:  # new video
#                             vid_path = save_path
#                             if isinstance(vid_writer, cv2.VideoWriter):
#                                 vid_writer.release()  # release previous video writer

#                             fourcc = 'mp4v'  # output video codec
#                             fps = vid_cap.get(cv2.CAP_PROP_FPS)
#                             w = int(vid_cap.get(cv2.CAP_PROP_FRAME_WIDTH))
#                             h = int(vid_cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
#                             vid_writer = cv2.VideoWriter(save_path, cv2.VideoWriter_fourcc(*fourcc), fps, (w, h))
#                         vid_writer.write(im0)
            
            print('Dectect Done. (%.3fs)' % (time.time() - t0))
            
            # Classify

            preprocess = transforms.Compose([
                    transforms.Resize((224, 224)),
                    transforms.ToTensor(),
                    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
                ])

            # TODO:listdir 개수가 0이면 캔 recognition이 안된 것, 나중에 처리하기.
            crop_list = os.listdir(save_dir)
            
            if len(crop_list) < 1:
                print('Nothing found')
                
                web_path = '/home/K/Dev/webserver/result/result.json'
                with open(web_path, 'w') as f:
                    json.dump([], f)
                break
                
            
            list.sort(crop_list)

            for crop_name in crop_list:
                img_can = Image.open('%s/%s' % (save_dir, crop_name)).convert('RGB')
                img_can = preprocess(img_can)
                inputs = torch.unsqueeze(img_can, 0)
                inputs = inputs.to(device)
                outputs = modelc(inputs)

#                 outputs = outputs.reshape(-1, len(class_names))
                
                _, preds = torch.max(outputs, 1)
                ### TODO:여기서 전체적으로 일정 컨피던스 아래면 '없다' 판정
                
                predict = int(preds[0].cpu())
                queryDic[crop_name].append(predict) # 여기 값에 좌표와 id 담겨있음.
                
                confidence = torch.nn.functional.softmax(outputs, dim=1)[0] * 100
                percent = confidence[predict].item();
                queryDic[crop_name].append(percent)
                
                if percent > 0:
                    print('[%-10s -> %-10s : %g]' % (crop_name, class_names[predict], percent))
                    
                    scores, indices = torch.topk(confidence, 5)
                    scores = scores.cpu().numpy()
                    scores = np.floor(scores*1000)/1000
                    indices = indices.cpu().numpy()
                    
                    print(list(zip([class_names[index] for index in indices], scores)))
                    print()
                
            print('Classify Done. (%.3fs)' % (time.time() - t0))
        
            # Send results to webserver
            result = []
            val_names = ['x1', 'y1', 'x2', 'y2', 'id', 'conf']  

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

# end of detect function

def cleardir(path):
    if os.path.exists(path):
        shutil.rmtree(path)  # delete path folder
    os.makedirs(path)  # make new path folder

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--weights', nargs='+', type=str, default='forServiceTest/weights/yolov5_1205.pt', help='model.pt path(s)')
    parser.add_argument('--source', type=str, default='forServiceTest/source', help='source')  # file/folder, 0 for webcam
    parser.add_argument('--img-size', type=int, default=640, help='inference size (pixels)')
    parser.add_argument('--conf-thres', type=float, default=0.4, help='object confidence threshold')
    parser.add_argument('--iou-thres', type=float, default=0.45, help='IOU threshold for NMS')
    parser.add_argument('--device', default='', help='cuda device, i.e. 0 or 0,1,2,3 or cpu')
    parser.add_argument('--view-img', action='store_true', help='display results')
    parser.add_argument('--save-txt', action='store_true', help='save results to *.txt')
    parser.add_argument('--save-conf', action='store_true', help='save confidences in --save-txt labels')
    parser.add_argument('--save-dir', type=str, default='forServiceTest/output', help='directory to save results')
    parser.add_argument('--name', default='', help='name to append to --save-dir: i.e. runs/{N} -> runs/{N}_{name}')
    parser.add_argument('--classes', nargs='+', type=int, help='filter by class: --class 0, or --class 0 2 3')
    parser.add_argument('--agnostic-nms', action='store_true', help='class-agnostic NMS')
    parser.add_argument('--augment', action='store_true', help='augmented inference')
    parser.add_argument('--update', action='store_true', help='update all models')
    opt = parser.parse_args()
    print(opt)

    with torch.no_grad():
        if opt.update:  # update all models (to fix SourceChangeWarning)
            for opt.weights in ['yolov5s.pt', 'yolov5m.pt', 'yolov5l.pt', 'yolov5x.pt']:
                detect()
                strip_optimizer(opt.weights)
        else:
            detect()
