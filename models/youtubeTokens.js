const mongoose = require('mongoose');
const { Schema } = mongoose;

const youtubeTokensSchema = new Schema({
  youtubeId: String,
  accessToken: String,
  refreshToken: String,
  displayName: String
});

module.exports = youtubeTokensSchema;
