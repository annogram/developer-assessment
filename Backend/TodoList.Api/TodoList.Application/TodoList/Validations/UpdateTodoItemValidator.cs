
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
        RuleFor(x => x.Item).MustAsync(async (item, cancellationToken) =>
        {
            var items = await todoListRepository.GetAllItems();
            return items.Where(w => w.Id != item.Id).All(x => x.Description != item.Description);
        }).WithMessage("Item with this description already exists");

    }
}
