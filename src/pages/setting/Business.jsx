import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Form, InputGroup, Button, Modal, Alert } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import LazyLoad from 'react-lazyload';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment"
import getFile from "../../utils/getFile";
import ImageCropper from "../../components/erp/ImageCropper";

import Spinner from "../../components/Spinner";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../helpers/AuthContext";
// styles
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";






import currencies_file from '../../assets/static/currencies.json'


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

    const { employee_id, id } = useParams();
    const defaultBody = id ? { id: employee_id } : null
    const [currencyOptions, setCurrencyOptions] = useState([{ label: "Devises", options: currenciesOptions }]);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { auth, logout, updateToken } = useContext(AuthContext);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [loading2, setLoading2] = useState(false)
    const [error2, setError2] = useState(null)
    const [loading3, setLoading3] = useState(false)
    const [error3, setError3] = useState(null)

    const [roles, setRoles] = useState([])
    const [depatements, setDepatements] = useState([])
    const [divisions, setDivisions] = useState([])
    const [locations, setLocations] = useState([])
    const [currency, setCurrency] = useState()
    const [defaultEmployee, setDefaultEmployee] = useState(null)
    const [updateModal, setUpdateModal] = useState(false);
    const [imageUrl, setImageUrl] = useState(null)
    const [imageUrl2, setImageUrl2] = useState(null)
    const [upImageModal, setUpImageModal] = useState(false)
    const [formState, setFormState] = useState({

        name: '',
        address: "",
        phone: "",
        email: "",
        website: "image/logo.jpg",
        // logo: "intag.net",
        tax_id: "",

    });
    const [dataState, setDataState] = useState({

        name: '',
        address: "",
        phone: "",
        email: "",
        website: "image/logo.jpg",
        // logo: "intag.net",
        tax_id: "",

    });

    const [fieldStatus, setFieldStatus] = useState({
        id: "neutral",
        name: "neutral",
        address: "neutral",
        phone: "neutral",
        email: "neutral",
        website: "neutral",
        // logo: "neutral",
        tax_id: "neutral",
    });

    const [emailError, setEmailError] = useState("");





    const validateField = (name, value) => {

        console.log(name)
        console.log(value)

        if (!value && name !== "supervisor_id" && name !== "probation_period") return "invalid"; // Field is empty

        if (name === "name" && !value) return "invalid";
        if (name === "nationality" && value == '') return "invalid";

        if (name === "birth_date" && !value) return "invalid";
        if (name === "payment_rate" && !value) return "invalid";
        return "neutral"; // No error
    };

    const toggleHide = () => {
        setImageUrl2(null)
        setUpImageModal(!upImageModal);
    }
    const handleImageCropped = (image) => {
        setImageUrl2(image)
    };
    useEffect(() => {
        if (auth) {
            const url = `${process.env.REACT_APP_API_URL}/image/logo`;
            getFile(url, auth.token, null).then(setImageUrl)
        }
    }, [auth])


    const handleSend = (event) => {
        event.preventDefault();
        setLoading3(true)
        setError3(null)

        if (!imageUrl2) {
            setError3("pls ,select image")
            return;
        }

        const formData = new FormData();


        formData.append('image', imageUrl2); // Gérer le fichier image

        fetch(`${process.env.REACT_APP_API_URL}/api/setting/business/update/image`, {
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
                    setError3(res.message || "System error");
                }
                if (res.token) {
                    updateToken(res.token);
                }
            })
            .catch((error) => {
                console.error(error);
                setError3("An unexpected error occurred.");
            })
            .finally(() => {
                setLoading3(false);
            })
    }





    const handleSubmit = async (event) => {
        event.preventDefault();

        let isValid = true;
        const newFieldStatus = { ...fieldStatus };

        // Local validation
        for (const field in formState) {
            newFieldStatus[field] = validateField(field, formState[field]);
            if (newFieldStatus[field] === "invalid") isValid = false;
        }
        console.log(formState)
        console.log(newFieldStatus)
        setFieldStatus(newFieldStatus);

        // Stop here if local validation fails
        if (!isValid) {
            return;
        }


        const data = {
            name: formState.name,
            address: formState.address,
            phone: formState.phone,
            email: formState.email,
            website: formState.website,
            tax_id: formState.tax_id,
        }

        setLoading2(true);
        fetch(`${process.env.REACT_APP_API_URL}/api/setting//business/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status) {
                    setDataState({
                    name: res.data.business.name,
                    address: res.data.business.address,
                    phone: res.data.business.phone,
                    email: res.data.business.email,
                    website: res.data.business.website,
                    tax_id: res.data.business.tax_id})
                    toggleUpdate(false)
                } else {
                    if (res.message === "Token error") {
                        logout();
                    }
                    console.log(res.error)
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
            })

    };

    /**
     * Updates fields and resets errors if necessary.
     */

    const toggleUpdate = (modateEtat=null) => {
        if(modateEtat != null) {
            setUpdateModal(modateEtat);
        }else {
             updateModal || setFormState(dataState)
            setUpdateModal(!updateModal);
        }
       
    };
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setFormState((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        // Reset local errors
        setFieldStatus((prev) => ({
            ...prev,
            [name]: "neutral",
        }));

        if (name === "email") {
            setEmailError("");
        }

    };

    /**
     * Determines the CSS class for a field.
     */
    const getInputClass = (status) => {
        if (status === "invalid") return "is-invalid";
        return ""; // Neutral or valid
    };


    /********************************************************************* */
    const getData = () => {
        setLoading(true);

        fetch(`${process.env.REACT_APP_API_URL}/api/setting/business`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify()
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status) {

                    setDataState({
                        name: res.data.business.name,
                        address: res.data.business.address,
                        phone: res.data.business.phone,
                        email: res.data.business.email,
                        website: res.data.business.website,
                        tax_id: res.data.business.tax_id
                    })
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
    }, []);




    const handleRetry = () => {
        setError("");

        getData();
    };
    /********************************************************************* */
    const handleNationality = (nationality) => {
        setFieldStatus({ ...fieldStatus, nationality: "neutral" })
        setFormState({ ...formState, nationality: nationality })
    };

    const handleCountry = (country) => {
        setFieldStatus({ ...fieldStatus, country: "neutral" })
        setFormState({ ...formState, country: country })
    };

    const handleBirthDate = (date) => {
        setFieldStatus({ ...fieldStatus, birth_date: "neutral" })
        setFormState({ ...formState, birth_date: date })
    };

    const handleRoleStartDate = (date) => {
        setFieldStatus({ ...fieldStatus, role_start_date: "neutral" })
        setFormState({ ...formState, role_start_date: date })
    };

    const handleRoleEndDate = (date) => {
        setFieldStatus({ ...fieldStatus, role_end_date: "neutral" })
        setFormState({ ...formState, role_end_date: date })
    };

    const handleMaritalStatus = (marital_status) => {
        setFieldStatus({ ...fieldStatus, marital_status: "neutral" })
        setFormState({ ...formState, marital_status: marital_status })
    };

    const handleEmploymentStatus = (employment_status) => {
        setFieldStatus({ ...fieldStatus, employment_status: "neutral" })
        setFormState({ ...formState, employment_status: employment_status })
    };


    const handlePaymentType = (payment_type) => {
        setFieldStatus({ ...fieldStatus, payment_type: "neutral" })
        setFormState({ ...formState, payment_type: payment_type })
    };

    const formatOptionLabel = ({ value, label }, { context }) => {
        return context === "menu" ? `${value} - ${label}` : value; // `menu` = liste ouverte, sinon affichage simple
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


                    <Modal show={updateModal} onHide={toggleUpdate}>
                        <Modal.Body>
                            <Form noValidate onSubmit={handleSubmit}>
                                <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                                    update business data
                                </h5>

                                <Row>

                                    <Col lg={6}>
                                        <Form.Group className="mb-3" controlId="validationName">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                min={0}
                                                placeholder="Name"
                                                name="name"
                                                value={formState.name}
                                                onChange={handleChange}
                                                className={getInputClass(fieldStatus.name)}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid name.
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="validationEmail">
                                            <Form.Label>E mail</Form.Label>
                                            <Form.Control
                                                type="email"
                                                min={0}
                                                placeholder="email"
                                                name="email"
                                                value={formState.email}
                                                onChange={handleChange}
                                                className={getInputClass(fieldStatus.email)}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid email.
                                            </Form.Control.Feedback>
                                        </Form.Group>


                                        <Form.Group className="mb-3" controlId="validationFirstName">
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control
                                                type="phone"
                                                min={0}
                                                placeholder="phone"
                                                name="phone"
                                                value={formState.phone}
                                                onChange={handleChange}
                                                className={getInputClass(fieldStatus.phone)}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid phone.
                                            </Form.Control.Feedback>
                                        </Form.Group>




                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mb-3" controlId="validationFirstName">
                                            <Form.Label>address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                min={0}
                                                placeholder="address"
                                                name="address"
                                                value={formState.address}
                                                onChange={handleChange}
                                                className={getInputClass(fieldStatus.address)}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid address.
                                            </Form.Control.Feedback>
                                        </Form.Group>


                                        <Form.Group className="mb-3" controlId="validationFirstName">
                                            <Form.Label>web site</Form.Label>
                                            <Form.Control
                                                type="text"
                                                min={0}
                                                placeholder="website"
                                                name="website"
                                                value={formState.website}
                                                onChange={handleChange}
                                                className={getInputClass(fieldStatus.website)}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid web site.
                                            </Form.Control.Feedback>
                                        </Form.Group>



                                        <Form.Group className="mb-3" controlId="validationFirstName">
                                            <Form.Label>tax_id</Form.Label>
                                            <Form.Control
                                                type="text"
                                                min={0}
                                                placeholder="tax_id"
                                                name="tax_id"
                                                value={formState.tax_id}
                                                onChange={handleChange}
                                                className={getInputClass(fieldStatus.tax_id)}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid tax_id.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>




                                </Row>








                                {!loading2 && error2 && (
                                    <div className="error-container">
                                        <p>{error2}</p>

                                    </div>
                                )}
                                <Button type="submit"> {loading2 ? <div>{t("loading")}<Spinner color="white" size="sm" /></div> : t("send")}</Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                    <Modal show={upImageModal} onHide={toggleHide}>
                        <Modal.Body>
                            <div className="text-center mt-2 mb-4">
                                <div className="auth-logo">


                                </div>
                            </div>
                            {error3 && (
                                <Alert variant="danger" className="my-2">
                                    {error3}
                                </Alert>
                            )}
                            <form onSubmit={handleSend}>
                                <h3 className="text-center"> update image</h3>
                                <div className="d-flex justify-content-center align-items-center" >
                                    <ImageCropper onImageCropped={handleImageCropped} defaultImage={imageUrl2} token={auth.token} />
                                </div>

                                <div className="m-3 text-center">
                                    <button className="btn rounded-pill btn-primary" type="submit" disabled={loading}>
                                        {loading ? <div>{t("loadinf...")}<Spinner color="white" size="sm" /></div> : t("send")}
                                    </button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>

                    <Row className="align-items-center mb-3">
                        <Col>
                            <h4 className="header-title m-0"></h4>
                        </Col>
                        <Col className="text-end">
                            <Button
                                variant="dark"
                                onClick={toggleUpdate}
                                className="rounded-pill waves-effect waves-light"
                            >
                                update business
                            </Button>
                        </Col>
                    </Row>
                    <Card>
                        <Card.Body>
                            <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                                Business data
                            </h5>

                            <Row>
                                <Col lg={4}>

                                        <Card.Img src={ `${process.env.REACT_APP_API_URL}/image/logo.jpg`} style={{cursor : 'pointer'}}  className="rounded img-thumbnail mt-2 currer"
                                            onClick={toggleHide}
                                        />
                                    
                                </Col>
                                <Col lg={4}>

                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Name :
                                    </h4>
                                    <p className="mb-1">{dataState.name}</p>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        E mail :
                                    </h4>
                                    <p className="mb-1">{dataState.email}</p>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Phone :
                                    </h4>
                                    <p className="mb-1">{dataState.phone}</p>
                                </Col>
                                <Col lg={4}>

                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Address :
                                    </h4>
                                    <p className="mb-1">{dataState.address}</p>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Web site :
                                    </h4>
                                    <p className="mb-1">{dataState.website}</p>
                                    <h4 className="font-13 text-muted text-uppercase mb-1">
                                        Tax id :
                                    </h4>
                                    <p className="mb-1">{dataState.tax_id}</p>

                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                </>
            )}
        </>
    );
};

export default FormValidation;
