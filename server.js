// Third party modules.
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

// Local imports
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Connect to mongo.
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(con => {
    console.log(con.connections);
    console.log('DB Connection Successful');
});

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name."],
        unique: true
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price."],
    },
    rating: {
        type: Number,
        default: 4.5,
    }
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
    name: 'La Muralla',
    rating: 4.7,
    price: 497
});

// Commented to not re-save this on each run.
// testTour.save().then((doc) => {
//     console.log(doc)
// }).catch(e => {
//     console.log('Error 🐛: ' + e);
// });

// Server 👇🏻.
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${ port }...`);
});
