using Mediator;
using TodoList.Application.TodoList.Ports;
using TodoList.Domain;

namespace TodoList.Application.TodoList.Commands;

public readonly record struct CreateTodoItemCommand : ICommand<Guid>
{
    public required TodoItem Item { get; init; }
}

public sealed class CreateTodoItemCommandHanlder(
    ITodoListRepository repository) : ICommandHandler<CreateTodoItemCommand, Guid>
{
    public async ValueTask<Guid> Handle(CreateTodoItemCommand command, CancellationToken cancellationToken)
    {
        return await repository.CreateItem(command.Item);
    }
}
