using TodoList.Domain;

namespace TodoList.Application.TodoList.Ports;

public interface ITodoListRepository
{
    Task<IEnumerable<TodoItem>> GetAllItems();
    Task<IEnumerable<TodoItem>> GetById(params Guid[] id);
    Task UpdateItem(TodoItem item);
    Task<Guid> CreateItem(TodoItem item);
    Task DeleteItem(Guid id);
}
