@echo off

echo Starting Tasknestia development environment...

cd Server
set ASPNETCORE_ENVIRONMENT=Development
start cmd /k dotnet watch run