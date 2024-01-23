#!/bin/bash
export ASPNETCORE_ENVIRONMENT=Development

cd ../

docker build -t swift-parcel-pricing-service:latest .

docker tag swift-parcel-pricing-service:latest adrianvsaint/swift-parcel-pricing-service:latest

docker push adrianvsaint/swift-parcel-pricing-service
