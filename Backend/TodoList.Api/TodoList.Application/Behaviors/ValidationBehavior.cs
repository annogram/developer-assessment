using FluentValidation;
using Mediator;

namespace TodoList.Application.Behaviors;

public sealed class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IMessage
{
    public async ValueTask<TResponse> Handle(TRequest message, CancellationToken cancellationToken, MessageHandlerDelegate<TRequest, TResponse> next)
    {
        if (!validators.Any())
        {
            return await next(message, cancellationToken);
        }
        var context = new ValidationContext<TRequest>(message);
        var errorsDictionary = await Task.WhenAll(validators
            .Select(async x => await x.ValidateAsync(context)));
        var erroblocks = errorsDictionary
            .SelectMany(x => x.Errors)
            .Where(x => x != null);
        var dedupedErrors = erroblocks
            .GroupBy(x => x.ErrorMessage)
            .Select(x => x.First());
        if (errorsDictionary.Any(a => !a.IsValid))
        {
            throw new ValidationException(dedupedErrors);
        }
        return await next(message, cancellationToken);
    }
}
