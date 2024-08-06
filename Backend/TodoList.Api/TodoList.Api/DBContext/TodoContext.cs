using Microsoft.EntityFrameworkCore;
using TodoList.Api.Todo.Models;

namespace TodoList.Api.DBContext
{
    public class TodoContext : DbContext
    {
        public TodoContext(DbContextOptions<TodoContext> options)
            : base(options)
        {
        }

        public DbSet<TodoItemRecord> TodoItems { get; set; }
    }
}
