# Beer Catch - Object Detection Module

https://github.com/ultralytics/yolov3  
https://github.com/ultralytics/yolov5

These are reference sites.
The basic environmental configuration can be followed by these repositories.

## Pretrained Model
You can use yolov3 or yolov5 model, depending on what you want.
This guide is written on a yolov5 basis.

## Requirements

Python 3.8 or later is recommended. To satisfy the dependency at once, do the following:
```bash
$ pip install -r requirements.txt
```

## Environments

These may be run in any of the following up-to-date verified environments (with all dependencies including [CUDA](https://developer.nvidia.com/cuda)/[CUDNN](https://developer.nvidia.com/cudnn), [Python](https://www.python.org/) and [PyTorch](https://pytorch.org/) preinstalled):  
Inference and learning through gpu are recommended.  
We used GCP with GPU, but you can use either cpu or gpu environment.

- **Google Cloud Platform** [Getting Started with Google Cloud Platform](https://cloud.google.com/gcp/getting-started/?hl=ko) 

## Inference

run_wait_detect.py will load recognition and classification models and start inference 'can' objects. Interworking with mobile is required.
```bash
$ python run_wait_detect.py
```

## Training
Use the largest `--batch-size` your GPU allows (batch sizes shown for 16 GB devices).
```bash
$ python train.py --data coco.yaml --cfg yolov5s.yaml --weights '' --batch-size 64
                                         yolov5m                                40
                                         yolov5l                                24
                                         yolov5x                                16
```
Also, You can use DoTrain.ipynb in Jupyter Notebook. We used this when training.

## About
If you have any inquiries or need supports, email us at kywoo26@gmail.com.  
We don't provide image datasets and models(.pt) in this repository.
