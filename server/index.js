const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

// Setting of variables and imports
const MONGOKEY = process.env.MONGOKEY;
console.log("Mongo key:", MONGOKEY);

const userRoute = require('./routes/users.route.js');
const app = express();
const port = 3005;

// Middleware
app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:5174',
        credentials: true,
    })
);

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
