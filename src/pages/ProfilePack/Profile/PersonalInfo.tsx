import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import internal from "stream";
import { Row, Col, Dropdown } from "react-bootstrap";
import moment from 'moment'
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../helpers/AuthContext";

import Access from "../../../utils/Access";
const country = require("../../../assets/static/flag.json")
interface adress {
  pays: string;
  ville: string;
  province: string;
  rue: string;
  code_postal: internal;

}


interface ProfileProps {
  personalDetails: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    bio: string;
    nin: string;
    nas: string;
    gender: string;
    birth_date: string;
    nationality: string;
    flag: string;
    marital_status: string;
    country: string,
    postal_code: number,
    street: string,
    city: string,
    region: string,
    no_emp?:number
  };
}



const PersonalInfo = ({ personalDetails }: ProfileProps) => {
  const navigate = useNavigate();
  const { auth, logout, updateToken } = useContext(AuthContext);
  const flag = process.env.REACT_APP_API_URL + country.find((c: any) => c.code == personalDetails.country)?.flag || null;
  const contryName = country.find((c: any) => c.code == personalDetails.country)?.name || "Unknown";

  const handleGetSharableLink = () => {
    const link = `${process.env.REACT_APP_API_URL}/employee/waiting/detail/${personalDetails.id}`;
    navigator.clipboard.writeText(link).then(() => { }).catch(err => {
      console.error("Erreur lors de la copie du lien :", err);
    });
  };

  const handleUpdate = () => {
    navigate('/employee/update/personalInfo/' + personalDetails.id)
  }
  return (
    <>


      <h5 className="  text-uppercase bg-light p-2">
        <i className="mdi mdi-account-circle me-1"></i> Personal Information
        <div className="card-widgets" onClick={() => navigate('/employee/update/personal_data/' + personalDetails.id)}><i className="mdi mdi-account-circle me-1"></i> edit</div>
      </h5>
      {Access(auth,'HR') && (
        <Dropdown className="card-widgets" align="end">
          <Dropdown.Toggle className="table-action-btn dropdown-toggle btn btn-light btn-xs">
            <i className="mdi mdi-dots-horizontal"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleGetSharableLink}>
              <i className="mdi mdi-link me-2 text-muted vertical-middle"></i>
              Get Sharable Link
            </Dropdown.Item>

            <Dropdown.Item onClick={handleUpdate}>
              <i className="mdi mdi-square-edit-outline me-2 text-muted vertical-middle"></i>
              edit
            </Dropdown.Item>
            {/*<Dropdown.Item onClick={toggleDeleteHide}>
              <i className="mdi mdi-delete me-2 text-muted vertical-middle"></i>
              Remove
            </Dropdown.Item>*/}
          </Dropdown.Menu>
        </Dropdown>
      )}


      <div>
        <h4 className="font-13 text-muted text-uppercase">About Me :</h4>
        <p className="mb-1">{personalDetails.bio}</p>
        <Row>
        <Col lg={6}>
        <h4 className="font-13 text-muted text-uppercase mb-1">
          Date of Birth :
        </h4>
        <p className="mb-1">
          {moment(personalDetails.birth_date).format('LL')}
        </p>

        </Col>
        <Col lg={6}>
        <h4 className="font-13 text-muted text-uppercase mb-1">
          id pointage :
        </h4>
        <p className="mb-1">
          {personalDetails.no_emp}
        </p>
        </Col>
        </Row>
       
        <h4 className="font-13 text-muted text-uppercase mb-1">
          gender :
        </h4>
        <p className="mb-1">{personalDetails.gender ? (personalDetails.gender === "M" ? 'man' : "woman") : undefined}</p>
        <Row>
          <Col lg={6}>
            <h4 className="font-13 text-muted text-uppercase mb-1">
              first name :
            </h4>
            <p className="mb-1">{personalDetails.first_name}</p>
          </Col>
          <Col lg={6}>
            <h4 className="font-13 text-muted text-uppercase mb-1">
              last name :
            </h4>
            <p className="mb-1">{personalDetails.last_name}</p>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <h4 className="font-13 text-muted text-uppercase mb-1">
              email :
            </h4>
            <p className="mb-1">{personalDetails.email}</p>
          </Col>
          <Col lg={6}>
            <h4 className="font-13 text-muted text-uppercase mb-1">
              phone number :
            </h4>
            <p className="mb-1">{personalDetails.phone}</p>
          </Col>
        </Row>
      </div>

      <h5 className="mb-1 mt-4 text-uppercase bg-light p-2">
        <i className="mdi mdi-home-circle me-1"></i> Adress
      </h5>

      <div>
        <Row>
          <Col lg={6}>
            <h4 className="font-13 text-muted text-uppercase mb-1">
              Country :
            </h4>
            <p className="mb-1 text-muted font-13">

              <span > <img
                src={flag}
                className="avatar-sm "
                alt=""
              />{contryName}</span>
            </p>
          </Col>
          <Col lg={6}>
            <h4 className="font-13 text-muted text-uppercase mb-1">
              Postal code :
            </h4>
            <p className="mb-1">{personalDetails.postal_code}</p>
          </Col>
        </Row>
        <Row>
          <Col lg={4}>
            <h4 className="font-13 text-muted text-uppercase mb-1">
              Street :
            </h4>
            <p className="mb-1">{personalDetails.street}</p>
          </Col>
          <Col lg={4}>
            <h4 className="font-13 text-muted text-uppercase mb-1">
              City :
            </h4>
            <p className="mb-1">{personalDetails.city}</p>
          </Col>
          <Col lg={4}>
            <h4 className="font-13 text-muted text-uppercase mb-1">
              Region :
            </h4>
            <p className="mb-1">{personalDetails.region}</p>
          </Col>
        </Row>

      </div>


    </>
  );
};

export default PersonalInfo;
