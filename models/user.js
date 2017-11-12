const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  facebookId: String,
  spotifyId: String,
  spotifyAccessToken: String,
  spotifyRefreshToken: String,
  spotifyDisplayName: String,
  spotifyProfileURL: String
});

mongoose.model('users', userSchema);
