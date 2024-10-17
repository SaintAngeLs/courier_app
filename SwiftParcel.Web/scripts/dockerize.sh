#!/bin/bash
# Define container and image names
CONTAINER_NAME="swiftparcel-web"
IMAGE_NAME="swift-parcel-web"
TAG="latest"
REGISTRY="adrianvsaint"

# Stop and remove the existing container if it exists
echo "- [ ] Stopping and removing existing container if it exists... ... ... ... ... ... ... ... ... ..."
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

# Navigate to the appropriate directory
cd ../

# Build the Docker image
echo "- [ ] Building Docker image... ... ... ... ... ... ... ... ... ..."
docker build -t $IMAGE_NAME:$TAG . --no-cache

# Tag the image for the registry
echo "- [ ] Tagging Docker image... ... ... ... ... ... ... ... ... ..."
docker tag $IMAGE_NAME:$TAG $REGISTRY/$IMAGE_NAME:$TAG

# Push the image to the registry
echo "- [ ] Pushing Docker image to registry... ... ... ... ... ... ... ... ... ..."
docker push $REGISTRY/$IMAGE_NAME:$TAG

# Recreate the container
echo "- [ ] Recreating the container... ... ... ... ... ... ... ... ... ..."
docker run -d --name $CONTAINER_NAME -p 3001:80 $REGISTRY/$IMAGE_NAME:$TAG

echo "Container recreated successfully."
