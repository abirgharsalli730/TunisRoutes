import React, { useState, useEffect } from "react";
import axios from "axios";
import { parseString } from "xml2js";

const Incident = () => {
  const initialIncident = {
    id: null,
    type: "",
    description: "",
    location: { type: "Point", coordinates: [0, 0] },
  };

  const [incidents, setIncidents] = useState([]);
  const [currentIncident, setCurrentIncident] = useState(initialIncident);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch incidents from the server when the component mounts
    const fetchIncidents = async () => {
      try {
        const soapEnvelope = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\
          xmlns:user="http://localhost:5000/user">\
          <soapenv:Header/>\
          <soapenv:Body>\
            <user:get-incidents/>\
          </soapenv:Body>\
        </soapenv:Envelope>`;

        const response = await axios.post(
          "http://localhost:5000/soap-endpoint",
          soapEnvelope,
          {
            headers: { "Content-Type": "text/xml" },
          }
        );

        // Parse SOAP response
        parseString(response.data, (err, result) => {
          if (!err) {
            setIncidents(result);
          } else {
            console.error("Error parsing SOAP response:", err);
          }
        });
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    fetchIncidents();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the changed property is "location", update the coordinates
    if (name === "latitude" || name === "longitude") {
      setCurrentIncident({
        ...currentIncident,
        location: {
          ...currentIncident.location,
          coordinates: [
            name === "latitude"
              ? parseFloat(value)
              : currentIncident.location.coordinates[0],
            name === "longitude"
              ? parseFloat(value)
              : currentIncident.location.coordinates[1],
          ],
        },
      });
    } else {
      setCurrentIncident({ ...currentIncident, [name]: value });
    }
  };

  const handleAddIncident = async () => {
    try {
      await axios.post(
        "http://localhost:5000/user/submit-incident",
        currentIncident
      );
      // Fetch updated incidents after adding a new incident
      const response = await axios.get(
        "http://localhost:5000/user/get-incidents"
      );
      setIncidents(response.data);
      setCurrentIncident(initialIncident);
    } catch (error) {
      console.error("Error adding incident:", error);
    }
  };

  const handleEditIncident = (index) => {
    setCurrentIncident({ ...incidents[index], id: incidents[index]._id });
    setIsEditing(true);
  };

  const handleUpdateIncident = async () => {
    try {
      if (currentIncident.id !== null) {
        await axios.put(
          `http://localhost:5000/user/update-incident/${currentIncident.id}`,
          currentIncident
        );
        // Fetch updated incidents after updating an incident
        const response = await axios.get(
          "http://localhost:5000/user/get-incidents"
        );
        setIncidents(response.data);
        setCurrentIncident(initialIncident);
        setIsEditing(false);
      } else {
        console.error("Invalid incident id");
      }
    } catch (error) {
      console.error("Error updating incident:", error);
    }
  };

  const handleDeleteIncident = async (index) => {
    try {
      const incidentIdToDelete = incidents[index]._id; // Use _id property as the incident identifier

      if (incidentIdToDelete) {
        await axios.delete(
          `http://localhost:5000/user/delete-incident/${incidentIdToDelete}`
        );
        // Fetch updated incidents after deleting an incident
        const response = await axios.get(
          "http://localhost:5000/user/get-incidents"
        );
        setIncidents(response.data);
      } else {
        console.error("Invalid incident id");
      }
    } catch (error) {
      console.error("Error deleting incident:", error);
    }
  };

  const latitude = currentIncident.location?.coordinates?.[0] || "";
  const longitude = currentIncident.location?.coordinates?.[1] || "";

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        backgroundColor: "#f4f4f4",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ color: "#333" }}>Incidents</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {incidents.map((incident, index) => (
          <li
            key={index}
            style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#fff",
            }}
          >
            <strong>{incident.type}</strong> - {incident.description}
            <button
              style={{
                marginLeft: "10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => handleEditIncident(index)}
            >
              Edit
            </button>
            <button
              style={{
                marginLeft: "10px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => handleDeleteIncident(index)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <form style={{ marginTop: "20px" }}>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Type:
          <input
            type="text"
            name="type"
            value={currentIncident.type}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </label>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Description:
          <input
            type="text"
            name="description"
            value={currentIncident.description}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </label>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Latitude:
          <input
            type="text"
            name="latitude"
            value={currentIncident.location.coordinates[0]}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </label>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Longitude:
          <input
            type="text"
            name="longitude"
            value={currentIncident.location.coordinates[1]}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </label>

        {isEditing ? (
          <button
            type="button"
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={handleUpdateIncident}
          >
            Update Incident
          </button>
        ) : (
          <button
            type="button"
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={handleAddIncident}
          >
            Add Incident
          </button>
        )}
      </form>
    </div>
  );
};
export default Incident;
