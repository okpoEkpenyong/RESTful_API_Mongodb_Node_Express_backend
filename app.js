//CONNECTION: mongodb+srv://nuser:<password>@cluster0-twgab.mongodb.net/test?retryWrites=true&w=majority
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

const app = express();

mongoose.connect('mongodb+srv://nuser:nuser@cluster0-twgab.mongodb.net/test?retryWrites=true&w=majority')
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

// takes care of CORS errors. This should be placed before the routes 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

//POST request middleware or route: should be placed above the GET routes otherwise CRUD will be hampered
//endpoint3: adds a new recipe to the database  
app.post('/api/recipes', (req, res, next) => {
    const foodstuff = new Recipe({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time,
        // _id: req.body._id, // this should be left out to avoid error 404
    });
    foodstuff.save().then(
        () => {
            res.status(201).json({
                message: 'Post saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});

// GET route   
//endpoint2:returns the recipe with the provided id from the database
app.get('/api/recipes/:id', (req, res, next) => {
    Recipe.findOne({
        _id: req.params.id
    }).then(
        (foodstuff) => {
            res.status(200).json(foodstuff);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
});


//PUT route
//endpoint4: modifies the recipe with the provided id
app.put('/api/recipes/:id', (req, res, next) => {
    const foodstuff = new Recipe({
        _id: req.params.id,
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time,
    });
    Recipe.updateOne({ _id: req.params.id }, foodstuff).then(
        () => {
            res.status(201).json({
                message: 'Recipe updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});

//DELETE route
//endpoint5: deletes the recipe with the provided id
app.delete('/api/recipes/:id', (req, res, next) => {
    Recipe.deleteOne({ _id: req.params.id }).then(
        () => {
            res.status(200).json({
                message: 'Deleted!'
                //needs to be improved...confirm deletion first
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});

//GET request middleware or route
//endpoint1: returns all recipes in the db
app.use('/api/recipes', (req, res, next) => {
    Recipe.find().then(
        (foodstuffs) => {
            res.status(200).json(foodstuffs);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});

module.exports = app;

//code requires some refactoring to remove repetitive catch blocks