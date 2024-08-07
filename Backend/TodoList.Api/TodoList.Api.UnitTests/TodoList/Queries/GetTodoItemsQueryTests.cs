using AutoFixture.Xunit2;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoList.Application.TodoList.Ports;
using TodoList.Application.TodoList.Queries;
using TodoList.Domain;
using Xunit;

namespace TodoList.Api.UnitTests.TodoList.Queries;

public class GetTodoItemsQueryTests
{

    private readonly GetTodoItemsQueryHandler sut;
    private readonly Mock<ITodoListRepository> todolistRepository = new();

    public GetTodoItemsQueryTests()
    {
        sut = new GetTodoItemsQueryHandler(todolistRepository.Object);
    }

    [Theory]
    [AutoData]
    public async Task Handle_Should_ReturnAllItems_When_NoItemsSpecified(List<TodoItem> mockData)
    {
        // Arrange
        var query = new GetTodoItemsQuery();


        todolistRepository.Setup(x => x.GetAllItems()).ReturnsAsync(mockData);

        // Act
        var result = await sut.Handle(query, default);

        // Assert
        result.Should().BeEquivalentTo(mockData);
    }

    [Theory]
    [AutoData]
    public async Task Handle_ShouldReturnSelectedItems_When_Specified(List<TodoItem> mockData)
    {
        var query = new GetTodoItemsQuery
        {
            Items = mockData.Select(x => x.Id!.Value).Take(1)
        };

        todolistRepository.Setup(x => x.GetById(It.IsAny<Guid[]>())).ReturnsAsync(mockData.Take(1));

        var result = await sut.Handle(query, default);

        result.Should().BeEquivalentTo(result.Take(1));
    }


}
