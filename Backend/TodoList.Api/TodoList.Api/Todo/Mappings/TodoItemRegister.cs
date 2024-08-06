using Mapster;
using System;
using TodoList.Api.Todo.Models;
using TodoList.Domain;

namespace TodoList.Api.Todo.Mappings;

public class TodoItemRegister : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<TodoItem, TodoItemRecord>()
            .Map(dest => dest.Id, src => src.Id.HasValue ? src.Id : Guid.NewGuid());

        config.NewConfig<TodoItemRecord, TodoItem>()
            .Map(dest => dest.Id, src => src.Id);

    }
}
