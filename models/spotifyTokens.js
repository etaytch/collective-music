const mongoose = require('mongoose');
const { Schema } = mongoose;

const spotifyTokensSchema = new Schema({
  spotifyId: String,
  accessToken: String,
  refreshToken: String,
  displayName: String,
  profileURL: String
});

module.exports = spotifyTokensSchema;
