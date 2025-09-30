const express = require('express');
//const mongoose = require('mongoose');

const userRoute = require('./routes/users.route.js');

const app = express();
const port = 3005;

// Routes
app.use('/api/users', userRoute);

app.get("/", (req, res) => {
	res.send('Hello from server');
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});