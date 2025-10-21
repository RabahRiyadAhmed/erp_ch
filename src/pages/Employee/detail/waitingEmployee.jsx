import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Form, InputGroup, Button, Modal, Alert, Dropdown } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { Editor } from "react-draft-wysiwyg";
import DatePicker from "react-datepicker";
import classNames from "classnames";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment"
import MyEdit from '../../../components/erp/MyEdit';
import AccessFile from '../../../components/erp/AccessFile';
import Access from '../../../utils/Access';
import EmployeeSearchSelect from "../../../components/erp/EmployeeSearchSelect";
import Spinner from "../../../components/Spinner";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../helpers/AuthContext";
import ImageFetch from '../../../components/erp/ImageFetch';
// styles
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// components
import PageTitle from "../../../components/PageTitle";
import FileUploader from "../../../components/FileUploader";
import { FormInput } from "../../../components/";



import getFile from "../../../utils/getFile"
import currencies_file from '../../../assets/static/currencies.json'
const country = require("../../../assets/static/flag.json")

const FormValidation = () => {
    const customStyles = {
        control: (base) => ({
            ...base,
            width: "100%", // pour prendre toute la largeur du parent
        }),
        menu: (base) => ({
            ...base,
            fontSize: "16px", // Augmenter la taille de la police pour rendre les options plus lisibles
            width: "auto", // Laisser le menu ajuster sa largeur selon le contenu
            minWidth: "200px", // Largeur minimale pour le menu
        }),
        option: (base) => ({
            ...base,
            fontSize: "16px", // Taille de police plus grande pour chaque option
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999, // Assurez-vous que le menu reste au-dessus des autres éléments
        }),
    };

    const currenciesOptions = Object.entries(currencies_file).map(([code, name]) => ({
        value: code,
        label: `${name}`,
    }));




    //const [id,setId] = useState(null);

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { auth, logout, updateToken } = useContext(AuthContext);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { id } = useParams();
    const [employee, setEmployee] = useState({})
    const [deleteModal, setDeleteModal] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [error2, setError2] = useState(null)
    const [imageUrl, setImageUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [flag, setFlag] = useState(null);
    const [contryName, setContryName] = useState(null);
    const [valideModal, setValideModal] = useState(false)



    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    const getData = () => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/api/employee/temp/detail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({ id })
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status) {
                    setEmployee(res.data.employee_waiting)
                    setFlag(process.env.REACT_APP_API_URL + country.find((c) => c.code == res.data.employee_waiting.country)?.flag || null);
                    setContryName(country.find((c) => c.code == res.data.employee_waiting.country)?.name || "Unknown")

                } else {
                    if (res.message === "Token error") {
                        logout();
                    }
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
            });
    };

    useEffect(() => {
        getData();
    }, [id]);


    const handleRetry = () => {
        setError("");

        getData();
    };


    useEffect(() => {
        // Charger l'image quand le composant est monté

        const url = `${process.env.REACT_APP_API_URL}/api/file/employee/temp/profile/image`;
        getFile(url, auth.token, { id: id }).then(setImageUrl);


    }, [employee]);

    const handleGetSharableLink = () => {
        const link = `${process.env.REACT_APP_API_URL}/employee/waiting/detail/${id}`;
        navigator.clipboard.writeText(link).then(() => { }).catch(err => {
            console.error("Erreur lors de la copie du lien :", err);
        });
    };

    const handleContrat_EcamplerLink = async () => {

        try {
            const fileUrl = await getFile(`${process.env.REACT_APP_API_URL}/api/generate-file/temp/contract`, auth.token, { id: id });

            // Vérifiez si fileUrl est une chaîne de caractères valide avant d'ouvrir l'URL
            if (fileUrl) {
                window.open(fileUrl, "_blank");
            } else {
                console.error("L'URL du fichier est invalide ou manquante.");
            }
        } catch (error) {

            console.error("Erreur lors de la génération du fichier PDF :", error);
        }

    };

    const handleUpdate = () => {
        navigate('/employee/waiting/update/' + id)
    }

    const toggleValideHide = () => {
        setValideModal(!valideModal);
    }


    const handleValide = async (e) => {
        e.preventDefault();
        setLoading2(true)
        setError2(null)
        if (employee) {
            fetch(`${process.env.REACT_APP_API_URL}/api/employee/temp/validate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
                body: JSON.stringify({ id: id })
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
                        navigate('/employee/detail/' + res.data.id)
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
    }


    const toggleDeleteHide = () => {
        setDeleteModal(!deleteModal);
    }

    const handleDelete = (e) => {
        e.preventDefault();
        setLoading2(true)
        setError2(null)
        fetch(`${process.env.REACT_APP_API_URL}/api/employee/temp/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({ id: id })
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
                    navigate('/employee/waiting/list')
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
    // Gestion du retry en cas d'erreur
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (file) {

            const formData = new FormData();
            formData.append("id", id);
            formData.append("file", file);

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employee/temp/upload_contrat`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                    body: formData,
                });
                if (response.ok) {
                    alert("PDF envoyé avec succès !");
                    navigate()
                } else {
                    alert("Erreur lors de l'envoi du PDF.");
                }
            } catch (error) {
                console.error("Erreur:", error);
                alert("Une erreur est survenue.");
            }
        } else {
            alert("please select pdf");
        }
    };


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
        .img-flag {
        max-width: 30px;  
        max-height: 30px; 
        vertical-align: middle; 
        margin-right: 5px;
        border: 1px;
        border-style: solid;
        border-color: black;
    }
      `}</style>
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

            {!loading && !error && (
                <>

                    <Modal show={deleteModal} onHide={toggleDeleteHide}>
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
                            <form className="ps-3 pe-3" onSubmit={handleDelete}>
                                <h3> delete employee </h3>
                                <div className="mb-3">
                                    <p htmlFor="up_name" className="form-label">
                                        Are you sure you want to delete this resource ?
                                    </p>
                                    <p htmlFor="up_name" className="form-label">
                                        delete : {employee.first_name + ' ' + employee.last_name}
                                    </p>

                                </div>

                                <div className="mb-3 text-center">
                                    <button className="btn rounded-pill btn-primary" type="submit" disabled={loading2}>
                                        {loading2 ? <div>{t("loadinf...")}<Spinner color="white" size="sm" /></div> : t("send")}
                                    </button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>
                    <Modal show={valideModal} onHide={toggleValideHide}>
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
                            <form className="ps-3 pe-3" onSubmit={handleValide}>
                                <h3> valide new contrat </h3>
                                <div className="mb-3">
                                    <p htmlFor="up_name" className="form-label">
                                        Are you sure you want to valide this employee ?
                                    </p>
                                    <p htmlFor="up_name" className="form-label">
                                        {employee && (employee.first_name + ' ' + employee.last_name + ':')}
                                    </p>

                                    <p htmlFor="up_name" className="form-label">
                                        {employee.Role && employee.Role.role_name ? employee.Role.role_name : "/"}
                                    </p>
                                </div>

                                <div className="mb-3 text-center">
                                    <button className="btn rounded-pill btn-primary" type="submit" disabled={loading2}>
                                        {loading2 ? <div>{t("loading...")}<Spinner color="white" size="sm" /></div> : t("send")}
                                    </button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>
                    <Row>
                        <Col>
                            <div className="page-title-box">
                                <h4 className="page-title">detail waiting employee</h4>
                            </div>
                        </Col>
                    </Row>

                    <Card>
                        <Card.Body>

                            <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                                Personal information
                            </h5>
                            <Dropdown className="card-widgets" align="end">
                                <Dropdown.Toggle className="table-action-btn dropdown-toggle btn btn-light btn-xs">
                                    <i className="mdi mdi-dots-horizontal"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {Access(auth, 'CEO') && (
                                        <Dropdown.Item onClick={toggleValideHide}>
                                            <i className="mdi mdi-link me-2 text-muted vertical-middle"></i>
                                            valide contract
                                        </Dropdown.Item>
                                    )}
                                    <Dropdown.Item onClick={handleGetSharableLink}>
                                        <i className="mdi mdi-link me-2 text-muted vertical-middle"></i>
                                        Get Sharable Link
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={handleContrat_EcamplerLink}>
                                        <i className="mdi mdi-link me-2 text-muted vertical-middle"></i>
                                        contract exampler
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={handleUpdate}>
                                        <i className="mdi mdi-square-edit-outline me-2 text-muted vertical-middle"></i>
                                        edit
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={toggleDeleteHide}>
                                        <i className="mdi mdi-delete me-2 text-muted vertical-middle"></i>
                                        Remove
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Row>
                                <Col lg={6}>
                                    <div className="text-center">
                                        <img
                                            src={
                                                imageUrl
                                                    ? imageUrl // URL récupérée depuis l'API
                                                    : `${process.env.REACT_APP_API_URL}/image/profile.jpg` // Image par défaut
                                            }
                                            alt={employee.first_name + ' ' + employee.last_name || "Default asset image"}
                                            className="img-fluid mx-auto d-block rounded"
                                        />

                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Email :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.email}
                                    </p>


                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Phone :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.phone}
                                    </p>

                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Bio :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.bio ? employee.bio : "/"}
                                    </p>







                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6}>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        First name :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.first_name}
                                    </p>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Last name :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.last_name}
                                    </p>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Nationality :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.nationality}
                                    </p>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Marital status :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.marital_status}
                                    </p>
                                </Col>
                                <Col lg={6}>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Date of Birth :
                                    </h4>
                                    <p className="mb-1">
                                        {moment(employee.birth_date).format('LL')}
                                    </p>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Birth place:
                                    </h4>
                                    <p className="mb-1">
                                        {employee.birth_place}
                                    </p>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Identification number :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.identification_number}
                                    </p>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Social security number :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.social_security_number}
                                    </p>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Gender :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.gender ? (employee.gender === 'm' ? 'man' : 'women ') : '/'}
                                    </p>
                                </Col>
                            </Row>
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
                                        <p className="mb-1">{employee.postal_code}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={4}>
                                        <h4 className="font-13 text-muted text-uppercase mb-1">
                                            Street :
                                        </h4>
                                        <p className="mb-1">{employee.street}</p>
                                    </Col>
                                    <Col lg={4}>
                                        <h4 className="font-13 text-muted text-uppercase mb-1">
                                            City :
                                        </h4>
                                        <p className="mb-1">{employee.city}</p>
                                    </Col>
                                    <Col lg={4}>
                                        <h4 className="font-13 text-muted text-uppercase mb-1">
                                            Region :
                                        </h4>
                                        <p className="mb-1">{employee.region}</p>
                                    </Col>
                                </Row>

                            </div>


                        </Card.Body>
                    </Card>





                    <Card>
                        <Card.Body>
                            <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                                Employee data
                            </h5>

                            <Row>
                                <Col lg={6}>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        payment type :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.payment_type}
                                    </p>

                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        payment rate :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.payment_rate + ' ' + employee.currency}
                                    </p>




                                </Col>
                                <Col lg={6}>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        employment status :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.employment_status}
                                    </p>

                                </Col>
                            </Row>


                            <Row>
                                <Col lg={6}>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        role :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.Role && employee.Role.role_name ? employee.Role.role_name : "/"}
                                    </p>


                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Start date :
                                    </h4>
                                    <p className="mb-1">
                                        {moment(employee.role_start_date).format('LL')}
                                    </p>

                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        End date :
                                    </h4>
                                    <p className="mb-1">
                                        {moment(employee.role_end_date).format('LL')}
                                    </p>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Supervisor :
                                    </h4>
                                    <div>
                                        {employee.supervisor ? ( // Vérifie si `supervisor` existe
                                            <div key={"supervisor"} className="d-flex align-items-center mb-3">
                                                <div className="inbox-item-img me-3">
                                                    <ImageFetch
                                                        image={"/api/file/employee/profile/image"}
                                                        defaulBody={{ id: employee.supervisor.id }}
                                                        className={"rounded-circle"}
                                                        width={50}
                                                        height={50}
                                                    />

                                                </div>
                                                <div>
                                                    <p className="inbox-item-author mb-1">
                                                        {employee.supervisor.first_name} {employee.supervisor.last_name}
                                                    </p>
                                                    <p className="inbox-item-text mb-1">
                                                        {employee.supervisor.EmployeeRoles[0]?.Role.role_name || "No Role"}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p>No supervisor assigned</p> // Message si `supervisor` est null
                                        )}
                                    </div>



                                </Col>
                                <Col lg={6}>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        division :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.Division && employee.Division.division_name ? employee.Division.division_name : '/'}
                                    </p>

                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Department :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.Department && employee.Department.department_name ? employee.Department.department_name : '/'}
                                    </p>

                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Location :
                                    </h4>
                                    <p className="mb-1">
                                        {employee.Location && employee.Location.name ? employee.Location.name : '/'}
                                    </p>





                                </Col>
                            </Row>



                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                                contrat
                            </h5>
                            <Form onSubmit={handleSubmit}>
                                {/* Utilisation de FormInput pour le champ de fichier */}
                                <FormInput
                                    type="file"
                                    name="file"
                                    label="Sélectionnez un fichier PDF"
                                    placeholder=""
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    containerClass="mb-3"
                                />

                                <Button variant="primary" type="submit">
                                    Envoyer
                                </Button>
                            </Form>
                            {employee.contract_path && (
                                <AccessFile token={auth.token} defaultBody={{ id: id }} files={[{ file_path: `${process.env.REACT_APP_API_URL}/api/file/employee/temp/contrat`, name: 'contrat' },]} />
                            )}

                        </Card.Body>
                    </Card>

                </>
            )
            }
        </>
    );
};

export default FormValidation;
