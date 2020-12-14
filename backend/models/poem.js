const mongoose = require("mongoose");

const poemSchema = mongoose.Schema({
  name: {
    type: String,
  },
  poem: {
    type: String,
  },
  creater: {
    type: String,
  },
  language: {
    type: String,
  },
  type: {
    type: String,
  },
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  pdf: {
    type: String,
  },
  created_at: {
    type: Date,
  },
});

module.exports = mongoose.model("Poem", poemSchema);
