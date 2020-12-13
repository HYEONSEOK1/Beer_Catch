# Beer Catch - Image Classification

Only how to train for image classification are provided.  
Because the classification process is included in one pipeline, it can be checked in the object detection module.

## Pretrained Model
You can use this repository to get various pretained model.  
[Pretained models](https://github.com/Cadene/pretrained-models.pytorch)

We experimented with ReXNet_V1-1.0x, Resnet34, Resnet50, EfficientNet-b0.

## Requirements

Python 3.8 or later is recommended. To satisfy the dependency at once, do the following:
```bash
$ pip install -r requirements.txt
```"
If you use anaconda virtual enviroment, type this command "conda install pytorch torchvision torchaudio cudatoolkit=10.2 -c pytorch"

## Environments

These may be run in any of the following up-to-date verified environments (with all dependencies including [CUDA](https://developer.nvidia.com/cuda)/[CUDNN](https://developer.nvidia.com/cudnn), [Python](https://www.python.org/) and [PyTorch](https://pytorch.org/) preinstalled):  
Inference and learning through gpu are recommended.  
We used GCP with GPU, but you can use either cpu or gpu environment.

- **Google Cloud Platform** [Getting Started with Google Cloud Platform](https://cloud.google.com/gcp/getting-started/?hl=ko) 


## Training
Use Train_classifier.ipynb in Jupyter Notebook.

## About
If you have any inquiries or need supports, email us at kywoo26@gmail.com.  
We don't provide image datasets and models(.pt) in this repository.
