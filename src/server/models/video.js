/**
 * Schema Definitions
 *
 */
var mongoose = require('mongoose');

var videoSchema = new mongoose.Schema({
  //id: String,
  name: String,
  url: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Video2', videoSchema);

