const express = require('express');
const router = express.Router();

const CoffeeController = require('../controllers/coffee.controller');
const { authorize } = require('../controllers/auth.controller');

router.get("/", CoffeeController.getAllCoffee);
router.get("/search/:key", CoffeeController.findCoffee);
router.post("/", authorize, CoffeeController.addCoffee);
router.put("/:id", authorize, CoffeeController.updateCoffee);
router.delete("/:id", authorize, CoffeeController.deleteCoffee);

module.exports = router;

