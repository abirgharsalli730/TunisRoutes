// routes/user.js
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { getIncidentsInRegion } = require("../controllers/functions");

const Incident = require("../models/incident"); // MongoDB model for incidents

router.get("/get-incidents", async (req, res) => {
  try {
    const incidents = await Incident.find();
    res.status(200).json(incidents);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching incidents.");
  }
});

router.post("/submit-incident", async (req, res) => {
  try {
    const newIncident = new Incident(req.body);
    await newIncident.save();

    console.log("Incident Saved:", newIncident); // Log the saved incident

    res.status(201).send("Incident submitted successfully.");
  } catch (error) {
    console.error("Error saving incident:", error);
    res.status(500).send("Error submitting the incident.");
  }
});

router.put("/update-incident/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Updating incident with ID:", id);
  console.log("Request Body:", req.body);

  try {
    const updatedIncident = await Incident.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedIncident) {
      console.log("Incident not found");
      return res.status(404).send("Incident not found");
    }

    console.log("Incident Updated:", updatedIncident);
    res.status(200).json(updatedIncident);
  } catch (error) {
    console.error("Error updating incident:", error);
    res.status(500).send("Error updating incident");
  }
});

// Route to delete an incident
router.delete("/delete-incident/:id", async (req, res) => {
  try {
    const deletedIncident = await Incident.findByIdAndDelete(req.params.id);

    if (!deletedIncident) {
      return res.status(404).send("Incident not found.");
    }

    res.status(200).json(deletedIncident);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting the incident.");
  }
});

router.get("/getincidentsinregion/:region", getIncidentsInRegion);

module.exports = router;
