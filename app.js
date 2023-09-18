// Core modules.
const fs = require('fs');

// Third party modules.
const express = require('express');

// Create the app.
const app = express();

// Middleware to use json from body objects.
app.use(express.json());

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

app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1; // We convert it to number.
    const tour = tours.find(tour => tour.id === id);

    if (!tour) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID. We could not find this tour.'
        });
    }

    res.status(200).json({
        status: 'success',
        data: { 
            tour: tour
        }
    });
});

app.post('/api/v1/tours', (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body );

    tours.push(newTour);

    fs.writeFile(`${ __dirname }/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    });
});

app.patch('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(tour => tour.id === id);

    if (!tour) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID. We could not find this tour.'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here>'
        }
    })
});

app.delete('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(tour => tour.id === id);

    if (!tour) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID. We could not find this tour.'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
});

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${ port }...`);
});
