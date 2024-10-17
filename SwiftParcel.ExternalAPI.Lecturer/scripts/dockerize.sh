#!/bin/bash
export ASPNETCORE_ENVIRONMENT=Development

cd ../

docker build -t swift-parcel-external-api-lecturer-service:latest .

docker tag swift-parcel-external-api-lecturer-service:latest adrianvsaint/swift-parcel-external-api-lecturer-service:latest

docker push adrianvsaint/swift-parcel-external-api-lecturer-service
