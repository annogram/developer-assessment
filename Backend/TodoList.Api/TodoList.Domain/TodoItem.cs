
namespace TodoList.Domain;

public readonly record struct TodoItem(Guid? Id, string Description, bool IsCompleted);
