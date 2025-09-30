# Goal of this Project

This project aims to build a fullstack application providing tools that could help traders make decisions based on on analysis and backtested trading methods.

# Development-branch-1.0

## REST-API express, mongoDB

In a first stage I will create a CRUD rest-API using express and mongoDB. In this first stage I will create a cluster to handle user specific data such as login credentials and personal settings.

Tools used
* Codium:   vs-code fork used for writing code.
* Postman:  API testing tool.

### File structure

server/
    index.js
    /controllers
        product.controller.js
    /models
        user.model.js
    /routes
        user.route.js

### Functionality
* Create user-profile
* Read   user-profile
* Update user-profile
* Delete user-profile

### MongoDB

I will use atlas to host the mongoDB database

Cluster
* node-api
Collection
* user-profiles
