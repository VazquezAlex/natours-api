// Third party modules.
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

// Local imports
const app = require('./app');

// Catch uncaught exceptions.
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! Shuting down...')
    console.log(err.name, err.message);

    // Exit with exception.
    process.exit(1);
    // TODO: Here we should restart the app.
});

// Make the DB connection string.
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

// Server 👇🏻.
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${ port }...`);
});

// Catch unhandled rejections.
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! Shuting down...')

    // Close the Server and Exit with exception.
    server.close(() => {
        process.exit(1);
        // TODO: Here we should restart the app.
    });
});
