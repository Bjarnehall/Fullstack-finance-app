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

### First stage done

Created an API with full crud functionality, mongoDB hosted on Atlas simple implementaiton tested with postman. In next stage implement hashing method for passwords and make sure duplicates can't be created.

Dependencies so far

    "express": "^5.1.0",
    "mongodb": "^6.20.0",
    "mongoose": "^8.18.2"