using AutoFixture.Xunit2;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Formats.Asn1;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoList.Application.TodoList.Commands;
using TodoList.Application.TodoList.Ports;
using TodoList.Application.TodoList.Validations;
using TodoList.Domain;
using Xunit;

namespace TodoList.Api.UnitTests.TodoList.Validators;

public class CreateTodoItemValidatorTests
{
    private readonly CreateTodoItemValidator sut;
    private readonly Mock<ITodoListRepository> todolistRepository = new();

    public CreateTodoItemValidatorTests()
    {
        sut = new CreateTodoItemValidator(todolistRepository.Object);
    }

    [Theory]
    [AutoData]
    public async Task Validate_ShouldReturnTrue_WhenItemIsValid(TodoItem item)
    {
        // Arrange
        var command = new CreateTodoItemCommand
        {
            Item = item
        };

        todolistRepository.Setup(x => x.GetAllItems()).ReturnsAsync([]);

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
        var command = new CreateTodoItemCommand
        {
            Item = item with { Description = string.Empty }
        };

        // Act
        var result = await sut.ValidateAsync(command);

        // Assert
        result.IsValid.Should().BeFalse();
    }

    [Theory]
    [AutoData]
    public async Task Validate_ShouldReturnFalse_WhenItemWithSameDescriptionAlreadyExists(TodoItem item)
    {
        // Arrange
        var command = new CreateTodoItemCommand
        {
            Item = item
        };

        todolistRepository.Setup(x => x.GetAllItems()).ReturnsAsync([item]);

        // Act
        var result = await sut.ValidateAsync(command);

        // Assert
        result.IsValid.Should().BeFalse();
    }
}
