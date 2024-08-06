using System;

namespace TodoList.Api.Todo.Models;

public class TodoItemRecord
{
    public Guid Id { get; set; }
    public string Description { get; set; }
    public bool IsCompleted { get; set; }
}
