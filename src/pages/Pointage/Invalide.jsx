import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import Spinner from "../../components/Spinner";
import { AuthContext } from "../../helpers/AuthContext";
import ImageFetch from "../../components/erp/ImageFetch";
import getFile from "../../utils/getFile";
import { FormInput } from "../../components/";
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

import { useHistory } from 'react-router-dom';

import { useTranslation } from "react-i18next";


const AssetStetting = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [error2, setError2] = useState("");
    const [loading2, setLoading2] = useState(false);
    const [document_id, setDocumentId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false)
    const [newModal, setNewModal] = useState(false)
    const [file, setFile] = useState(null)
    const [file_name, setFileName] = useState(null)
    const [data, setData] = useState({ step: 10, index: 1, TotalPage: 1, doc: [] });
    const [order_by, setOrderBy] = useState(null)
    const { auth, logout, updateToken } = useContext(AuthContext);

    /********************************************************************************* */

    const getFileIcon = (fileType) => {
        if (!fileType) return "file";
        if (fileType.startsWith("image/")) return "image-outline";
        if (fileType.startsWith("video/")) return "video-outline";
        if (fileType.startsWith("application/pdf")) return "file-pdf-outline";
        if (fileType.startsWith("application/")) return "file-document-outline";
        return "file-outline";
    };


    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };


   /* const toggleDeleteHide = (document_id = null) => {
        setDocumentId(document_id)
        setDeleteModal(!deleteModal);
    }*/

    const toggleNewHide = () => {
        setNewModal(!newModal);
    }
   /* const handleDelete = (e) => {
        e.preventDefault();
        setLoading2(true)
        setError2(null)
        fetch(`${process.env.REACT_APP_API_URL}/api/employee/document/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({ id: document_id })
        })
            .then((res) => {
                if (!res.ok) {
                    setError2("Network response was not ok");
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((res) => {
                if (res.status) {
                    navigate(0)
                } else {
                    if (res.message === "Token error") {
                        logout();
                    }
                    setError2(res.message || "System error");
                }
                if (res.token) {
                    updateToken(res.token);
                }
            })
            .catch((error) => {
                console.error(error);
                setError2("An unexpected error occurred.");
            })
            .finally(() => {
                setLoading2(false);
            });
    }*/
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };


    const handleNew = (e) => {
        e.preventDefault();
        setLoading2(true)
        setError2(null)
        const formData = new FormData();
       
        
        formData.append("file", file);
        fetch(`${process.env.REACT_APP_API_URL}/api/pointage/invalide/new`, {
            method: "post",
            headers: {
               
                Authorization: `Bearer ${auth.token}`,
            },
            body: formData
        })
            .then((res) => {
                if (!res.ok) {
                    setError2("Network response was not ok");
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((res) => {
                if (res.status) {
                    navigate(0)
                } else {
                    if (res.message === "Token error") {
                        logout();
                    }
                    setError2(res.message || "System error");
                }
                if (res.token) {
                    updateToken(res.token);
                }
            })
            .catch((error) => {
                console.error(error);
                setError2("An unexpected error occurred.");
            })
            .finally(() => {
                setLoading2(false);
            });
    }


    const latestRequest = useRef(0);

    const getData = () => {
        // Incrémente un ID pour suivre la requête en cours
        const requestId = ++latestRequest.current;


        setLoading(true);
        setData((prevData) => ({ ...prevData, doc: [] }));
        fetch(`${process.env.REACT_APP_API_URL}/api/pointage/invalide/list`, {
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
                            doc: res.data.doc,
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
    }, [data.index, order_by, data.step]);


    const handleRetry = () => {
        setError("");
        setLoading(true);
        getData();
    };
    const handlePageChange = (newIndex) => {
        console.log("Page changée :", newIndex);

        setData((prevData) => ({ ...prevData, index: newIndex }));
    };

    const handleStepChange = (newStep) => {
        console.log(newStep)
        setData((prevData) => ({ ...prevData, index: 1 }));
        setData((prevData) => ({ ...prevData, step: newStep }));
        console.log(data.step)
    }
    const columns = [
        {
            Header: "no",
            accessor: "no",
        },
        {
            Header: "nom",
            accessor: "nom",
        },

        {
            Header: "heure",
            accessor: "heure",
        },
        {
            Header: "etat",
            accessor: "etat",
        },
        {
            Header: "nouvel_etat",
            accessor: "nouvel_etat",
        },
       
        {
            Header: "exception",
            accessor: "exception",
        },
        {
            Header: "row.operation",
            accessor: "row.operation",
        },
       
      
       
      
        
       
       
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

          



            <Modal show={newModal} onHide={toggleNewHide}>
                <Modal.Body>
                   
                    {error2 && (
                        <Alert variant="danger" className="my-2">
                            {error2}
                        </Alert>
                    )}
                    <form className="ps-3 pe-3" onSubmit={handleNew}>
                        <h3> New Dodument </h3>
                        <div className="mb-3">
                        <FormInput
                                    type="file"
                                    name="file"
                                    label="Sélectionnez un fichier PDF"
                                    placeholder=""
                                    accept=".xls,.xlsx,.osx,.csv"
                                    requerd
                                    onChange={handleFileChange}
                                    containerClass="mb-3"
                                />

                        </div>

                        <div className="mb-3 text-center">
                            <button className="btn rounded-pill btn-primary" type="submit" disabled={loading2}>
                                {loading2 ? <div>{t("loading...")}<Spinner color="white" size="sm" /></div> : t("send")}
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>


            <div>




                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col lg={8}>

                                    </Col>

                                    <Col lg={4}>
                                        <div className="text-lg-end mt-xl-0 mt-2">
                                            <Button
                                                variant="dark"
                                                onClick={toggleNewHide}
                                                className="rounded-pill waves-effect waves-light"
                                            >
                                                Add document
                                            </Button>

                                        </div>
                                    </Col>
                                </Row>
                                <Table
                                    columns={columns}
                                    data={data.doc}
                                    total_page={data.TotalPage}
                                    index={data.index}
                                    step={data.step}

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
