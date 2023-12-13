// models/incident.js
const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  type: String,
  description: String,
  location: {
    type: { type: String },
    coordinates: [Number],
  },
  // Other fields as needed
});

const Incident = mongoose.model("Incident", incidentSchema);

module.exports = Incident;
