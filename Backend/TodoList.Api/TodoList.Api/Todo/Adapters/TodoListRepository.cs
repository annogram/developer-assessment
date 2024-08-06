using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoList.Api.DBContext;
using TodoList.Api.Todo.Models;
using TodoList.Application.TodoList.Ports;
using TodoList.Domain;

namespace TodoList.Api.Todo.Adapters;

public class TodoListRepository(
    TodoContext dbContext,
    IMapper mapper) : ITodoListRepository
{
    public async Task<Guid> CreateItem(TodoItem item)
    {
        var record = mapper.Map<TodoItemRecord>(item);
        dbContext.TodoItems.Add(record);
        await dbContext.SaveChangesAsync();
        return record.Id;
    }

    public async Task DeleteItem(Guid id)
    {
        var record = dbContext.TodoItems.Find(id);
        dbContext.Remove(record);
        await dbContext.SaveChangesAsync();
    }

    public async Task<IEnumerable<TodoItem>> GetAllItems()
    {
        var itemRecords = await dbContext.TodoItems.ToListAsync();
        return itemRecords.Select(s => mapper.Map<TodoItem>(s)).ToList();
    }

    public Task<IEnumerable<TodoItem>> GetById(params Guid[] id)
    {
        var records = dbContext.TodoItems.Where(w => id.Contains(w.Id)).ToList();
        return Task.FromResult(records.Select(s => mapper.Map<TodoItem>(s)));
    }

    public async Task UpdateItem(TodoItem item)
    {
        var record = mapper.Map<TodoItemRecord>(item);
        dbContext.Entry(record).State = EntityState.Modified;
        await dbContext.SaveChangesAsync();

    }
}
