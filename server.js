const express = require('express');
const app = express();
app.use(express.json());
app.set('port', 3000);

// CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

// MongoDB connection
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb+srv://ramprabumithra:ramasita@cluster0.fyuon.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', (err, client) => {
    if (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
    db = client.db('CourseWork');
    console.log('Connected to MongoDB');
});

// Route to select collection
app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collections/Lessons');
});

// Param middleware for handling collection selection dynamically
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName);
    return next();
});

// Get all documents in a collection
app.get('/collections/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e);
        res.send(results);
    });
});

// Add a new document to a collection
app.post('/collections/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e);
        res.send(results.ops);
    });
});

// Get a single document by ID
const ObjectID = require('mongodb').ObjectID;
app.get('/collections/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
        if (e) return next(e);
        res.send(result);
    });
});

// Update a single document by ID
app.put('/collections/:collectionName/:id', (req, res, next) => {
    req.collection.update(
        { _id: new ObjectID(req.params.id) },
        { $set: req.body },
        { safe: true, multi: false },
        (e, result) => {
            if (e) return next(e);
            res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' });
        }
    );
});

// Update a lesson's availability based on lessonTitle
app.put('/collections/:collectionName/:lessonTitle', (req, res, next) => {
    req.collection.findOne({ lessonTitle: req.params.lessonTitle }, (err, lesson) => {
        if (err) return next(err);
        if (!lesson) {
            return res.status(404).send({ msg: 'Lesson not found' });
        }

        req.collection.update(
            { lessonTitle: req.params.lessonTitle },
            { $set: req.body },
            { safe: true, multi: false },
            (e, result) => {
                if (e) return next(e);
                res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' });
            }
        );
    });
});

// Place order route: Reduce lesson availability when an order is placed
app.post('/placeOrder', async (req, res) => {
    const order = req.body; // This will include the lessons and their quantities

    const lessons = order.lessons;

    try {
        // Check if there's enough availability for each lesson
        for (const lesson of lessons) {
            const lessonDoc = await db.collection('Lessons').findOne({ lessonTitle: lesson.lessonTitle });
            if (!lessonDoc) {
                return res.status(404).json({ msg: `Lesson ${lesson.lessonTitle} not found.` });
            }

            if (lessonDoc.availability < lesson.quantity) {
                return res.status(400).json({ msg: `Not enough availability for ${lesson.lessonTitle}. Only ${lessonDoc.availability} spots available.` });
            }
        }

        // Reduce the availability for each lesson
        for (const lesson of lessons) {
            await db.collection('Lessons').updateOne(
                { lessonTitle: lesson.lessonTitle },
                { $inc: { availability: -lesson.quantity } }
            );
        }

        // Insert the order into the Orders collection
        await db.collection('Orders').insertOne(order);

        // Return a success message
        res.status(200).json({ msg: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ msg: 'Failed to place order' });
    }
});

// Delete a document from a collection by ID
app.delete('/collections/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne(
        { _id: ObjectID(req.params.id) }, (e, result) => {
            if (e) return next(e);
            res.send((result.result.n === 1) ?
                { msg: 'success' } : { msg: 'error' });
        });
});

// Start the server
app.listen(3000, () => {
    console.log('Express.js server running at localhost:3000');
});
