// Core modules.
const fs = require('fs');

// Third party modules.
const express = require('express');

// Create the app.
const app = express();

// Middleware to use json from body objects.
app.use(express.json());

// Adding our own middleware.
app.use((req, res, next) => {
    console.log('Hello from the middleware 👇🏻');
    next();
});

// Updating the request object on our own middleware.
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Extract the data for the tours.
const tours = JSON.parse(fs.readFileSync(`${ __dirname }/dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        time: req.requestTime,
        results: tours.length,
        data: { 
            tours: tours
        }
    });
}

const getTourById = (req, res) => {
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
}

const createTour = (req, res) => {
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
}

const updateTour = (req, res) => {
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
}

const deleteTour = (req, res) => {
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
}

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTourById);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${ port }...`);
});
