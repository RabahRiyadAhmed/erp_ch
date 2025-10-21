import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import Spinner from "../../components/Spinner";
import { AuthContext } from "../../helpers/AuthContext";
import ImageFetch from "../../components/erp/ImageFetch";
import getFile from "../../utils/getFile";
import { FormInput } from "../../components/";
import DatePicker from "react-datepicker";

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

import "react-datepicker/dist/react-datepicker.css";
const AssetStetting = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [error2, setError2] = useState("");
    const [loading2, setLoading2] = useState(false);

    const [error3, setError3] = useState("");
    const [loading3, setLoading3] = useState(false);


    const [document_id, setDocumentId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false)
    const [newModal, setNewModal] = useState(false)
    const [pointageModal, setPointageModal] = useState(false)
    const [formState, setFormState] = useState({
       
        month: null,
    });

    const [fieldStatus, setFieldStatus] = useState({
      
        month: "neutral",
    });
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

    const handleYearChange = (date) => {
        setFormState({ ...formState, year: date });
        setFieldStatus({ ...fieldStatus, year: date ? "valid" : "invalid" });
    };

    const handleMonthChange = (date) => {
        setFormState({ ...formState, month: date });
        setFieldStatus({ ...fieldStatus, month: date ? "valid" : "invalid" });
    };


    const getInputClass = (status) => {
        switch (status) {
            case "valid":
                return "is-valid";
            case "invalid":
                return "is-invalid";
            default:
                return "";
        }
    };
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    const toggleNewHide = () => {
        setNewModal(!newModal);
    }

    const togglePoinateHide = () => {
        setPointageModal(!pointageModal);
    }
    /* const toggleDeleteHide = (document_id = null) => {
         setDocumentId(document_id)
         setDeleteModal(!deleteModal);
     }*/


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
        fetch(`${process.env.REACT_APP_API_URL}/api/pointage/pointage/new`, {
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




    const handlePointage= async (e) => {
        e.preventDefault();
        setLoading3(true)
        setError3(null)
        
       
            if(!formState.month){
                setFieldStatus({ ...fieldStatus, month: 'invalid' })
            return;
        }
        
        try {

            const fileUrl = await getFile(`${process.env.REACT_APP_API_URL}/api/pointage/pointage/employee`, auth.token, {month:formState.month});
            setLoading3(false)
            // Vérifiez si fileUrl est une chaîne de caractères valide avant d'ouvrir l'URL
            if (fileUrl) {
                window.open(fileUrl, "_blank");
                setPointageModal(false)
            } else {
                setError3("L'URL du fichier est invalide ou manquante.")
                console.error("L'URL du fichier est invalide ou manquante.");
            }
        } catch (error) {
            setError3("Erreur lors de la génération du fichier PDF")
            console.error("Erreur lors de la génération du fichier PDF :", error);
        }
        setLoading2(false)
    };



    const latestRequest = useRef(0);

    const getData = () => {
        // Incrémente un ID pour suivre la requête en cours
        const requestId = ++latestRequest.current;


        setLoading(true);
        setData((prevData) => ({ ...prevData, doc: [] }));
        fetch(`${process.env.REACT_APP_API_URL}/api/pointage/pointage/list`, {
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
            Header: "Numéro Employé",
            accessor: "no_emp",
        },


        {
            Header: "Nom",
            accessor: "nom",
        },

        {
            Header: "Date",
            accessor: "date",
        },
        {
            Header: "Segment",
            accessor: "segment",
        },
        {
            Header: "Heure d'Entrée",
            accessor: "heure_entree",
        },
        {
            Header: "Heure de Sortie",
            accessor: "heure_sortie",
        },
        {
            Header: "Pointage Entrée",
            accessor: "pointage_entree",
        },
        {
            Header: "Pointage Sortie",
            accessor: "pointage_sortie",
        },

        {
            Header: "Temps Réel",
            accessor: "temps_reel",
        },

        {
            Header: "Absence",
            accessor: "absence",
        },
        {
            Header: "Temps Supplémentaire",
            accessor: "temps_hs",
        },
        {
            Header: "Temps de Travail",
            accessor: "temps_travail",
        },
        {
            Header: "Exception",
            accessor: "exception",
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


            <Modal show={pointageModal} onHide={togglePoinateHide}>
                <Modal.Body>

                    {error3 && (
                        <Alert variant="danger" className="my-2">
                            {error3}
                        </Alert>
                    )}
                    <form className="ps-3 pe-3" onSubmit={handlePointage}>
                        <h3> get employee pointage </h3>
                        {/* Sélecteur de date de fin de rôle */}
                       

                        {/* Sélecteur d'année */}
                        <Form.Group className="mb-3" controlId="validationYear">
                            <Form.Label>Year</Form.Label>
                            <DatePicker
                                selected={formState.year}
                                onChange={handleYearChange}
                                showYearPicker
                                dateFormat="yyyy"
                                required
                                isClearable
                                name="year"
                                className={`form-control ${getInputClass(fieldStatus.year)}`}
                                placeholderText="Select year"
                            />
                            {fieldStatus.year === "invalid" && (
                                <div className="invalid-feedback">Please select a valid year.</div>
                            )}
                        </Form.Group>

                        {/* Sélecteur de mois */}
                        <Form.Group className="mb-3" controlId="validationMonth">
                            <Form.Label>Month</Form.Label>
                            <DatePicker
                                selected={formState.month}
                                onChange={handleMonthChange}
                                showMonthYearPicker
                                dateFormat="MM/yyyy"
                                required
                                isClearable
                                name="month"
                                className={`form-control ${getInputClass(fieldStatus.month)}`}
                                placeholderText="Select month"
                            />
                            {fieldStatus.month === "invalid" && (
                                <div className="invalid-feedback">Please select a valid month.</div>
                            )}
                        </Form.Group>
                        <div className="mb-3 text-center">
                            <button className="btn rounded-pill btn-primary" type="submit" disabled={loading2}>
                                {loading3 ? <div>{t("loading...")}<Spinner color="white" size="sm" /></div> : t("send")}
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>


            <div tyle={{
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                maxWidth: "50%", // Limite la largeur à celle de l'écran
                margin: "0 auto", // Centrer le tableau sur la page
            }}>




                <Row >
                    <Col>
                        <Card>
                            <Card.Body>
                                <Row className="align-items-center">


                                    <Col lg={4}>
                                        <div className=" mt-xl-0 mt-2">
                                            <Button
                                                variant="dark"
                                                onClick={toggleNewHide}
                                                className="rounded-pill waves-effect waves-light"
                                            >
                                                Add document
                                            </Button>

                                        </div>
                                        <div className=" mt-xl-0 mt-2">
                                            <Button
                                                variant="dark"
                                                onClick={togglePoinateHide}
                                                className="rounded-pill waves-effect waves-light"
                                            >
                                                pointage
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
