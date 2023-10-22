const mongoose = require("mongoose");
require('dotenv').config()
const URL = process.env.MONGODB_URL

const connectDB = ()=>{
  mongoose.connect('mongodb://localhost/my_database', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to the database!');
  }).catch((error) => {
    console.error(`Error connecting to the database. \n${error}`);
  });
}
module.exports = connectDB