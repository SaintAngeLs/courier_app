#!/bin/bash
export ASPNETCORE_ENVIRONMENT=Development
cd ../src/SwiftParcel.Services.ExternalAPI.Lecturer.Api/SwiftParcel.Services.ExternalAPI.Lecturer.Api
dotnet build -c release