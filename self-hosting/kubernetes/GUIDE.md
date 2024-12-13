# Self Hosting in Kubernetes

This guide will help you deploy a publicly hosted Omnivore in a Kubernetes cluster.

This config was tested on a Hetzner VPS running microk8s.

### Requirements
- Kubernetes cluster
- Cert-manager installed
- Some kind of container registry
- NFS storage class called `nfs-storage`

### Output

This setup will create the following resources:

- persistent volume claims:
    - `omnivore-minio`, 2Gi
    - `omnivore-postgres`, 1Gi
    - `omnivore-redis`, 1Gi
- publicly accessible services:
    - `omnivore.example.com`: Omnivore web interface
    - `api.omnivore.example.com`: Omnivore API
    - `imageproxy.omnivore.example.com`: Omnivore image proxy
- an Omnivore user

### Steps
    
This guide assumes that you are in the same directory as this guide file: `self-hosting/kubernetes`.

Replace all instances of `example.com` in all configs and manifests with your domain.

Build all images and push them to your container registry. I use podman here but you can use docker as well.

```bash
podman build -t yourusername/omnivore-api -f packages/api/Dockerfile .
podman build -t yourusername/omnivore-web -f packages/web/Dockerfile-self --build-arg-file argfile.conf .
podman build -t yourusername/omnivore-image-proxy ./imageproxy
podman build -t yourusername/omnivore-content-fetch -f packages/content-fetch/Dockerfile .
podman build -t yourusername/omnivore-queue-processor -f packages/api/queue-processor/Dockerfile .
podman build -t yourusername/omnivore-migrate -f packages/db/Dockerfile .
podman push yourusername/omnivore-api
podman push yourusername/omnivore-web
podman push yourusername/omnivore-image-proxy
podman push yourusername/omnivore-content-fetch
podman push yourusername/omnivore-queue-processor
podman push yourusername/omnivore-migrate
```

Copy all template env files and fill them with your values.

```bash
cp .env.minio.template .env.minio
cp .env.omnivore.template .env.omnivore
cp .env.user.template .env.user
cp .env.postgres.template .env.postgres
cp .env.postgres.admin.template .env.postgres.admin
```

Create secrets from the env files.

```bash
kubectl create secret generic omnivore-minio --from-env-file=.env.minio
kubectl create secret generic omnivore --from-env-file=.env.omnivore
kubectl create secret generic omnivore-user --from-env-file=.env.user
kubectl create secret generic omnivore-postgres --from-env-file=.env.postgres
kubectl create secret generic omnivore-postgres-admin --from-env-file=.env.postgres.admin
```

Fill `manifests/config.yml` with your values. Apply config.

```bash
kubectl apply -f manifests/config.yml
```

Apply backing services and watch them come up.

```bash
kubectl apply -f manifests/backing-services
```

Apply the main services.

```bash
kubectl apply -f manifests/main
```
