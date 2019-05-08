kubectl apply -f app/frontend/deployment.yaml
kubectl expose deployment frontend-deployment --target-port=3000 --type=NodePort || \
    echo 'frontend-deployment service already exposed'
kubectl set image deployment frontend-deployment frontend=${FRONTEND_IMAGE}:${FRONTEND_VERSION}

kubectl apply -f app/backend/deployment.yaml
kubectl expose deployment backend-deployment --target-port=80 --type=NodePort || \
    echo 'backend-deployment service already exposed'
kubectl set image deployment backend-deployment backend=${BACKEND_IMAGE}:${BACKEND_VERSION}

kubectl apply -f ingress.yaml