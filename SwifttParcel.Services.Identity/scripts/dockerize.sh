#!/bin/bash
export ASPNETCORE_ENVIRONMENT=Development

cd ../

docker build -t swift-parcel-identity-service:latest .

docker tag swift-parcel-identity-service:latest adrianvsaint/swift-parcel-identity-service:latest

docker push adrianvsaint/swift-parcel-identity-service
