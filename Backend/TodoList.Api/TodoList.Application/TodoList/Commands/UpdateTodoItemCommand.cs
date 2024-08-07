using Mediator;
using TodoList.Application.TodoList.Ports;
using TodoList.Domain;

namespace TodoList.Application.TodoList.Commands;

public readonly record struct UpdateTodoItemCommand : ICommand
{
    public required TodoItem Item { get; init; }
}

public sealed class UpdateTodoItemCommandHandler(
    ITodoListRepository repository) : ICommandHandler<UpdateTodoItemCommand, Unit>
{
    public async ValueTask<Unit> Handle(UpdateTodoItemCommand command, CancellationToken cancellationToken)
    {
        await repository.UpdateItem(command.Item);

        return Unit.Value;
    }
}
