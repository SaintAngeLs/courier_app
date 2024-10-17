#!/bin/bash
export ASPNETCORE_ENVIRONMENT=Development

cd ../

docker build -t swift-parcel-customers-service:latest .

docker tag swift-parcel-customers-service:latest adrianvsaint/swift-parcel-customers-service:latest

docker push adrianvsaint/swift-parcel-customers-service
