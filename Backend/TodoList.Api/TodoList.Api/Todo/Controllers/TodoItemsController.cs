﻿using Mediator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoList.Application.IoC.Commands;
using TodoList.Application.IoC.Queries;
using TodoList.Domain;

namespace TodoList.Api.Todo.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TodoItemsController(
    IMediator mediator,
    ILogger<TodoItemsController> logger) : ControllerBase
{
    // GET: api/TodoItems
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems()
    {
        var list = await mediator.Send(new GetTodoItemsQuery());
        return Ok(list);
    }

    // GET: api/TodoItems/...
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTodoItem(Guid id)
    {
        var result = (await mediator.Send(new GetTodoItemsQuery
        {
            Items = [id]
        })).ToList();

        if (result is { Count: 0 })
        {
            logger.LogWarning("No item found for id {Guid}", id);
            return NotFound();
        }

        return Ok(result.First());
    }

    // PUT: api/TodoItems/... 
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTodoItem([FromRoute] Guid id, [FromBody] TodoItem todoItem)
    {
        if (id != todoItem.Id)
        {
            return BadRequest();
        }

        var maybeExisting = (await mediator.Send(new GetTodoItemsQuery { Items = [id] })).ToList();

        if (maybeExisting is { Count: 0 })
        {
            return BadRequest("Item doesn't exist");
        }

        await mediator.Send(new UpdateTodoItemCommand { Item = todoItem });

        return NoContent();
    }

    // POST: api/TodoItems 
    [HttpPost]
    public async Task<IActionResult> PostTodoItem([FromBody] TodoItem todoItem)
    {
        if (string.IsNullOrEmpty(todoItem.Description))
        {
            return BadRequest("Description is required");
        }

        var id = await mediator.Send(new CreateTodoItemCommand { Item = todoItem });

        return CreatedAtAction(nameof(GetTodoItem), new { id }, new TodoItem
        {
            Description = todoItem.Description,
            IsCompleted = todoItem.IsCompleted,
            Id = id
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodoItem([FromRoute] Guid id)
    {
        var maybeExists = (await mediator.Send(new GetTodoItemsQuery { Items = [id] })).ToList();
        
        if(maybeExists is { Count: 0 })
        {
            return NotFound($"Cannot find item with id {id} to delete");
        }
        await mediator.Send(new DeleteTodoItemCommand { Item = id });
        return Ok();
    }

}