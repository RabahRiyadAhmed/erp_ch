import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import Spinner from "../../components/Spinner";
import { AuthContext } from "../../helpers/AuthContext";
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Alert,
  Dropdown,
} from "react-bootstrap";
import Table from "../../components/Table";



import { useTranslation } from "react-i18next";


const LocationStetting = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const [error3, setError3] = useState("");
  const [error4, setError4] = useState("");
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);
  const [data, setData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({ id: null,name:"",address:"",city:"",country:"",latitude:"",longitude:"" });
  const [currentLocation2, setCurrentLocation2] = useState({ id: null, name: "" });
  const { auth, logout, updateToken } = useContext(AuthContext);
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [ldata, setLdata] = useState({name:"",address:"",city:"",country:"",latitude:"",longitude:""});
  const [dataPosition, setGoogleMapsLink] = useState({latitude:null,longitude:null});
/********************************************************************************* */



const toggleView = (dataP = null) => {
    if (dataP) setGoogleMapsLink(dataP);
    setViewModal(!viewModal);
};

  const toggleCreate = () => {
    setLdata({name:"",address:"",city:"",country:"",latitude:"",longitude:""})
    setCreateModal(!createModal);
  };

  const toggleUpdate = (item) => {
    console.log(item)
    setCurrentLocation({ id: item.id, name: item.name,address:item.address,city:item.city,country:item.country,latitude:item.latitude,longitude:item.longitude });
    console.log(currentLocation)
    setUpdateModal(!updateModal);
  };

  const toggleUpdateHide = () =>{
    setUpdateModal(!updateModal);
  }


  const toggleDelete = (item) => {
    setCurrentLocation2({ id: item.id, name: item.name });
    setDeleteModal(!deleteModal);
  };

  const toggleDeleteHide = () =>{
    setDeleteModal(!deleteModal);
  }

/********************************************************************************* */
const handleSendNewDivion = (e) => {
  
  e.preventDefault();
  setLoading2(true);
  setError2("");
    console.log(ldata)
  fetch(`${process.env.REACT_APP_API_URL}/api/setting/location/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}`, },
    body: JSON.stringify(ldata),
  })
    .then((res) => res.json())
    .then((res) => {

      if (res.status) {
        data.divisons.push(res.data.location)
        setCreateModal(false);
        setError2('')
        if (res.token) {
          updateToken(res.token);
        }
      } else {
        if (res.message === "Token error") {
          logout();
        }
        setError2(res.message || "system error");
      }
    })
    .catch((error) => {
      
      console.log(error)
      setError2(t("An unexpected error occurred."));
    })
    .finally(()=>{
      setLoading2(false);
    });
};







const handleUpdate = (e) => {

  e.preventDefault();
  setLoading3(true);
  setError3("");

  fetch(`${process.env.REACT_APP_API_URL}/api/setting/location/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}`, },
    body: JSON.stringify(currentLocation),
  })
    .then((res) => res.json())
    .then((res) => {

      if (res.status) {
        setError3("")
       //update
       const updatedData = data.divisons.map((div) =>
        div.id === currentLocation.id ? { ...div, name: currentLocation.name } : div
      );
      setData({ ...data, divisons: updatedData });
        toggleUpdateHide()
        if (res.token) {
          updateToken(res.token);
        }
      } else {
        if (res.message === "Token error") {
          logout();
        }
        setError3(res.message || "system error");
      }
    })
    .catch((error) => {
      
      console.log(error)
      setError3(t("An unexpected error occurred."));
    })
    .finally(()=>{
      setLoading3(false);
    })
    
    ;
};



const handleDelete = (e) => {

  e.preventDefault();
  setLoading4(true);
  setError4("");

  fetch(`${process.env.REACT_APP_API_URL}/api/setting/location/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}`, },
    body: JSON.stringify({id:currentLocation2.id}),
  })
    .then((res) => res.json())
    .then((res) => {

      if (res.status) {
        setError4("")
        setData((prev) => ({
          ...prev,
          divisons: prev.divisons.filter((div) => div.id !== currentLocation2.id),
        }));
        toggleDeleteHide()
        if (res.token) {
          updateToken(res.token);
        }
      } else {
        if (res.message === "Token error") {
          logout();
        }
        setError4(res.message || "system error");
      }
    })
    .catch((error) => {
      
      console.log(error)
      setError4(t("An unexpected error occurred."));
    })
    .finally(()=>{
      setLoading4(false);
    })
    
    ;
};


/********************************************************************************* */
  const getData = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/setting/location/getList`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ limit: 10, offset: 0 }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          setData(res.data);
          if (res.token) {
            updateToken(res.token);
          }
        } else {
          if (res.message === "Token error") {
            logout();
          }
          setError(res.message || "system error");
        }
      })
      .catch((error) => {
        console.log(error);
        setError("An unexpected error occurred.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleRetry = () => {
    setError("");
    setLoading(true);
    getData();
  };
  const columns = [
    {
      Header: "ID",
      accessor: "id", 
    },
    {
      Header: "Location Name",
      accessor: "name",
    },
    {
      Header: "Address",
      accessor: "address",
    },
    {
        Header: "City",
        accessor: "city",
    },
    {
        Header: "Country",
        accessor: "country",
    },
    {
        Header: "Latitude",
        accessor: "latitude",
    },
    {
        Header: "Longitude",
        accessor: "longitude",
    },

    {
      Header: "",
      accessor: "actions", // Colonne pour les actions
      Cell: ({ row }) => (
        <Dropdown className="float-end" align="end">
          <Dropdown.Toggle
            as="a"
            className="cursor-pointer card-drop p-0 shadow-none"
          >
            <div className="cursor-pointer">
              <i className="mdi mdi-dots-vertical"></i>
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
          <Dropdown.Item
              onClick={() =>
                toggleView({latitude:row.original.latitude,longitude:row.original.longitude})
              }
            >
              View
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                toggleUpdate({ id: row.original.id, name: row.original.name,address:row.original.address,city:row.original.city,country:row.original.country,latitude:row.original.latitude,longitude:row.original.longitude })
              }
            >
              Update
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                toggleDelete({
                  id: row.original.id,
                  name: row.original.name,
                })
              }
            >
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
    },
  ];
  return (
    <>
      {loading && (
        <div className="loading-container">
          <Spinner type="grow" color="primary" size="lg" />
          <p>Please wait while the data loads...</p>
        </div>
      )}

      {!loading && error && (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      )}

      {!loading && data && !error && (
        <div>
             {/* Sign in Modal */}
        <Modal show={viewModal} onHide={toggleView}>
          <Modal.Body>
            <div className="text-center mt-2 mb-4">
              <div className="auth-logo">
              <h3>map</h3>
               
              </div>
            </div>
            {dataPosition && (
            
            <iframe 
            src={`https://www.google.com/maps?q=${dataPosition.latitude},${dataPosition.longitude}&hl=fr&z=15&output=embed`}
                width="100%" 
                height="400" 
                style={{ border: "0" }} 
                allowFullScreen
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                >
            </iframe>
        
          )}
           
          </Modal.Body>
        </Modal>
        {/******************************************************************************* */}
        <Modal show={createModal} onHide={toggleCreate}>
          <Modal.Body>
            <div className="text-center mt-2 mb-4">
              <div className="auth-logo">
              <span className="logo-xl">
                  <img src={`${process.env.REACT_APP_API_URL}/image/logo.jpeg`} alt="" />
                  </span>
               
              </div>
            </div>
            {error2 && (
            <Alert variant="danger" className="my-2">
              {error2}
            </Alert>
          )}
            <form className="ps-3 pe-3" onSubmit={handleSendNewDivion}>
            <h3> new location</h3>
            <Row>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Location name
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="name"
                        value={ldata.name}
                        onChange={(e) => setLdata({ ...ldata, name: e.target.value })}
                        required
                        placeholder="location name"
                    />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                        Location address
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="address"
                        value={ldata.address}
                        onChange={(e) => setLdata({ ...ldata, address: e.target.value })}
                        required
                        placeholder="location address"
                    />
                    </div>
                </Col>
                </Row>

                <Row>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="city" className="form-label">
                        Location city
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="city"
                        value={ldata.city}
                        onChange={(e) => setLdata({ ...ldata, city: e.target.value })}
                        required
                        placeholder="location city"
                    />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="country" className="form-label">
                        Location country
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="country"
                        value={ldata.country}
                        onChange={(e) => setLdata({ ...ldata, country: e.target.value })}
                        required
                        placeholder="location country"
                    />
                    </div>
                </Col>
                </Row>

                <Row>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="latitude" className="form-label">
                        Location latitude
                    </label>
                    <input
                        className="form-control"
                        type="number"
                        step="0.000001"
                        id="latitude"
                        value={ldata.latitude}
                        onChange={(e) => setLdata({ ...ldata, latitude: parseFloat(e.target.value) })}
                        required
                        placeholder="location latitude"
                    />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="longitude" className="form-label">
                        Location longitude
                    </label>
                    <input
                        className="form-control"
                        type="number"
                        step="0.000001"
                        id="longitude"
                        value={ldata.longitude}
                        onChange={(e) => setLdata({ ...ldata, longitude: parseFloat(e.target.value) })}
                        required
                        placeholder="location longitude"
                    />
                    </div>
                </Col>
                </Row>

              

              

              <div className="mb-3 text-center">
                <button className="btn rounded-pill btn-primary" type="submit" disabled={loading2}>
                {loading2 ? <div>{t("Verifying...")}<Spinner  color="white" size="sm" /></div> : t("send")}
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
        {/******************************************************************************* */}
            {/* Sign in Modal */}
            <Modal show={updateModal} onHide={toggleUpdateHide}>
          <Modal.Body>
            <div className="text-center mt-2 mb-4">
              <div className="auth-logo">
              <span className="logo-xl">
                  <img src={`${process.env.REACT_APP_API_URL}/image/logo.jpeg`} alt="" />
                  </span>
               
              </div>
            </div>
            {error2 && (
            <Alert variant="danger" className="my-2">
              {error2}
            </Alert>
          )}
            <form className="ps-3 pe-3" onSubmit={handleUpdate}>
              <h3> update location</h3>
              <Row>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Location name
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="uname"
                        value={currentLocation.name}
                        onChange={(e) => setCurrentLocation({ ...currentLocation, name: e.target.value })}
                        required
                        placeholder="location name"
                    />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                        Location address
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="address"
                        value={currentLocation.address}
                        onChange={(e) => setCurrentLocation({ ...currentLocation, address: e.target.value })}
                        required
                        placeholder="location address"
                    />
                    </div>
                </Col>
                </Row>

                <Row>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="city" className="form-label">
                        Location city
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="ucity"
                        value={currentLocation.city}
                        onChange={(e) => setCurrentLocation({ ...currentLocation, city: e.target.value })}
                        required
                        placeholder="location city"
                    />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="country" className="form-label">
                        Location country
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="ucountry"
                        value={currentLocation.country}
                        onChange={(e) => setCurrentLocation({ ...currentLocation, country: e.target.value })}
                        required
                        placeholder="location country"
                    />
                    </div>
                </Col>
                </Row>

                <Row>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="latitude" className="form-label">
                        Location latitude
                    </label>
                    <input
                        className="form-control"
                        type="number"
                        step="0.000001"
                        id="ulatitude"
                        value={currentLocation.latitude}
                        onChange={(e) => setCurrentLocation({ ...currentLocation, latitude: parseFloat(e.target.value) })}
                        required
                        placeholder="location latitude"
                    />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="longitude" className="form-label">
                        Location longitude
                    </label>
                    <input
                        className="form-control"
                        type="number"
                        step="0.000001"
                        id="ulongitude"
                        value={currentLocation.longitude}
                        onChange={(e) => setCurrentLocation({ ...currentLocation, longitude: parseFloat(e.target.value) })}
                        required
                        placeholder="location longitude"
                    />
                    </div>
                </Col>
                </Row>

              <div className="mb-3 text-center">
                <button className="btn rounded-pill btn-primary" type="submit" disabled={loading3}>
                {loading3 ? <div>{t("Verifying...")}<Spinner  color="white" size="sm" /></div> : t("send")}
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal> 
         {/******************************************************************************* */}
            {/* Sign in Modal */}
            <Modal show={deleteModal} onHide={toggleDeleteHide}>
          <Modal.Body>
            <div className="text-center mt-2 mb-4">
              <div className="auth-logo">
              <span className="logo-xl">
                  <img src={`${process.env.REACT_APP_API_URL}/image/logo.jpeg`} alt="" />
                  </span>
               
              </div>
            </div>
            {error3 && (
            <Alert variant="danger" className="my-2">
              {error3}
            </Alert>
          )}
            <form className="ps-3 pe-3" onSubmit={handleDelete}>
              <h3> delete location</h3>
              <div className="mb-3">
                <p htmlFor="up_name" className="form-label">
                 Are you sure you want to delete this resource ?
                </p>
                <p htmlFor="up_name" className="form-label">
                  delete : {currentLocation2.name}
                </p>
               
              </div>

              <div className="mb-3 text-center">
                <button className="btn rounded-pill btn-primary" type="submit" disabled={loading4}>
                {loading4 ? <div>{t("Verifying...")}<Spinner  color="white" size="sm" /></div> : t("send")}
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal> 
        {/******************************************************************************* */}
        <Row className="align-items-center mb-3">
          <Col>
            <h4 className="header-title m-0">Location</h4>
          </Col>
          <Col className="text-end">
            <Button
              variant="dark"
              onClick={toggleCreate}
              className="rounded-pill waves-effect waves-light"
            >
              Add Location
            </Button>
          </Col>
        </Row>
       
        <Table
      columns={columns}
      data={data.divisons}
      pageSize={5}
      sizePerPageList={[
        { text: "5", value: 5 },
        { text: "10", value: 10 },
        { text: "20", value: 20 },
      ]}
      isSortable={true}
      pagination={true}
      isSearchable={true}
    />
        </div>
      )}
    </>
  );
};

export default LocationStetting;
