using Mediator;
using TodoList.Application.TodoList.Ports;

namespace TodoList.Application.TodoList.Commands;

public readonly record struct DeleteTodoItemCommand : ICommand
{
    public required Guid Item { get; init; }
}

public sealed class DeleteTodoItemCommandHanlder(
    ITodoListRepository repository) : ICommandHandler<DeleteTodoItemCommand, Unit>
{
    public async ValueTask<Unit> Handle(DeleteTodoItemCommand command, CancellationToken cancellationToken)
    {
        await repository.DeleteItem(command.Item);
        return Unit.Value;
    }
}
