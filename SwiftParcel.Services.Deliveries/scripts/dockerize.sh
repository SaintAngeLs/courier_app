#!/bin/bash
export ASPNETCORE_ENVIRONMENT=Development

cd ../

docker build -t swift-parcel-deliveries-service:latest .

docker tag swift-parcel-deliveries-service:latest adrianvsaint/swift-parcel-deliveries-service:latest

docker push adrianvsaint/swift-parcel-deliveries-service
