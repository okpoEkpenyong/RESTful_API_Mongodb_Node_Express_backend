const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },
  time: { type: Number, required: true },
  difficulty: { type: Number,  required: true },
 //_id: { type: String,  required: true }, // this is auto gen, and will throw error 400 if used
});

module.exports = mongoose.model('Recipe', recipeSchema);