# Deploying a React App as a Web Service and Multi-Container Application

This guide outlines the steps to deploy a React app initially as a web service using Azure Web App and then as a multi-container application using Docker Compose. By following these instructions, you can host your React application in two different deployment scenarios.

## Part 1: Deploy as a Web Service using Azure Web App
### Build Your React App

Build your React app for production:
```npm run build```
This command will create a build folder with optimized production-ready files.

#### Deploy to Azure Web App
Log in to your Azure account using Azure CLI:
```az login```

#### Set the Azure subscription where you want to create the Web App:
```az account set --subscription "Your Subscription Name"```


#### Create group, service plan and webapp :
    ```
    az group create --name frontend-rg --location westeurope
    az appservice plan create --name frontend-service-plan --resource-group frontend-rg --sku B1 --is-linux
    az webapp up --name react-app-in-azure --sku B1 --location westeurope --runtime "node:12LTS"
    ```

## Step 2: Deploy as a Multi-Container Application using Azure Web App

1. Create a `docker-compose.yml` file in your project's root directory if you haven't already.

2. Build and run the multi-container application locally:

```docker-compose up -d```

Once you've verified that your multi-container app is working as expected locally, it's time to deploy it to Azure Web App.

Create an Azure Web App that supports multi-container applications:

```az webapp create --name frontend-container --plan frontend-service-plan --resource-group frontend-rg  --multicontainer-config-type compose --multicontainer-config-file docker-compose.yml```

Show all location:
```az account list-locations -o table```

Create resources group:
```az  group create --name react-rg --location eastus```

Create Azure Container registries:
```az acr create --resource-group frontend-rg --name sampleazurefrontendacr --sku Basic```

Get the login server for an Azure Container Registry:
```az acr show -n sampleazurefrontendacr --query loginServer -o table```

Get the details of an Azure Container Registry:
```az acr show --name sampleazurefrontendacr --resource-group frontend-rg```

Create a new tag for docker image :
```docker tag maldini12/blogs-app:v2 sampleazurefrontendacr.azurecr.io/aci-blogsapp:v1```
Login to ACR:
```az acr login --name sampleazurefrontendacr ```
Push docker image in ACR:
```docker push sampleazurefrontendacr.azurecr.io/aci-blogsapp:v1```

Create Azure container:

```az container create --resource-group react-rg --name appaci --image basicazureacr.azurecr.io/frontend-app-image:v1 --registry-username basicazureacr --registry-password DYeYEa9ntMSNHznVy762KPzWkxMWluYohOz9M7Pp0p+ACRDhtVoc  --ports 80```
<br/>OR
```az container create --resource-group frontend-rg --name mycontaineraci --image sampleazurefrontendacr.azurecr.io/aci-blogsapp:v1 --registry-username sampleazurefrontendacr --registry-password L0hMPrsDk8MJ2lcO2UVyp9VdjJ4qAEZO/8O0cuf1W8+ACRCo9yyG --dns-name-label aci-dns-app --ports 80```
<br/>OR
```az container create --resource-group frontend-rg --name myacicontainer --image sampleazurefrontendacr.azurecr.io/aci-blogsapp:v1 --cpu 1 --memory 1 --registry-login-server sampleazurefrontendacr.azurecr.io --registry-username sampleazurefrontendacr --registry-password L0hMPrsDk8MJ2lcO2UVyp9VdjJ4qAEZO/8O0cuf1W8+ACRCo9yyG --ip-address Public --dns-name-label aci-app-dns --ports 80```

Show container:

```az container show --name appaci --resource-group react-rg -o table```
<br/>OR
```az container show --resource-group frontend-rg --name mycontaineraci  --query instanceView.state```
<br/>OR
```az container show --resource-group frontend-rg --name mycontaineraci  --query "{FQDN:ipAddress.fqdn,ProvisioningState:provisioningState}" --out table```

Show log:
```az container logs --resource-group frontend-rg --name mycontaineraci```

Delete resource group:
```az group delete --name frontend-rg```
