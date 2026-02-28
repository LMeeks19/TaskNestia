using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Server.Database;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Windows Authentication
builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme)
    .AddNegotiate();

// Add authorization services
builder.Services.AddAuthorization();

// Add controllers
builder.Services.AddControllers();

// Add CORS policy (if you need it for your React app)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithOrigins("https://localhost:7261", "https://localhost:3000");  // React dev server
    });
});

// Add OpenAPI (Swagger) for documentation
builder.Services.AddOpenApi();

var app = builder.Build();

// Use HTTPS redirection (ensure it's using HTTPS)
app.UseHttpsRedirection();

// Use CORS
app.UseCors();

// Use routing (this enables routing for your controllers)
app.UseRouting();

// Enable authentication
app.UseAuthentication();  // Make sure this comes before UseAuthorization

// Enable authorization
app.UseAuthorization();   // Make sure this comes after UseAuthentication

// Map API controllers (this maps all the /api routes to controllers)
app.MapControllers();

// Set up SPA (React) with proxying to React development server
app.MapWhen(context =>
    !context.Request.Path.StartsWithSegments("/api"),  // anything not starting with /api
    builder =>
    {
        builder.UseSpa(spa =>
        {
            spa.Options.SourcePath = "../client";  // Path to React app
            if (app.Environment.IsDevelopment())
            {
                // Automatically start React dev server on F5
                spa.UseReactDevelopmentServer(npmScript: "start");
            }
        });
    });

// Optionally, enable OpenAPI in development for Swagger UI
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.Run();