import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import Spinner from "../../../components/Spinner";
import { AuthContext } from "../../../helpers/AuthContext";
import ImageFetch from "../../../components/erp/ImageFetch";
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Alert,
  Dropdown, Form, FloatingLabel 
} from "react-bootstrap";
import Table from "../../../components/erp/Table";

import { useHistory } from 'react-router-dom';

import { useTranslation } from "react-i18next";


const AssetStetting = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);

  


  const [data, setData] = useState({step:10,index:1,TotalPage:1,employee_roles:[]});
  const [order_by,setOrderBy] = useState('id')
  const { auth, logout, updateToken } = useContext(AuthContext);

/********************************************************************************* */










const latestRequest = useRef(0); 

const getData = () => {
  // Incrémente un ID pour suivre la requête en cours
  const requestId = ++latestRequest.current; 
 

  setLoading(true);
  setData((prevData) => ({ ...prevData, employee_roles: [] }));
  fetch(`${process.env.REACT_APP_API_URL}/api/employee/role/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    },
    body: JSON.stringify({ step: data.step, index: data.index,order_by:order_by })
  })
    .then((res) => {
      
      return res.json();
    })
    .then((res) => {
      if (res.status) {
        if (latestRequest.current === requestId) {
          setData((prevData) => ({
            ...prevData,
            TotalPage: res.data.TotalPage,
            employee_roles: res.data.employee_roles,
          }));
        }
    
        
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
      if (error.name === "AbortError") {
        console.log("Requête annulée :", error);
      } else {
        console.error(error);
        setError("An unexpected error occurred.");
      }
    })
    .finally(() => {
      if (latestRequest.current === requestId) {
        setLoading(false); // Met à jour `loading` uniquement pour la dernière requête
      }
    });
};

useEffect(() => {
  getData();
}, [data.index,order_by,data.step]);


  const handleRetry = () => {
    setError("");
    setLoading(true);
    getData();
  };
  const handlePageChange = (newIndex) => {
    console.log("Page changée :", newIndex );
    
    setData((prevData) => ({ ...prevData, index: newIndex }));
  };

  const handleStepChange = (newStep) => {
    console.log(newStep)
    setData((prevData) => ({ ...prevData, index: 1}));
    setData((prevData) => ({ ...prevData,  step:newStep }));
    console.log(data.step)
  }
  const columns = [
    {
      Header: "ID",
      accessor: "id", 
    },
    {
        Header: "image",
        accessor: "image", // Colonne pour les actions
        Cell: ({ row }) => {
        
            return (
                <ImageFetch 
                key={row.original.id}
                image={'/api/file/employee/profile/image'}
                defaulBody={{id:row.original.Employee.id}}
                  className="avatar-lg rounded"
               
              />
         
        )},
    },
    {
      Header: "first name",
      accessor: "first_name",
      Cell: ({ row }) => (row.original.Employee.first_name),
     
    },
    {
      Header: "Last name",
      accessor: "last_name",
      Cell: ({ row }) => (row.original.Employee.last_name),
    },
    {
        Header: "Start",
        accessor: "role_start_date",
        Cell: ({ row }) => (row.original.role_start_date),
    },
    {
        Header: "Role",
        accessor: "role_name",
        Cell: ({ row }) => (row.original.Role.role_name),
    },
    /*{
      Header: "Employee",
      accessor: "employee",
      Cell: ({ row }) => {
        const employee = row.original.Employee;
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
    },*/
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
                navigate('/employee/pending/detail/'+row.original.id)
              }
            >
              View
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                navigate('/employee/form/role/'+row.original.Employee.id+'/'+row.original.id)
              }
            >
              Update
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>navigate('/employee/delete/'+row.original.id)}
            >
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
    }
  ];
  return (
    <>
     <style jsx="true">{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .loading-container p {
          font-size: 1.25rem;
          color: #333;
        }
        .error-container {
          background-color: lightcoral;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
          color: white;
        }
        .error-container button {
          background: none;
          color: white;
          border: 1px solid white;
          padding: 5px 10px;
          cursor: pointer;
        }
        .error-container button:hover {
          background: rgba(255, 255, 255, 0.2);
        }
       
        .nav {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 10px;
          border-bottom: 1px solid #ddd;
        }
        .nav-item {
          flex: none;
        }
        .nav-link {
          padding: 10px 15px;
          color: #007bff;
          text-decoration: none;
        }
      `}</style>

     

        <div>
          


          
        <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col lg={8}>
                  <form className="row gy-2 gx-2 align-items-center justify-content-lg-start justify-content-between">
                    <div className="col-auto">
                      <div className="d-flex align-items-center w-auto">
                        <label htmlFor="status-select" className="me-2">
                          Status
                        </label>
                        <select
                          className="form-select"
                          id="status-select"
                          value={order_by}
                          onChange={(e) =>{
                            
                            setOrderBy( e.target.value);
                          }
                        }
                        >
                          <option value="id">id</option>
                          <option value="first_name">first name</option>
                          <option value="last_name">last name</option>
                          <option value="hiring_date">hiring date</option>
                        </select>
                      </div>
                    </div>
                  </form>
                </Col>

                <Col lg={4}>
                  <div className="text-lg-end mt-xl-0 mt-2">
                  <Button
                      variant="dark"
                      onClick={()=>navigate('/employee/create')}
                      className="rounded-pill waves-effect waves-light"
                    >
                      Add employee
                  </Button>
                   
                  </div>
                </Col>
              </Row>
       <Table
        columns={columns}
        data={data.employee_roles}
        total_page = {data.TotalPage}
        index = {data.index}
        step = {data.step}

        pageSize={data.step}

        sizePerPageList={[
          { text: "5", value: 5 },
          { text: "10", value: 10 },
          { text: "25", value: 25 },
        ]}
        isSortable={true}
        pagination={true}
        isSearchable={false}// le but et avec false 
        isFetching={loading}
        error={error}
        handlePageChange={handlePageChange} 
        handleStepChange={handleStepChange} 
        handleRetry={handleRetry}
      />
      </Card.Body>
          </Card>
        </Col>
      </Row>
        </div>
      
    </>
  );
};

export default AssetStetting;
