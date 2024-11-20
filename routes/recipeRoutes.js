const express = require('express');
const recipeController = require('../controllers/recipeController');
const router = express.Router();

router.post('/', recipeController.createRecipe);
router.get('/', recipeController.getRecipes);
router.put('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;