const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// TODO: Add a call to our API from this backend 
// HINTS:
// API ENDPOINT: https://qd.skyciv.com/run
// API METHOD: POST
// API HEADERS: Content-Type: application/json

// API AUTH: qd@skyciv.com
// API KEY: eJJQX516y4vygq1Qe1w6acsjY8nudFh0AcTPG7bsrdvsgijXLNZhDMwKF4XwemAq

// API INPUT DATA STRUCTURE: 
/* 
    payload: {
        uid: "1011-simple-beam-analysis-calculator",
        auth: "qd@skyciv.com",
        key: "eJJQX516y4vygq1Qe1w6acsjY8nudFh0AcTPG7bsrdvsgijXLNZhDMwKF4XwemAq",
        input: input_data,
        calcs_only: true
    }
*/

app.listen(3000, () => {
	console.log('Server running on http://localhost:3000');
});