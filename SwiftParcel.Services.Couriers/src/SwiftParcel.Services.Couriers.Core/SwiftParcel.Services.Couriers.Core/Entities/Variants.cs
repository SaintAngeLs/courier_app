using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SwiftParcel.Services.Couriers.Core.Entities
{
    public enum Variants
    {
        Standard =  1 << 0,
        Chemistry = 1 << 1,
        Weapon =    1 << 2,
        Animal =    1 << 3,
        Organ =     1 << 4
    }

}