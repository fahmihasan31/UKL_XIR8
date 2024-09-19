const express = require("express")
const app = express()
app.use(express.json())
const orderController = require(`../controllers/order.controller`)
const { authorize } = require('../controllers/auth.controller')

app.post('/', orderController.createOrder)
app.get('/', authorize, orderController.getAllOrder)

module.exports = app