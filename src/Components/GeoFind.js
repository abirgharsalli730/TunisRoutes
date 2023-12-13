import React, { useEffect, useState } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import axios from "axios";

const GeoFind = () => {
  const map = useMap();
  const [selectedZone, setSelectedZone] = useState(null);
  const [zoneData, setZoneData] = useState(null);

  useEffect(() => {
    console.log("Selected Zone Changed:", selectedZone);

    const fetchData = async () => {
      try {
        // Check if selectedZone is not null before making the API call
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

    // Fetch data on component mount
    fetchData();
  }, [selectedZone]);

  useEffect(() => {
    // Clear previous zones on the map
    map.eachLayer((layer) => {
      if (layer instanceof L.Rectangle || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Display new zones based on the fetched data
    if (zoneData) {
      if (selectedZone === "Traffic") {
        L.rectangle([
          [zoneData.lat1, zoneData.lon1],
          [zoneData.lat2, zoneData.lon2],
        ])
          .addTo(map)
          .bindPopup("Traffic Zone");
      } else if (selectedZone === "Accident") {
        console.log("Accident Zone Data:", zoneData);
        L.circle(
          [zoneData.location.coordinates[0], zoneData.location.coordinates[1]],
          {
            radius: 200,
          }
        )
          .addTo(map)
          .bindPopup("Accidents Zone");
      }

      // Fit the map bounds to the new zones
      map.fitBounds([
        [zoneData.lat1, zoneData.lon1],
        [zoneData.lat2, zoneData.lon2],
      ]);
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
        // Set the selectedZone based on user input or other logic
        // For example, you can set it based on the name or location
        setSelectedZone(e.geocode.name.toLowerCase());
      })
      .addTo(map);
  }, [map]);

  return null;
};

export default GeoFind;
