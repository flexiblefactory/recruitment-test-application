using Microsoft.OpenApi.Models;
using RecruitmentTestApplication;
using RecruitmentTestApplication.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Get the URL of the react static resources from environment variable
var staticUrl = builder.Configuration["STATIC_URL"] ?? "http://localhost:5173";

DB.PrepareDB();
Console.WriteLine("DB prepared!");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddCors();
builder.Services.AddControllers();

builder.Services.AddSwaggerGen(c=>
c.SwaggerDoc("v1",new OpenApiInfo {Title="Recruitment Test App", Version="v1" } )
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(options => options.WithOrigins(staticUrl).AllowAnyHeader().WithMethods("GET","POST", "PUT", "DELETE").AllowCredentials());

app.UseHttpsRedirection();
app.MapControllers();
app.MapHub<ChatHub>("/hub");
app.Run();