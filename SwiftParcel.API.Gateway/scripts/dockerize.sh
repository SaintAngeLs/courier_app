#!/bin/bash
export ASPNETCORE_ENVIRONMENT=Development

cd ../

docker build -t swift-parcel-apigateway-service:latest .

docker tag swift-parcel-apigateway-service:latest adrianvsaint/swift-parcel-apigateway-service:latest

docker push adrianvsaint/swift-parcel-apigateway-service

docker push swiftparcel/swift-parcel-apigateway-service