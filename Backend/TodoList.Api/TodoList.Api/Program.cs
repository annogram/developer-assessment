using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TodoList.Api.DBContext;
using TodoList.Api.Utiltities;

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
    .AddDbContext<TodoContext>(opt => opt.UseInMemoryDatabase("TodoItemsDB"));

builder.Services.AddHealthChecks();
builder.Services.AddControllers();

var app = builder.Build();

if (builder.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting()
    .UseHttpsRedirection()
    .UseCors(allowedOriginsKey)
    .UseAuthorization()
    .UseEndpoints(endpoints => endpoints.MapControllers());

await app.RunAsync();

