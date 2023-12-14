import React, { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import L from "leaflet";
import styles from "./App.css";
import GeoFind from "./Components/GeoFind";
import Footer from "./Components/Footer";
import Incidents from "./Components/Incidents";

function App() {
  const position = [36.8065, 10.1815];
  const [selectedZone, setSelectedZone] = useState(null);

  const handleZoneChange = (zoneType) => {
    console.log("Selected Zone:", zoneType);
    setSelectedZone(zoneType);
  };

  return (
    <div className="App">
      <div className="zone-buttons">
        <button onClick={() => handleZoneChange("Traffic")} className="Traffic">
          {" "}
          Zones de Trafic{" "}
        </button>
        <button
          onClick={() => handleZoneChange("Accident")}
          className="Accident"
        >
          Zones d'Accidents
        </button>
      </div>
      <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/*  <LeafletGeocoder /> */}
        <GeoFind />
      </MapContainer>
      <Incidents />
      <Footer />
    </div>
  );
}

let DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
});
L.Marker.prototype.options.icon = DefaultIcon;
export default App;
