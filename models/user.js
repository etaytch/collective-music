const mongoose = require('mongoose');
const { Schema } = mongoose;
const spotifyTokensSchema = require('./spotifyTokens');
const youtubeTokensSchema = require('./youtubeTokens');

const userSchema = new Schema({
  googleId: String,
  facebookId: String,
  spotify: spotifyTokensSchema,
  youtube: youtubeTokensSchema,
  lastUpdated: Date
});

mongoose.model('users', userSchema);
