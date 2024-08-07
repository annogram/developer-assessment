using AutoFixture.Xunit2;
using FluentAssertions;
using Moq;
using System;
using System.Threading.Tasks;
using TodoList.Application.TodoList.Commands;
using TodoList.Application.TodoList.Ports;
using TodoList.Domain;
using Xunit;

namespace TodoList.Api.UnitTests.TodoList.Commands;

public class CreateTodoItemTests
{
    private readonly CreateTodoItemCommandHanlder sut;
    private readonly Mock<ITodoListRepository> todolistRepository = new();

    public CreateTodoItemTests()
    {
        sut = new CreateTodoItemCommandHanlder(todolistRepository.Object);
    }

    [Theory]
    [AutoData]
    public async Task Handle_ShouldCreateItem(TodoItem item)
    {
        // Arrange
        var command = new CreateTodoItemCommand
        {
            Item = item
        };

        todolistRepository.Setup(x => x.CreateItem(It.IsAny<TodoItem>())).ReturnsAsync(Guid.NewGuid());

        // Act
        var result = await sut.Handle(command, default);

        // Assert
        result.Should().NotBe(Guid.Empty);
        todolistRepository.Verify(x => x.CreateItem(item), Times.Once);
    }
}
