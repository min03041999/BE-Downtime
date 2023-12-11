const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
dotenv.config();

const cors = require('cors');

//Route 
const AuthRoute = require("./src/routes/auth");
const productRoute = require("./src/routes/product");

//
const app = express();

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cors({
    origin: '*'
}));

app.get('/', function (req, res) {
    console.log("GET Request");
    res.send('Hello GET');
});

app.use("/auth", AuthRoute);
app.use("/product", productRoute);

app.listen(process.env.PORT, () => {
    console.log(`Express running ${process.env.PORT}`);
})