const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name."],
        unique: true,
        trim: true,
        maxLength: [40, 'A tour name must have less or equal than 40 characters.'],
        minLength: [10, 'A tour name must have more or equal than 10 characters.']
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size'],
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either easy, medium or difficult'
        }
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price."],
    },
    summary: {
        type: String,
        trim: true,
        required: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image.'],
    },
    startDates: {
        type: [Date],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        createdAt: false, // Hide this permanently from the output.
    },
    images: {
        type: [String]
    },
    description: {
        type: String,
        trim: true,
    },
    priceDiscount: {
        type: Number,
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    slug: {
        type: String,
        unique: true,
    },
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },  // Display the virtuals properties.
    toObject: { virtuals: true } // Display the virtuals properties.
});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: Runs before .save() and .create() commands.
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });

    next();
});

// tourSchema.pre('save', function(next) {
//     console.log('Will save document');

//     next();
// });

// tourSchema.post('save', function(doc, next) {
//     console.log(doc);

//     next();
// });

// QUERY MIDDLEWARE.
tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${ Date.now() - this.start } ms.`);
    console.log(docs);

    next();
});

// AGGREGATION MIDDLEWARE.
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

    next();
});


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
