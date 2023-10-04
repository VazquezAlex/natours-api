const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name."],
        unique: true,
        trim: true,
        maxLength: [40, 'A tour name must have less or equal than 40 characters.'],
        minLength: [10, 'A tour name must have more or equal than 10 characters.'],
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
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
        validate: {
            validator: function(val) {
                // this only points to current doc on NEW document creation.
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below the regular price'
        }
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
    },
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number,
        }
    ],
    guides: [
        { 
            type: mongoose.Schema.ObjectId,
            ref: 'User' // Stablish a reference to the model.
        }
    ]
}, {
    toJSON: { virtuals: true },  // Display the virtuals properties.
    toObject: { virtuals: true } // Display the virtuals properties.
});

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// Virtually populate the reviews on a tour.
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour', // Relationship field on the other model.
    localField: '_id'     // Field in this model for the relationship.
});

// DOCUMENT MIDDLEWARE: Runs before .save() and .create() commands.
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });

    next();
});

// Embed the guides user into the document, its just a sample, not being used.
// tourSchema.pre('save', async function(next) {
//    const guidesPromises = this.guides.map(async id => await User.findById(id));
//    this.guides = await Promise.all(guidesPromises);

//     next();
// })

// QUERY MIDDLEWARE.
// Only display tour that are not secret.
tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

// Populate the guides on every find query.
tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',                   // Field we are populating.
        select: '-__v -passwordChangedAt' // Fields to display (or hide in this case).
    });
    
    next();
});

// Display how much time the query took to execute.
tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${ Date.now() - this.start } ms.`);
    // console.log(docs);
    
    next();
});


// AGGREGATION MIDDLEWARE.
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

    next();
});


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
