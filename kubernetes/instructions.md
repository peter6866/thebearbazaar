## AWS

Create an EKS cluster named "thebearbazaar" with specified configuration:

```bash
eksctl create cluster --name thebearbazaar --region us-east-2 --nodegroup-name my-nodegroup --node-type t3.medium --nodes 2 --nodes-min 1 --nodes-max 3 --managed --node-volume-size=30 --node-volume-type=gp3
```

Install the NGINX Ingress Controller using Helm:

```bash
helm install quickstart ingress-nginx/ingress-nginx
```

Create a Kubernetes secret named "frontend-config" from a JSON file:

```bash
kubectl create secret generic frontend-config --from-file=config.json=../secrets/config.json
```

## AZURE

Create an AKS cluster named "thebearbazaar" with specified configuration:

```bash
az aks create \
  --name thebearbazaar \
  --resource-group rg-personal \
  --location eastus \
  --node-count 2 \
  --node-vm-size Standard_B2s \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 3 \
  --node-osdisk-size 30 \
  --node-osdisk-type Managed
```

Get credentials for the AKS cluster and merge them into the local kubeconfig file:

```bash
az aks get-credentials --resource-group rg-personal --name thebearbazaar
```

Create a Kubernetes secret named "frontend-config" from a JSON file:

```bash
kubectl create secret generic frontend-config --from-file=config.json=../secrets/config.json
```

Install the NGINX Ingress Controller using Helm with Azure-specific annotations and settings:

```bash
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --create-namespace \
  --namespace ingress-basic \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz \
  --set controller.service.externalTrafficPolicy=Local
```
