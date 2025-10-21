import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <React.Fragment>
      <footer className="footer">
        <div className="container-fluid">
          <Row>
            <Col md={6}>
              {currentYear} &copy; intaj erp{" "}
              <Link to="#">web site</Link>
            </Col>

            <Col md={6}>
             
            </Col>
          </Row>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
