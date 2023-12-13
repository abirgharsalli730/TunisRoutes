// controllers/functions.js
const Incident = require("../models/incident");

// Function to get all incidents in a certain region
const getIncidentsInRegion = async (region) => {
  try {
    const incidents = await Incident.find({
      location: {
        $geoWithin: {
          $geometry: {
            type: "Polygon",
            coordinates: region,
          },
        },
      },
    });
    return incidents;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getIncidentsInRegion,
};
