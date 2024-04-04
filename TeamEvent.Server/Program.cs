
using Microsoft.EntityFrameworkCore;
using TeamEvent.Server.Infrastructure;
using TeamEvent.Server.Persistence;
using TeamEvent.Server.Persistence.Interfaces;

namespace TeamEvent.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
            });


            builder.Services.AddScoped<IEventRepository, EventRepository>();
            builder.Services.AddScoped<IFakeEmailSender, FakeEmailSender>();
            builder.Services.AddScoped<IEventService, EventService>();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.MapStaticAssets();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
