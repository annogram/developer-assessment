# Different decisions made during this assignment

## Front-end

 - Use react
 - Use typescript
 - Deciding between using redux and react-query
    - initially decided on redux but
    - Using react-query because not enough complexity to justify using redux
 - using tailwind for css because bootstrap is the current library and don't wanna mess around with the design of the UI too much
 - splitting folders into domains clean architecture style in the front-end
 - using prettier over eslint
 - using .env for base uri location
 - use debounce sending for updating descriptions so no need for another submit button
 - modify layout so adding a new task is at the bottom of the list
 - add delete button to remove entries
 - enter keypress on tasks to add
 - do not allow empty tasks
 - Using fluent assertion descriptions for error messaging in the front-end

 ## Backend

 - use mediator for clean architecture
 - update to use the webapplication builder instead of webhostbuilder with setup
 - top level commands in program
 - prefer .http files over swagger
 - use mapster for domain model mapping
 - Added fluent validation and mediator pipeline behaviors to handle validation
 - added Audit behavior as an example to show that every command and query could be audited if one so desired
 - Added autofixture for testing
 - Added fluent assertions for testing
 - Added moq for testing
 - Only testing relevant important functionality (mostly)