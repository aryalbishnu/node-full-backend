require('dotenv').config()
const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const app = express();
const userRouter = require('./routers/router');
require('./db/connector');
const port = process.env.PORT || 3000
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, '../templates/views');
const partial_path = path.join(__dirname, '../templates/partials');

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(userRouter);
/*
const jwtConnect = async()=>{
  const token = await jwt.sign("654f6fbf34805a5e3973cf82", "mynameisbishnuaryalfromjapanchibafu");
  console.log(token);
  const verifyToken = await jwt.verify(token, "mynameisbishnuaryalfromjapanchibafu");
  console.log(verifyToken);
}
jwtConnect();
*/
app.listen(port, (req, res)=>{
    console.log(port);
});