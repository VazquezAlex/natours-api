// Third party modules.
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// Local imports
const app = require('./app');

// Server 👇🏻.
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${ port }...`);
});
