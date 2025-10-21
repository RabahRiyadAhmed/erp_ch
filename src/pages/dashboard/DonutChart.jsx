import React from "react";
import Chart from "react-apexcharts";
import { Card } from "react-bootstrap";


// Fonction pour générer une palette de couleurs infinie
const generateColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 137.508) % 360; // Distribution équilibrée
    colors.push(`hsl(${hue}, 70%, 50%)`); // Teinte (hue), saturation, luminosité
  }
  return colors;
};

// Composant DonutChart dynamique
const DonutChart = ({ data, title }) => {
  // Transforme les données pour le graphique
  const labels = data.map((item) => item.status);
  const series = data.map((item) => parseInt(item.employee_count, 10));

  // Génération de couleurs dynamiques
  const colors = generateColors(data.length);

  // Options par défaut
  const apexDonutOpts = {
    chart: {
      height: 320,
      type: "pie",
    },
    labels: labels,
    colors: colors,
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      floating: false,
      fontSize: "14px",
      offsetX: 0,
      offsetY: -10,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  return (
    <Card>
      <Card.Body>
        <h4 className="header-title mb-3">{title}</h4>
        <Chart
          options={apexDonutOpts}
          series={series}
          type="donut"
          height={320}
          className="apex-charts"
        />
      </Card.Body>
    </Card>
  );
};

export default DonutChart;
