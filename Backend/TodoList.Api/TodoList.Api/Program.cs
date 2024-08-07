using Mapster;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TodoList.Api.DBContext;
using TodoList.Api.Todo.Adapters;
using TodoList.Api.Todo.Models;
using TodoList.Api.Utiltities;
using TodoList.Application.IoC;

const string allowedOriginsKey = "_allowLocal";

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddOptions()
    .AddLogging()
    .AllowResolvingKeyedServicesAsDictionary()
    .AddCors(options => options.AddPolicy(name: allowedOriginsKey, policy => 
        policy.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader()))
    .AddDbContext<TodoContext>(opt => opt.UseInMemoryDatabase("TodoItemsDB"))
    .AddHealthChecks();

builder.Services.AddHealthChecks();
builder.Services.AddControllers();

builder.Services.AddTodoListApplication(config => config
    .AddTodoListRepository<TodoListRepository>());

builder.Services.AddMapster();

var mapsterConfig = TypeAdapterConfig.GlobalSettings;
mapsterConfig.Scan(typeof(TodoItemRecord).Assembly);
builder.Services.AddSingleton(mapsterConfig);

var app = builder.Build();

if (builder.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting()
    .UseHttpsRedirection()
    .UseCors(allowedOriginsKey)
    .UseAuthorization()
    .UseEndpoints(endpoints => endpoints.MapControllers())
    .UseHealthChecks("/healthcheck");

await app.RunAsync();

