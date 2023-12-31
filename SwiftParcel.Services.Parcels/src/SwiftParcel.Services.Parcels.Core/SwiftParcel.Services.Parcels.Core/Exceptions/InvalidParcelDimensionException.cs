﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftParcel.Services.Parcels.Core.Exceptions
{
    public class InvalidParcelDimensionException : DomainException
    {
        public InvalidParcelDimensionException(string dimensionType, double dimensionValue)
            : base("invalid_parcel_dimension", $"Parcel dimension ({dimensionType}) is invalid: {dimensionValue}.")
        {

        }
    }
}
