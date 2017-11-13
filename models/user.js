const mongoose = require('mongoose');
const { Schema } = mongoose;
const spotifyTokensSchema = require('./spotifyTokens');

const userSchema = new Schema({
  googleId: String,
  facebookId: String,
  spotify: spotifyTokensSchema,
  lastUpdated: Date
});

mongoose.model('users', userSchema);
