using FluentValidation;
using Mediator;
using Microsoft.Extensions.DependencyInjection;
using TodoList.Application.Behaviors;
using TodoList.Application.TodoList.Ports;
using TodoList.Application.TodoList.Validations;

namespace TodoList.Application.IoC;

public static class TodoListApplication
{
    public class TodoListApplicationConfiguration
    {
        internal Action<IServiceCollection>? TodoListRepositoryGenerator { get; set; }

        public TodoListApplicationConfiguration AddTodoListRepository<T>() where T: class, ITodoListRepository
        {
            TodoListRepositoryGenerator = services => services.AddScoped<ITodoListRepository, T>();
            return this;
        }
    }

    public static IServiceCollection AddTodoListApplication(this IServiceCollection services, Action<TodoListApplicationConfiguration> config)
    {
        services.AddMediator(opt => opt.ServiceLifetime = ServiceLifetime.Scoped)
            .AddValidatorsFromAssemblyContaining<UpdateTodoItemValidator>()
            .AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>))
            .AddScoped(typeof(IPipelineBehavior<,>), typeof(AuditBehavior<,>));

        var configuration = new TodoListApplicationConfiguration();

        config.Invoke(configuration);

        configuration.TodoListRepositoryGenerator?.Invoke(services);

        return services;
    }
}
