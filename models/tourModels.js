const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name."],
        unique: true,
        trim: true
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

    next();j
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
tourSchema.pre('find', function(next) {
    this.find({ secretTour: { $ne: true } });

    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
