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


const DepartmentStetting = () => {
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
  const [currentDepartment, setCurrentDepartment] = useState({ id: null, department_name: "" });
  const [currentDepartment2, setCurrentDepartment2] = useState({ id: null, department_name: "" });
  const { auth, logout, updateToken } = useContext(AuthContext);
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [department_name, setDivionName] = useState("");
/********************************************************************************* */
  const toggleCreate = () => {
    setDivionName("")
    setCreateModal(!createModal);
  };


  const toggleUpdate = (item) => {
    console.log(item)
    setCurrentDepartment({ id: item.id, department_name: item.department_name });
    console.log(currentDepartment)
    setUpdateModal(!updateModal);
  };

  const toggleUpdateHide = () =>{
    setUpdateModal(!updateModal);
  }


  const toggleDelete = (item) => {
    setCurrentDepartment2({ id: item.id, department_name: item.department_name });
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

  fetch(`${process.env.REACT_APP_API_URL}/api/setting/department/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}`, },
    body: JSON.stringify({ department_name:department_name}),
  })
    .then((res) => res.json())
    .then((res) => {

      if (res.status) {
        data.divisons.push(res.data.department)
        setCreateModal(false);
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
    })
    
    ;
};







const handleUpdate = (e) => {

  e.preventDefault();
  setLoading3(true);
  setError3("");

  fetch(`${process.env.REACT_APP_API_URL}/api/setting/department/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}`, },
    body: JSON.stringify(currentDepartment),
  })
    .then((res) => res.json())
    .then((res) => {

      if (res.status) {
       //update
       const updatedData = data.divisons.map((div) =>
        div.id === currentDepartment.id ? { ...div, department_name: currentDepartment.department_name } : div
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
        setError2(res.message || "system error");
      }
    })
    .catch((error) => {
      
      console.log(error)
      setError2(t("An unexpected error occurred."));
    })
    .finally(()=>{
      setLoading2(false);
    })
    
    ;
};



const handleDelete = (e) => {

  e.preventDefault();
  setLoading4(true);
  setError4("");

  fetch(`${process.env.REACT_APP_API_URL}/api/setting/department/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}`, },
    body: JSON.stringify({id:currentDepartment2.id}),
  })
    .then((res) => res.json())
    .then((res) => {

      if (res.status) {
        setData((prev) => ({
          ...prev,
          divisons: prev.divisons.filter((div) => div.id !== currentDepartment2.id),
        }));
        toggleDeleteHide()
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
      setLoading2(false);
    })
    
    ;
};


/********************************************************************************* */
  const getData = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/setting/department/getList`, {
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
      accessor: "id", // Correspond au nom de la clé dans les données
    },
    {
      Header: "Department Name",
      accessor: "department_name", // Correspond au nom de la clé dans les données
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
                toggleUpdate({
                  id: row.original.id,
                  department_name: row.original.department_name,
                })
              }
            >
              Update
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                toggleDelete({
                  id: row.original.id,
                  department_name: row.original.department_name,
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
            <h3> new department</h3>
              <div className="mb-3">
                <label htmlFor="department_name" className="form-label">
                  Department name
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="department_name"
                  value={department_name}
                  onChange={(e) => setDivionName(e.target.value)}
                  required
                  placeholder="department name"
                />
              </div>

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
              <h3> update department</h3>
              <div className="mb-3">
                <label htmlFor="up_department_name" className="form-label">
                  Department name
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="up_department_name"
                  disabled={loading3}
                  value={currentDepartment.department_name}
                  onChange={(e) => setCurrentDepartment({id:currentDepartment.id,department_name:e.target.value})}
                  required
                  placeholder="department name"
                  style={{
                    backgroundColor: loading3 ? '#e9ecef' : 'white',
                    color: loading3 ? '#6c757d' : 'black',
                    cursor: loading3 ? 'not-allowed' : 'text',
                  }}
                />
              </div>

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
              <h3> delete department</h3>
              <div className="mb-3">
                <p htmlFor="up_department_name" className="form-label">
                 Are you sure you want to delete this resource ?
                </p>
                <p htmlFor="up_department_name" className="form-label">
                  delete : {currentDepartment2.department_name}
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
            <h4 className="header-title m-0">Department</h4>
          </Col>
          <Col className="text-end">
            <Button
              variant="dark"
              onClick={toggleCreate}
              className="rounded-pill waves-effect waves-light"
            >
              Add Department
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

export default DepartmentStetting;
