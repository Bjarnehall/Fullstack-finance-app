const express = require('express');
const mongoose = require('mongoose');

const { MONGOKEY } = require('../keys.js');

const cors = require('cors');

const userRoute = require('./routes/users.route.js');
const tickerRoute = require('./routes/ticker.route.js');
const app = express();
const port = 3005;

app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

// Routes
app.use('/api/users', userRoute);
app.use('/api/ticker', tickerRoute);

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
