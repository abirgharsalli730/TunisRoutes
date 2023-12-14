import React, { useEffect, useState } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import axios from "axios";

const GeoFind = () => {
  const map = useMap();
  const [selectedZone, setSelectedZone] = useState("Traffic");
  const [zoneData, setZoneData] = useState(null);

  useEffect(() => {
    console.log("Selected Zone Changed:", selectedZone);

    const fetchData = async () => {
      try {
        if (selectedZone) {
          const response = await axios.get(
            `http://localhost:5000/user/get-incidents-by-type/${selectedZone}`
          );
          console.log("Fetched Zone Data:", response.data);
          setZoneData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedZone]);

  useEffect(() => {
    map.eachLayer((layer) => {
      if (layer instanceof L.Rectangle || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    if (zoneData) {
      zoneData.forEach((incident) => {
        if (selectedZone === "Traffic") {
          if (incident.location && incident.location.coordinates) {
            const [lat, lon] = incident.location.coordinates;
            L.circle([lat, lon], { radius: 200 })
              .addTo(map)
              .bindPopup("Traffic Zone");
          }
        } else if (selectedZone === "Accident") {
          if (incident.location && incident.location.coordinates) {
            const [lat, lon] = incident.location.coordinates;
            L.circle([lat, lon], { radius: 200 })
              .addTo(map)
              .bindPopup("Accidents Zone");
          }
        }
      });

      if (selectedZone === "Traffic") {
        // Fit the map bounds based on the first incident's location
        const [lat, lon] = zoneData[0].location.coordinates;
        map.fitBounds([[lat, lon]]);
      } else if (selectedZone === "Accident" && zoneData.length > 0) {
        // Fit the map bounds based on the first incident's location
        const [lat, lon] = zoneData[0].location.coordinates;
        map.fitBounds([[lat, lon]]);
      }
    }
  }, [selectedZone, zoneData, map]);

  useEffect(() => {
    L.Control.geocoder({
      defaultMarkGeocode: false,
    })
      .on("markgeocode", function (e) {
        var latlng = e.geocode.center;
        L.marker(latlng).addTo(map).bindPopup(e.geocode.name).openPopup();
        map.fitBounds(e.geocode.bbox);
        setSelectedZone(e.geocode.name.toLowerCase());
      })
      .addTo(map);
  }, [map]);

  return null;
};

export default GeoFind;
