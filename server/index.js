const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const MONGOKEY = process.env.MONGOKEY;


const userRoute = require('./routes/users.route.js');

const app = express();
const port = 3005;

// Routes
app.use('/api/users', userRoute);

app.get("/", (req, res) => {
	res.send('Hello from server');
});

mongoose.connect(MONGOKEY)
.then(() => {
	console.log('Connection to cluster success');
	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
})
.catch(() => {
	console.log('Connection to cluster failed');
})
