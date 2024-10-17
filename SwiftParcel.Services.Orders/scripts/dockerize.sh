#!/bin/bash
export ASPNETCORE_ENVIRONMENT=Development

cd ../

docker build -t swift-parcel-orders-service:latest .

docker tag swift-parcel-orders-service:latest adrianvsaint/swift-parcel-orders-service:latest

docker push adrianvsaint/swift-parcel-orders-service
