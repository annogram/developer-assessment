using System;

namespace TodoList.Domain;

public readonly record struct TodoItem
{
    public Guid? Id { get; init; }

    public required string Description { get; init; }

    public required bool IsCompleted { get; init; }
}
