using AutoFixture.Xunit2;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoList.Application.TodoList.Commands;
using TodoList.Application.TodoList.Ports;
using TodoList.Application.TodoList.Validations;
using TodoList.Domain;
using Xunit;

namespace TodoList.Api.UnitTests.TodoList.Validators;

public class UpdateTodoItemValidtorTests
{
    private readonly UpdateTodoItemValidator sut;
    private readonly Mock<ITodoListRepository> todolistRepository = new();

    public UpdateTodoItemValidtorTests()
    {
        sut = new UpdateTodoItemValidator(todolistRepository.Object);
    }

    [Theory]
    [AutoData]
    public async Task Validate_ShouldReturnTrue_WhenItemExists(TodoItem item)
    {
        // Arrange
        var command = new UpdateTodoItemCommand
        {
            Item = item
        };

        todolistRepository.Setup(x => x.GetAllItems()).ReturnsAsync([item]);

        // Act
        var result = await sut.ValidateAsync(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [AutoData]
    public async Task Validate_ShouldReturnFalse_WhenItemHasNoDescription(TodoItem item)
    {
        // Arrange
        var command = new UpdateTodoItemCommand
        {
            Item = item with { Description = string.Empty }
        };

        // Act
        var result = await sut.ValidateAsync(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(x => x.ErrorMessage == "Cannot update to empty item");
    }

    [Theory]
    [AutoData]
    public async Task Validate_ShouldReturnFalse_WhenItemWithSameDescriptionAlreadyExists(TodoItem newItem, TodoItem oldItem)
    {
        // Arrange
        var command = new UpdateTodoItemCommand
        {
            Item = newItem with { Description = oldItem.Description } 
        };

        todolistRepository.Setup(x => x.GetAllItems()).ReturnsAsync([oldItem]);

        // Act
        var result = await sut.ValidateAsync(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(x => x.ErrorMessage == "Item with this description already exists");
    }
}
