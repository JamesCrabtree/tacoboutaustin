import os
import yaml
import subprocess

path = os.path.dirname(os.path.abspath(__file__))

os.chdir(os.path.dirname(path))

with open('services.yaml') as f:
    data = yaml.load(f)

services = data['services']

frontend = services['frontend']
os.environ['FRONTEND_IMAGE'] = frontend['build']['image name']
os.environ['FRONTEND_VERSION'] = frontend['build']['version']

backend = services['backend']
os.environ['BACKEND_IMAGE'] = backend['build']['image name']
os.environ['BACKEND_VERSION'] = backend['build']['version']

subprocess.run(['/bin/bash', path + '/kube.sh'])