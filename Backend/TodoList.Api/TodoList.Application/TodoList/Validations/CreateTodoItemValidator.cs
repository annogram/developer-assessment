using FluentValidation;
using TodoList.Application.TodoList.Commands;
using TodoList.Application.TodoList.Ports;

namespace TodoList.Application.TodoList.Validations;

public sealed class CreateTodoItemValidator : AbstractValidator<CreateTodoItemCommand>
{
    public CreateTodoItemValidator(ITodoListRepository repository)
    {
        RuleFor(x => x.Item.Description).NotEmpty().WithMessage("Cannot create empty item");
        RuleFor(x => x.Item.Description).MustAsync(async (description, cancellationToken) =>
        {
            var items = await repository.GetAllItems();
            return items.All(x => x.Description != description);
        }).WithMessage("Item with this description already exists");
    }
}
