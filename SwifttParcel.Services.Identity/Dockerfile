# Use Microsoft's official .NET 6 SDK image.
# https://hub.docker.com/_/microsoft-dotnet-sdk/
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers.
COPY *.sln .
COPY src/SwiftParcel.Services.Identity.Api/SwiftParcel.Services.Identity.Api/*.csproj ./src/SwiftParcel.Services.Identity.Api/SwiftParcel.Services.Identity.Api/
# Copy the Application, Core, and Infrastructure projects as well.
COPY src/SwiftParcel.Services.Identity.Application/SwiftParcel.Services.Identity.Application/*.csproj ./src/SwiftParcel.Services.Identity.Application/SwiftParcel.Services.Identity.Application/
COPY src/SwiftParcel.Services.Identity.Core/SwiftParcel.Services.Identity.Core/*.csproj ./src/SwiftParcel.Services.Identity.Core/SwiftParcel.Services.Identity.Core/
COPY src/SwiftParcel.Services.Identity.Infrastructure/SwiftParcel.Services.Identity.Infrastructure/*.csproj ./src/SwiftParcel.Services.Identity.Infrastructure/SwiftParcel.Services.Identity.Infrastructure/
# Copy tests projects as well.
COPY tests/SwiftParcel.Services.Identity.Application.UnitTests/Application.UnitTests/*.csproj ./tests/SwiftParcel.Services.Identity.Application.UnitTests/Application.UnitTests/
COPY tests/SwiftParcel.Services.Identity.Infrastructure.UnitTests/Infrastructure.UnitTests/*.csproj ./tests/SwiftParcel.Services.Identity.Infrastructure.UnitTests/Infrastructure.UnitTests/

# Restore the NuGet packages
RUN dotnet restore

# Copy everything else and build the app.
COPY . ./
RUN dotnet publish src/SwiftParcel.Services.Identity.Api/SwiftParcel.Services.Identity.Api -c release -o out

# Use Microsoft's official .NET 6 runtime image.
# https://hub.docker.com/_/microsoft-dotnet-aspnet/
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/out ./
ENV ASPNETCORE_URLS http://*:80
ENV ASPNETCORE_ENVIRONMENT production
ENTRYPOINT ["dotnet", "SwiftParcel.Services.Identity.Api.dll"]
