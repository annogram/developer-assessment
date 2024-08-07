using Mediator;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoList.Application.Behaviors;

public sealed class AuditBehavior<TRequest, TResponse>(ILogger<TRequest> logger) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IMessage
{
    public async ValueTask<TResponse> Handle(TRequest message, CancellationToken cancellationToken, MessageHandlerDelegate<TRequest, TResponse> next)
    {
        logger.LogInformation("Handling message of type {Type}", message.GetType().Name);
        logger.LogInformation("Message content: {@Message}", message);
        var response = await next(message, cancellationToken);
        logger.LogInformation("Handled message of type {Type}", message.GetType().Name);
        logger.LogInformation("Response: {@Response}", response);
        return response;

    }
}
