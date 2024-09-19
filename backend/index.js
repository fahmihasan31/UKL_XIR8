const express = require(`express`);
const cors = require(`cors`);
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//auth
const auth = require(`./routes/auth.route`);
app.use(`/login`, auth);

//admin
const admin = require(`./routes/admin.route`);
app.use(`/admin`, admin);

//coffee
const coffee = require(`./routes/coffee.route`);
app.use(`/coffee`, coffee);

//orderList
const order = require(`./routes/order.route`);
app.use(`/order`, order);


app.listen(port, () => {
  console.log(`http://localhost: ${port}`)
})