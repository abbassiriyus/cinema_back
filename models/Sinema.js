const mongoose = require('mongoose');
require("dotenv").config()
const MovieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  director: String,
  stars: [String],
  length: Number,
  rating: Number,
});



const CustomerSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  superadmin:Boolean,
});

const SessionSchema = new mongoose.Schema({
  time: Date,
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  },
  customers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  }],
});

const Movie = mongoose.model('Movie', MovieSchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const Session = mongoose.model('Session', SessionSchema);

Customer.findOne({email:process.env["ADMIN_EMAIL"]}).then(async (exists)=>{
    if(!exists)
      await Customer.create({email:process.env["ADMIN_EMAIL"], password: process.env["ADMIN_PASSWORD"] , name:"admin",superadmin:true})
  })
  
module.exports = { Movie, Customer, Session };
