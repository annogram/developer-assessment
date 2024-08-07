
using FluentValidation;
using TodoList.Application.TodoList.Commands;
using TodoList.Application.TodoList.Ports;

namespace TodoList.Application.TodoList.Validations;

public class UpdateTodoItemValidator : AbstractValidator<UpdateTodoItemCommand>
{
    public UpdateTodoItemValidator(ITodoListRepository todoListRepository)
    {
        RuleFor(x => x.Item).NotNull();
        RuleFor(x => x.Item.Description).NotEmpty().WithMessage("Cannot update to empty item");
        RuleFor(x => x.Item.Description).MustAsync(async (description, cancellationToken) =>
        {
            var items = await todoListRepository.GetAllItems();
            return items.All(x => x.Description != description);
        }).WithMessage("Item with this description already exists");

    }
}
