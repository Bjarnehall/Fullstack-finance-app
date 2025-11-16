/*
Main program for express API.
*/
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MONGOKEY } = require('../keys.js');
const userRoute = require('./routes/users.route.js');
const tickerRoute = require('./routes/ticker.route.js');
const app = express();
const port = 3005;

/*
Middleware.
*/
// Support for json format
app.use(express.json());

// Set a url that is allowed to access the
// server as an API.
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);
app.get("/test", (req, res) => {
    console.log("Test route hit");
    res.send("Test OK");
});
/*
Routing of API.
*/
// Routes to handle user endpoints
app.use('/api/users', userRoute);
// Routes to handle ticker endpoints
app.use('/api/ticker', tickerRoute);
// Test route to se api is running
app.get("/", (req, res) => {
	res.send('Hello from server');
});

/*
Start server and connects to database.
*/
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
