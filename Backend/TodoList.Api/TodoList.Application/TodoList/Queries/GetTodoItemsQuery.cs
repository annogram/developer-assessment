using Mediator;
using TodoList.Application.TodoList.Ports;
using TodoList.Domain;

namespace TodoList.Application.TodoList.Queries;

public readonly record struct GetTodoItemsQuery : IQuery<IEnumerable<TodoItem>>
{
    public IEnumerable<Guid>? Items { get; init; }
}

public sealed class GetTodoItemsQueryHandler(
    ITodoListRepository todoListRepository) : IQueryHandler<GetTodoItemsQuery, IEnumerable<TodoItem>>
{
    public async ValueTask<IEnumerable<TodoItem>> Handle(GetTodoItemsQuery query, CancellationToken cancellationToken)
    {
        if (query.Items is not null && query.Items.Any())
        {
            return await todoListRepository.GetById(query.Items.ToArray());
        }
        return await todoListRepository.GetAllItems();
    }
}
