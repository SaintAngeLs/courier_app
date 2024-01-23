#!/bin/bash
export ASPNETCORE_ENVIRONMENT=Development

cd ../

docker build -t swift-parcel-parcels-service:latest .

docker tag swift-parcel-parcels-service:latest adrianvsaint/swift-parcel-parcels-service:latest

docker push adrianvsaint/swift-parcel-parcels-service
