const mongoose = require('mongoose');

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

module.exports = { Movie, Customer, Session };
