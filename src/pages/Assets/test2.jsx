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
  Dropdown, Form, FloatingLabel 
} from "react-bootstrap";
import Table from "./Table";
import EmployeeSearchSelect from "./EmployeeSearchSelect";
import { useHistory } from 'react-router-dom';

import { useTranslation } from "react-i18next";


const AssetStetting = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const [error3, setError3] = useState("");
  const [error4, setError4] = useState("");
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);
  const [data, setData] = useState({step:25,index:1,TotalPage:1,assets:[]});
  const [currentAsset, setCurrentAsset] = useState({ id: null,serial_number:"",asset_name:"",purchase_date:"",warranty_expiration:"",status:""});
  const [currentAsset2, setCurrentAsset2] = useState({ id: null, name: "" });
  const { auth, logout, updateToken } = useContext(AuthContext);
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [ldata, setLdata] = useState({serial_number:"",asset_name:"",purchase_date:"",warranty_expiration:"",status:"",employee_id:null});
  const [dataPosition, setGoogleMapsLink] = useState({latitude:null,longitude:null});
/********************************************************************************* */



const toggleView = (dataP = null) => {
    if (dataP) setGoogleMapsLink(dataP);
    setViewModal(!viewModal);
};

  const toggleCreate = () => {
    setLdata({serial_number:"",asset_name:"",purchase_date:"",warranty_expiration:"",status:""})
    setCreateModal(!createModal);
  };

  const toggleUpdate = (item) => {
    console.log(item)
    setCurrentAsset({ id: item.id, name: item.name,address:item.address,city:item.city,country:item.country,latitude:item.latitude,longitude:item.longitude });
    console.log(currentAsset)
    setUpdateModal(!updateModal);
  };

  const toggleUpdateHide = () =>{
    setUpdateModal(!updateModal);
  }


  const toggleDelete = (item) => {
    setCurrentAsset2({ id: item.id, name: item.name });
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
  fetch(`${process.env.REACT_APP_API_URL}/api/setting/asset/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}`, },
    body: JSON.stringify(ldata),
  })
    .then((res) => res.json())
    .then((res) => {

      if (res.status) {
        data.assets.push(res.data.asset)

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

  fetch(`${process.env.REACT_APP_API_URL}/api/setting/asset/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}`, },
    body: JSON.stringify(currentAsset),
  })
    .then((res) => res.json())
    .then((res) => {

      if (res.status) {
        setError3("")
       //update
       const updatedData = data.assets.map((div) =>
        div.id === currentAsset.id ? { ...div, name: currentAsset.name } : div
      );
      setData({ ...data, assets: updatedData });
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

  fetch(`${process.env.REACT_APP_API_URL}/api/setting/asset/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}`, },
    body: JSON.stringify({id:currentAsset2.id}),
  })
    .then((res) => res.json())
    .then((res) => {

      if (res.status) {
        setError4("")
        setData((prev) => ({
          ...prev,
          assets: prev.assets.filter((div) => div.id !== currentAsset2.id),
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

const handlePageChange = (newIndex) => {
  console.log("Page changée :", newIndex +1);
  
  setData({...data,index:newIndex}); 
};
/********************************************************************************* */
  const getData = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/asset/getList`, {
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
  }, [data.index]);

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
      Header: "Asset name",
      accessor: "asset_name",
    },
    {
      Header: "Serial number",
      accessor: "serial_number",
    },
    {
        Header: "Purchase date",
        accessor: "purchase_date",
    },
    {
        Header: "Warranty expiration",
        accessor: "warranty_expiration",
    },
    {
        Header: "Status",
        accessor: "status",
    },
    {
      Header: "Employee",
      accessor: "employee",
      Cell: ({ row }) => {
        const employee = row.original.employee;
        if (!employee) {
          return <span>Non assigné</span>; // Valeur par défaut si pas d'employé
        }
        const { image, first_name, last_name } = employee;
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {image && (
              <img
                src={`${process.env.REACT_APP_API_URL}${image}`}
                alt="Employee"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
            )}
            <span>{`${first_name || ""} ${last_name || ""}`}</span>
          </div>
        );
      },
    },
    /*{
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
    },*/
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
            <h3> new asset</h3>
            <Row>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Asset name
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="name"
                        value={ldata.asset_name}
                        onChange={(e) => setLdata({ ...ldata, asset_name: e.target.value })}
                        required
                        placeholder="asset name"
                    />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                        serial number
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="serial_number"
                        value={ldata.serial_number}
                        onChange={(e) => setLdata({ ...ldata, serial_number: e.target.value })}
                        required
                        placeholder="serial number"
                    />
                    </div>
                </Col>
                </Row>

                <Row>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="purchase_date" className="form-label">
                        purchase date
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="purchase_date"
                        value={ldata.purchase_date}
                        onChange={(e) => setLdata({ ...ldata, purchase_date: e.target.value })}
                        required
                        placeholder="purchase date"
                    />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="warranty_expiration" className="form-label">
                        warranty_expiration
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="country"
                        value={ldata.warranty_expiration}
                        onChange={(e) => setLdata({ ...ldata, warranty_expiration: e.target.value })}
                        required
                        placeholder="warranty expiration"
                    />
                    </div>
                </Col>
                </Row>

                <Row>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                    status
                    </label>
                    <FloatingLabel
                      controlId="floatingSelect"
                      label="Works with selects"
                      className="mb-3"
                      aria-label="Floating label select example"
                      value={ldata.status} // Utiliser l'état local
                      onChange={(e) => setLdata({...ldata,status:e.target.value})}
                    >
                      <Form.Select aria-label="Floating label select example">
                        <option>Open this select menu</option>
                        <option value="available">available</option>
                        <option value="assigned">assigned</option>
                        <option value="in_maintenance">in_maintenance</option>
                        <option value="retired">retired</option>
                      </Form.Select>
                     
                    </FloatingLabel>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="longitude" className="form-label">
                        employee
                    </label>
                    <EmployeeSearchSelect
  value={ldata.employee_id}
  onChange={(value) => setLdata({ ...ldata, employee_id: value })}
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
              <h3> update asset</h3>
              <Row>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Asset name
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="uname"
                        value={currentAsset.name}
                        onChange={(e) => setCurrentAsset({ ...currentAsset, name: e.target.value })}
                        required
                        placeholder="asset name"
                    />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                        Asset address
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="address"
                        value={currentAsset.address}
                        onChange={(e) => setCurrentAsset({ ...currentAsset, address: e.target.value })}
                        required
                        placeholder="asset address"
                    />
                    </div>
                </Col>
                </Row>

                <Row>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="city" className="form-label">
                        Asset city
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="ucity"
                        value={currentAsset.city}
                        onChange={(e) => setCurrentAsset({ ...currentAsset, city: e.target.value })}
                        required
                        placeholder="asset city"
                    />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="country" className="form-label">
                        Asset country
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="ucountry"
                        value={currentAsset.country}
                        onChange={(e) => setCurrentAsset({ ...currentAsset, country: e.target.value })}
                        required
                        placeholder="asset country"
                    />
                    </div>
                </Col>
                </Row>

                <Row>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="latitude" className="form-label">
                        Asset latitude
                    </label>
                    <EmployeeSearchSelect
                      value={ldata.employee_id}
                      onChange={(value) => setLdata({ ...ldata, employee_id: value })}
                    />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-3">
                    <label htmlFor="longitude" className="form-label">
                        Asset longitude
                    </label>
                    <input
                        className="form-control"
                        type="number"
                        step="0.000001"
                        id="ulongitude"
                        value={currentAsset.longitude}
                        onChange={(e) => setCurrentAsset({ ...currentAsset, longitude: parseFloat(e.target.value) })}
                        required
                        placeholder="asset longitude"
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
              <h3> delete asset</h3>
              <div className="mb-3">
                <p htmlFor="up_name" className="form-label">
                 Are you sure you want to delete this resource ?
                </p>
                <p htmlFor="up_name" className="form-label">
                  delete : {currentAsset2.name}
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
            <h4 className="header-title m-0">Asset</h4>
          </Col>
          <Col className="text-end">
            <Button
              variant="dark"
              onClick={toggleCreate}
              className="rounded-pill waves-effect waves-light"
            >
              Add Asset
            </Button>
          </Col>
        </Row>
       { 

       }
       <Table
        columns={columns}
        data={data.assets}
        total_page = {data.TotalPage}
        index = {data.index}
        pageSize={data.step}
        sizePerPageList={[
          { text: "5", value: 5 },
          { text: "10", value: 10 },
          { text: "25", value: 25 },
        ]}
        isSortable={true}
        pagination={true}
        isSearchable={true}
       
        handlePageChange={handlePageChange}  // Passer setData comme prop
      />
        </div>
      )}
    </>
  );
};

export default AssetStetting;
