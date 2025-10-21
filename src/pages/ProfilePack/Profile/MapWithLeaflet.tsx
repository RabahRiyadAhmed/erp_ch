import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// Définir le type de données pour location
type Location = {
  latitude: string;
  longitude: string;
  name: string;
  address: string;
  city: string;
  country: string;
};

const MapWithLeaflet: React.FC = () => {
    const location = {
        latitude: "36.712724",
        longitude: "3.061283",
        google_maps_link:
          "https://www.google.com/maps/place/Rte+Sidi+M'barek,+Birkhadem/@36.7127221,3.0610318,20z/data=!4m15!1m8!3m7!1s0x128fad08de19bf75:0x3d11d43cfe4ebbf!2sRte+Sidi+M'barek,+Birkhadem!3b1!8m2!3d36.7126982!4d3.0612735!16s%2Fg%2F11j0rfbc3f",
      };
    
      return (
        <div>
          <h4 className="header-title mb-3">Carte Google Maps</h4>
          <div className="col-12">
          <iframe
                title="Google Map"
                src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&hl=fr&z=15&output=embed`}
                style={{
                    width: "100%",
                    height: "400px",
                    border: "0",
                }}
                allowFullScreen
                ></iframe>
          </div>
        </div>
      );
};

export default MapWithLeaflet;
