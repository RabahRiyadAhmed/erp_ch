import React from "react";
import { Row, Col, Card, Form, InputGroup, Button, Modal, Alert, Dropdown } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import moment from 'moment'
import LazyLoad from 'react-lazyload';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../helpers/AuthContext";
import getFile from "../../../utils/getFile";
import ImageCropper from "../../../components/erp/ImageCropper";
import Spinner from "../../../components/Spinner";
import { useTranslation } from "react-i18next";
const country = require("../../../assets/static/flag.json")
const UserBox = (props: any) => {
  const { t } = useTranslation();
   const navigate = useNavigate();
  const { auth, logout, updateToken } = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState<any>(null)
  const [imageUrl2, setImageUrl2] = useState<any>(null)
  const [upImageModal, setUpImageModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>(null)
  const data = props.data || {}
  const flag = process.env.REACT_APP_API_URL + country.find((c: any) => c.code == data.employee.nationality)?.flag || null;
  const contryName = country.find((c: any) => c.code == data.employee.nationality)?.name || "Unknown";
  const toggleHide = () => {
    setImageUrl2(null)
    setUpImageModal(!upImageModal);
  }
  const handleImageCropped = (image:any) => {
    setImageUrl2(image)
  };
  useEffect(() => {
    if (auth) {
      const url = `${process.env.REACT_APP_API_URL}/api/file/employee/profile/image`;
      getFile(url, auth.token, { id: data.employee.id }).then(setImageUrl)
    }
  }, [auth])


  const handleSend = (event:any)=>{
    event.preventDefault();
    setLoading(true)
    setError(null)

    if(!imageUrl2) {
      setError("pls ,select image")
      return;
    }

    const formData = new FormData();
    console.log(data.employee.id)
    if(!data){
      return;
    }
      formData.append('id', data.employee.id );
      formData.append('image', imageUrl2); // Gérer le fichier image

      fetch(`${process.env.REACT_APP_API_URL}/api/profile/update/image`, {
        method: "PUT",
        headers: {
  
          Authorization: `Bearer ${auth.token}`,
        },
        body: formData
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status) {
            
            navigate(0)
  
          } else {
            if (res.message === "Token error") {
              logout();
            }
            console.log(res.error)
            setError(res.message || "System error");
          }
          if (res.token) {
            updateToken(res.token);
          }
        })
        .catch((error) => {
          console.error(error);
          setError("An unexpected error occurred.");
        })
        .finally(() => {
          setLoading(false);
        })
  }
  return (
    <>
      <Modal show={upImageModal} onHide={toggleHide}>
        <Modal.Body>
          <div className="text-center mt-2 mb-4">
            <div className="auth-logo">
              

            </div>
          </div>
          {error && (
            <Alert variant="danger" className="my-2">
              {error}
            </Alert>
          )}
          <form  onSubmit={handleSend}>
            <h3 className="text-center"> update image</h3>
            <div className="d-flex justify-content-center align-items-center" >
                        <ImageCropper onImageCropped={handleImageCropped} aspectRatio={1} defaultImage={imageUrl2} defaultBody={{id:data.employee.id}} token={auth.token} />
                      </div>

            <div className="m-3 text-center">
              <button className="btn rounded-pill btn-primary" type="submit" disabled={loading}>
                {loading ? <div>{t("loadinf...")}<Spinner color="white" size="sm" /></div> : t("send")}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>


      <Card className="text-center ">
        <LazyLoad>
          <Card.Img src={imageUrl ? imageUrl : `${process.env.REACT_APP_API_URL}/image/profile.jpg`} className="rounded img-thumbnail mt-2"
            onClick={toggleHide}
          />
        </LazyLoad>
        <Card.Body>

          <h4 className="mb-0">{data.employee.first_name} {data.employee.last_name}</h4>
          <h3 className="mb-0 text-muted">{data && data.employee && data.employee.EmployeeRoles.length!=0 &&  (data.employee.EmployeeRoles[0].Role.role_name)} </h3>

          {/*<button
          type="button"
          className="btn btn-success btn-xs waves-effect mb-2 waves-light"
        >
          Follow
        </button>{" "}
        <button
          type="button"
          className="btn btn-danger btn-xs waves-effect mb-2 waves-light"
        >
          Message
        </button>
        */}

          <div className="text-start mt-3">
            <h4 className="font-13 text-uppercase">About Me :</h4>
            <p className="text-muted font-13 mb-3">
              {data.employee.bio}
            </p>
            <p className="text-muted mb-2 font-13">
              <strong>hiring date :</strong>
              <span className="ms-2">{data.employee.hiring_date}</span>
            </p>
            <p className="text-muted mb-2 font-13">
              <strong>Identification number :</strong>
              <span className="ms-2">{data.employee.identification_number}</span>
            </p>

            <p className="text-muted mb-2 font-13">
              <strong>social security number :</strong>
              <span className="ms-2">{data.employee.social_security_number}</span>
            </p>

            <p className="text-muted mb-2 font-13">
              <strong>gender :</strong>
              <span className="ms-2">{data.employee.gender ? (data.employee.gender === "M" ? 'man' : "woman") : undefined}</span>
            </p>

            <p className="text-muted mb-2 font-13">
              <strong>Mobile :</strong>
              <span className="ms-2">{data.employee.phone}</span>
            </p>

            <p className="text-muted mb-2 font-13">
              <strong>Email :</strong>
              <span className="ms-2 ">{data.employee.email}</span>
            </p>

            <p className="text-muted mb-2 font-13">
              <strong>birth data :</strong>
              <span className="ms-2 ">{data.employee.birth_date}</span>
            </p>

            <p className="text-muted mb-2 font-13">
              <strong>Nationality :</strong>
              <span className="ms-2 ">{contryName} <img
                src={flag}
                className="avatar-sm "
                alt=""
              /></span>
            </p>

            <p className="text-muted mb-2 font-13">
              <strong>marital status :</strong>
              <span className="ms-2 ">{data.employee.marital_status}</span>
            </p>

            <p className="text-muted mb-1 font-13">
              <strong>Department :</strong>
              <span className="ms-2">{data && data.employee && data.employee.EmployeeRoles.length!=0 &&  (data.employee.EmployeeRoles[0].Department.department_name)}</span>
            </p>
            <p className="text-muted mb-1 font-13">
              <strong>Division :</strong>
              <span className="ms-2">{data && data.employee && data.employee.EmployeeRoles.length!=0 &&  (data.employee.EmployeeRoles[0].Division.division_name)}</span>
            </p>
            <p className="text-muted mb-1 font-13">
              <strong>Location :</strong>
              <span className="ms-2">{data && data.employee && data.employee.EmployeeRoles.length!=0 &&  (data.employee.EmployeeRoles[0].Location.name)}</span>
            </p>
          </div>
          <ul className="social-list list-inline mt-3 mb-0">
            <li className="list-inline-item">
              <Link
                to="#"
                className="social-list-item border-primary text-primary"
              >
                <i className="mdi mdi-facebook"></i>
              </Link>
            </li>
            <li className="list-inline-item">
              <Link to="#" className="social-list-item border-danger text-danger">
                <i className="mdi mdi-google"></i>
              </Link>
            </li>
            <li className="list-inline-item">
              <Link to="#" className="social-list-item border-info text-info">
                <i className="mdi mdi-twitter"></i>
              </Link>
            </li>
            <li className="list-inline-item">
              <Link
                to="#"
                className="social-list-item border-secondary text-secondary"
              >
                <i className="mdi mdi-github"></i>
              </Link>
            </li>
          </ul>
        </Card.Body>
      </Card>
    </>
  );
};

export default UserBox;
