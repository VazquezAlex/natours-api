// Core modules.
const fs = require('fs');

// Third party modules.
const express = require('express');

// Create the app.
const app = express();

// Extract the data for the tours.
const tours = JSON.parse(fs.readFileSync(`${ __dirname }/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { 
            tours: tours
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${ port }...`);
});
