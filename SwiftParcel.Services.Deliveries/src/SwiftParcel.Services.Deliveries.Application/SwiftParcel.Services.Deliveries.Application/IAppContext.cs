﻿namespace SwiftParcel.Services.Deliveries.Application
{
    public interface IAppContext
    {
        string RequestId { get; }
        IIdentityContext Identity { get; }
    }
}