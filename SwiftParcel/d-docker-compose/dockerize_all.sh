#!/bin/bash

directories=(
    "SwiftParcel.API.Gateway"
    "SwiftParcel.ExternalAPI.Lecturer"
    "SwiftParcel.Services.Customers"
    "SwiftParcel.Services.Deliveries"
    "SwiftParcel.Services.Orders"
    "SwiftParcel.Services.Parcels"
    "SwiftParcel.Services.Pricing"
    "SwiftParcel.Web"
    "SwifttParcel.Services.Identity"
)

for dir in "${directories[@]}"; do
    echo "Processing $dir..."

    if [ -f "$dir/scripts/dockerize.sh" ]; then
        echo "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - "
        (cd "$dir/scripts" && ./dockerize.sh)
        echo "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - "
    else
        echo "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - "
        echo "dockerize.sh not found in $dir"
        echo "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - "
    fi
done
