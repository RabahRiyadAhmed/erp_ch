import React from "react";
import { BasicPortlet } from "../../components/Portlet";
import { WorldVectorMap } from "../../components/VectorMap/";

const RevenueChart = ({ locationData }) => {
  // Transforme les données pour les marqueurs
  const markers = locationData.map((location) => ({
    coords: [parseFloat(location.latitude), parseFloat(location.longitude)],
    name: `${location.name}, ${location.city}, ${location.country}`,
  }));

  // Configuration de la carte vectorielle
  const options = {
    markers: markers,
    markerStyle: {
      initial: {
        r: 9,
        fill: "#6658dd",
        "fill-opacity": 0.9,
        stroke: "#fff",
        "stroke-width": 7,
        "stroke-opacity": 0.4,
      },
      hover: {
        fill: "#6658dd",
        stroke: "#fff",
        "fill-opacity": 1,
        "stroke-width": 1.5,
      },
    },
    backgroundColor: "transparent",
    hoverOpacity: 0.7,
    hoverColor: false,
    regionStyle: {
      initial: {
        fill: "#ced4da",
      },
    },
  };

  return (
    <BasicPortlet cardTitle="Locations" titleClass="header-title">
      <div id="world-map-markers">
        <WorldVectorMap height="433px" width="100%" options={options} />
      </div>
    </BasicPortlet>
  );
};

export default RevenueChart;
