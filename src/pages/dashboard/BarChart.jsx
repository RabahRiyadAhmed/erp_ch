import React from "react";
import Chart from "react-apexcharts";
import { Card } from "react-bootstrap";
import { ApexOptions } from "apexcharts";

// Bar chart component displaying department activities
const BarChart = ({ departementActivity }) => {
  // Extract department names and employee counts
  const departmentNames = departementActivity.map(item => item.Department.department_name);
  const employeeCounts = departementActivity.map(item => parseInt(item.employee_count));

  // Default options
  const apexBarChartOpts = {
    chart: {
      height: 380,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    colors: ["#fa5c7c"], // One color since we have one series
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      categories: departmentNames, // Dynamically set the categories based on departments
    },
    legend: {
      offsetY: -10,
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    grid: {
      borderColor: "#f1f3fa",
    },
  };

  // Chart data
  const apexBarChartData = [
    {
      name: "Employee Count",
      data: employeeCounts, // Use the extracted employee counts
    },
  ];

  return (
    <Card>
      <Card.Body>
        <h4 className="header-title mb-3">Department Employee Count</h4>
        <Chart
          options={apexBarChartOpts}
          series={apexBarChartData}
          type="bar"
          className="apex-charts"
        />
      </Card.Body>
    </Card>
  );
};

export default BarChart;
