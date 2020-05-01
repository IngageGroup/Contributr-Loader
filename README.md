# Contributr Loader
Here is a pretty basic service that should provide some nice functionality to update Contributr users. This is a Node app that can connect to a database and:
- getUsers
- createUser
- updateAmountToGive
- deleteUser
- getUserByEmail

There are endpoints for those functions. Using them, a UI should be able to have most of the features we want. 

## Getting Started 
You'll have to add the database connection details to the index file. That should only be used for testing. They should be moved to enviroment variables. 
Start with:`npm install`
You can run the app with: `node index.js`
It runs on port 3000
You can also run with Docker, don't forget to expose the port

There is a postman collection that has examples.