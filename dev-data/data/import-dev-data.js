// Core imports.
const fs = require('fs');

// Third party modules.
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Local imports.
const Tour = require('./../../models/tourModels');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');

dotenv.config({ path: './config.env' });

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

// Get the json file data.
const tours = JSON.parse(fs.readFileSync(`${ __dirname }/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${ __dirname }/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${ __dirname }/reviews.json`, 'utf-8'));

// Import data into DB.
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews, { validateBeforeSave: false });
        console.log('Data successfully loaded');
        process.exit();
    } catch (e) {
        console.log(e);
    }
}

// Delete all data from collection.
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data successfully deleted');
        process.exit();
    } catch (e) {
        console.log(e);
    }
}

if (process.argv[2] === '--import') {
    importData();
}
if (process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv);