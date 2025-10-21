import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import Spinner from "../../components/Spinner";
import { AuthContext } from "../../helpers/AuthContext";
import ImageCropper from './ImageCropper';
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Alert,
  Dropdown, Form, FloatingLabel
} from "react-bootstrap";
import Table from "../../components/erp/Table";
import ImageFetch from "../../components/erp/ImageFetch";
import EmployeeSearchSelect from "./EmployeeSearchSelect";
import { useHistory } from 'react-router-dom';

import { useTranslation } from "react-i18next";


const AssetStetting = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const [error3, setError3] = useState("");
  const [error4, setError4] = useState("");
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);


  const [currentAsset, setCurrentAsset] = useState({ id: null, serial_number: "", asset_name: "", purchase_date: "", warranty_expiration: "", status: "" });
  const [currentAsset2, setCurrentAsset2] = useState({ id: null, asset_name: "" });

  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [ldata, setLdata] = useState({ serial_number: "", asset_name: "", purchase_date: "", warranty_expiration: "", status: "", employee_id: null });


  const [data, setData] = useState({ step: 10, index: 1, TotalPage: 1, status: "", assets: [] });
  const { auth, logout, updateToken } = useContext(AuthContext);
  const [croppedImage, setCroppedImage] = useState(null);
  /********************************************************************************* */


  const toggleDelete = (item) => {
    setCurrentAsset2({ id: item.id, asset_name: item.asset_name });
    setDeleteModal(!deleteModal);
  };

  const toggleDeleteHide = () => {
    setDeleteModal(!deleteModal);
  }









  const handleDelete = (e) => {

    e.preventDefault();
    setLoading4(true);
    setError4("");

    fetch(`${process.env.REACT_APP_API_URL}/api/asset/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}`, },
      body: JSON.stringify({ id: currentAsset2.id }),
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
      .finally(() => {
        setLoading4(false);
      })

      ;
  };


  const handlePageChange = (newIndex) => {
    console.log("Page changée :", newIndex);

    setData((prevData) => ({ ...prevData, index: newIndex }));
  };
  /********************************************************************************* */
  const latestRequest = useRef(0);

  const getData = () => {
    // Incrémente un ID pour suivre la requête en cours
    const requestId = ++latestRequest.current;


    setLoading(true);
    setData((prevData) => ({ ...prevData, assets: [] }));
    fetch(`${process.env.REACT_APP_API_URL}/api/asset/getList`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ step: data.step, index: data.index })
    })
      .then((res) => {
        if (!res.ok) {
          setError("Network response was not ok")
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((res) => {
        if (res.status) {
          if (latestRequest.current === requestId) {
            setData((prevData) => ({
              ...prevData,
              TotalPage: res.data.TotalPage,
              assets: res.data.assets,
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
      Header: "Image",
      accessor: "asset_image",
      Cell: ({ row }) => {

        return (
          <div style={{ display: "flex", alignItems: "center" }}>


            <ImageFetch
              key={row.original.id}
              image={`/api/file/asset/image?image=${row.original.asset_image}`}
              defaulBody={null}
              className="avatar-lg rounded"
              width={30}
              height={30}
            />


          </div>
        );
      },
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
        const employee = row.original.Employee;
        if (!employee) {
          return <span>Non assigné</span>; // Valeur par défaut si pas d'employé
        }
        const { image, first_name, last_name, id } = employee;
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {image && (

              <ImageFetch
                key={row.original.id}
                image={'/api/file/employee/profile/image'}
                defaulBody={{ id: id }}
                className="avatar-lg rounded"
                width={30}
                height={30}
              />
            )}
            <span>{`${first_name || ""} ${last_name || ""}`}</span>
          </div>
        );
      },
    },
    ,
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
                navigate('/assets/detail/' + row.original.id)
              }
            >
              View
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                navigate('/assets/update/' + row.original.id)
              }
            >
              Update
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                toggleDelete({
                  id: row.original.id,
                  asset_name: row.original.asset_name,
                })
              }
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
                  delete : {currentAsset2.asset_name}
                </p>

              </div>

              <div className="mb-3 text-center">
                <button className="btn rounded-pill btn-primary" type="submit" disabled={loading4}>
                  {loading4 ? <div>{t("Verifying...")}<Spinner color="white" size="sm" /></div> : t("send")}
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
        <Row>
          <Col>
            <Card>
              <Card.Body>
              <div className="text-lg-end mt-xl-0 mt-2">
                      <Button
                        variant="dark"
                        onClick={() => navigate('/assets/new')}
                        className="rounded-pill waves-effect waves-light"
                      >
                        Add assets
                      </Button>

                    </div>
                
                <Table
                  columns={columns}
                  data={data.assets}
                  total_page={data.TotalPage}
                  index={data.index}
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
