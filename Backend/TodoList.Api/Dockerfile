FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .

RUN dotnet restore "TodoList.Api/TodoList.Api.csproj"
WORKDIR "/src/TodoList.Api"
RUN dotnet build "TodoList.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TodoList.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TodoList.Api.dll"]