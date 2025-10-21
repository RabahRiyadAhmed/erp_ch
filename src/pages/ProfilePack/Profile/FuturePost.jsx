import React from "react";

import { Row, Col } from "react-bootstrap";
import moment from 'moment'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MapWithLeaflet from './MapWithLeaflet'

const PersonalInfo = ({ employee_role }) => {
  return (
    <>
        {console.log(employee_role)}

          <h5 className="  text-uppercase bg-light p-2">
            <i className="mdi mdi-bag-checked me-1"></i> Post
          </h5>

          <div>
          <h4 className="font-13 text-muted text-uppercase mb-1">
              Post :
            </h4>
            <p className="mb-1">
              {employee_role.Role.role_name}
            </p>
            <Row>
                <Col lg={6}>
                    <h4 className="font-13 text-muted text-uppercase mb-1">
                    start :
                    </h4>
                    <p className="mb-1">{employee_role.role_start_date}</p>
                </Col>
                <Col lg={6}>
                    <h4 className="font-13 text-muted text-uppercase mb-1">
                    end :
                    </h4>
                    <p className="mb-1">{employee_role.role_end_date}</p>
                </Col>
            </Row>
            <Row>
                <Col lg={4}>
                    <h4 className="font-13 text-muted text-uppercase mb-1">
                    payment type :
                    </h4>
                    <p className="mb-1">{employee_role.payment_type}</p>
                </Col>
                <Col lg={4}>
                    <h4 className="font-13 text-muted text-uppercase mb-1">
                    payment Rate:
                    </h4>
                    <p className="mb-1">{employee_role.payment_rate} <span className="badge bg-secondary text-light">{employee_role.currency}</span>
                        
                    </p>
                </Col>
                <Col lg={4}>
                    <h4 className="font-13 text-muted text-uppercase mb-1">
                    employment status :
                    </h4>
                    <p className="mb-1">{employee_role.employment_status}</p>
                </Col>
            </Row>

            <Row>
                <Col lg={4}>
                    <h4 className="font-13 text-muted text-uppercase mb-1">
                    localisation :
                    </h4>
                    <p className="mb-1">{employee_role.Location.name}</p>
                </Col>
                <Col lg={4}>
                    <h4 className="font-13 text-muted text-uppercase mb-1">
                    Division :
                    </h4>
                    <p className="mb-1">{employee_role.Division.division_name}</p>
                </Col>
                <Col lg={4}>
                    <h4 className="font-13 text-muted text-uppercase mb-1">
                    Department :
                    </h4>
                    <p className="mb-1">{employee_role.Department.department_name}</p>
                </Col>

                <h4 className="header-title mb-3">Basic Google Map</h4>

                        <div
                        className="gmaps"
                        style={{ position: "relative", overflow: "hidden" }}
                        >
                        <MapWithLeaflet/>
                        </div>
            </Row>
          </div>

    </>
  );
};

export default PersonalInfo;
