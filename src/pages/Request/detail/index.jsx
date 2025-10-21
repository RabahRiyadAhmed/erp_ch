import React, { useState, useEffect, useContext } from "react";
// components
import PageTitle from "../../../components/PageTitle";
import MyEdit from '../../../components/erp/MyEdit';
import ReadBox from '../../../components/erp/ReadBox';
import EmployeeSearchSelect from '../../../components/erp/EmployeeSearchSelect';
import { AuthContext } from "../../../helpers/AuthContext";
import { useTranslation } from "react-i18next";
import { Row, Col, Card, Form, InputGroup, Button, Modal, Alert, Dropdown } from "react-bootstrap";
import { Navigate, Link, useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { tileLayer } from "leaflet";
import FileUploader from "../../../components/FileUploader";
import ImageFetch from '../../../components/erp/ImageFetch';
import AccessFile from '../../../components/erp/AccessFile';
import { setDefaultLocale } from "react-datepicker";
const Request = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [requests, setRequest] = useState([])
    const [charge_tinymce, setChargeTinymce] = useState(true)
    const [error, setError] = useState(false)
    const [showModel, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error2, setError2] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const { auth, logout, updateToken } = useContext(AuthContext);
    const [title, setTitle] = useState(null)
    const [type, setType] = useState(null)
    const [employees, setEmployees] = useState([])
    const [defaultemployees, setEDefaultEmployees] = useState([])
    const [content, setContent] = useState("")
    const [titleStatus, setTitleStatus] = useState("neutral")
    const [typeStatus, setTypeStatus] = useState("neutral")
    const [employeesStatus, setEmployeesStatus] = useState("neutral")
    const [contentStatus, setContentStatus] = useState("neutral")
    const [files, setFile] = useState([])


    const getInputClass = (status) => {
        if (status === "invalid") return "is-invalid";
        return ""; // Neutral or valid
    };
    /*    const handleChange = (e) => {
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
    
    
    
        };*/


    const handleType = (type) => {
        setType("neutral")
        setType(type)
    }
    const handleContentChange = (content) => {
        setContentStatus("neutral")
        setContent(content)
    };

    const onLoad = (value) => {
        setChargeTinymce(value)

    };

    const toggleHide = () => {
        setShowModal(!showModel);
    }
    const handleFileUpload = (uploadedFiles) => {
        setFile(uploadedFiles);
    };

    /*const validateField = (name, value) => {

        console.log(name)
        console.log(value)

        if (!value && name !== 'bio' && name !== 'image' && name !== "contrat" && name !== "supervisor_id") return "invalid"; // Field is empty
        if (name === "email" && !/\S+@\S+\.\S+/.test(value)) return "invalid"; // Invalid email
        if (name === "department_id" && !value) return "invalid";
        if (name === "nationality" && !value) return "invalid";
        if (name === "gender" && !value) return "invalid";
        if (name === "employees" && Array.isArray(value)) { if (value.length == 0) { return "invalid"; } }
        if (name === "payment_rate" && !value) return "invalid";
        return "neutral"; // No error
    };*/

    const handleSubmit = (e) => {

        e.preventDefault();


        let isValid = true;

        if (!title) { isValid = false; setTitleStatus('invalid') }
        if (employees && Array.isArray(employees)) { if (employees.length == 0) { setEmployeesStatus('invalid'); isValid = false; } }
        if (!type) { isValid = false; setTypeStatus('invalid') }

        if (!isValid) {
            return;
        }


        const formData = new FormData();
        formData.append('id', id)
        formData.append('title', title);
        formData.append('type', type);
        if (files && files.length > 0) {
            files.forEach((f) => {
                formData.append("files", f);
            });
        }

        if (employees && employees.length > 0) {
            employees.forEach((e) => {
                formData.append("employees[]", e);
            });
        }
        formData.append('content', content);


        setLoading2(true);
        setError2(null);
        console.log(employees)
        fetch(`${process.env.REACT_APP_API_URL}/api/request/send`, {
            method: "POST",
            headers: {

                Authorization: `Bearer ${auth.token}`,
            },
            body: formData
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status) {
                    console.log(res)
                    navigate(0)

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
    }

    const getData = () => {


        setLoading(true);

        fetch(`${process.env.REACT_APP_API_URL}/api/request/detail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({ id: id })
        })
            .then((res) => {
               
                return res.json();
            })
            .then((res) => {
                if (res.status) {
                    console.log(res.data.requests);
                    let i = 0
                    for (i; i < res.data.requests.length; i++) {
                        let Attachments = [];

                        const attachmentsList = res.data.requests[i].Attachments || []; // Vérifie si Attachments existe
                        if (Array.isArray(attachmentsList)) {
                            attachmentsList.forEach(att => {
                                Attachments.push({
                                    file_path: att.file_path,
                                    file_size: att.file_size,
                                    name: att.file_name,
                                    file_type: att.file_type,
                                    preview: att.preview, // Correction ici (orthographe)
                                    url: `/api/file/request/file?file=${att.file_path}&id=${id}`
                                });
                            });
                        }

                        // Ajoute Attachments au request si nécessaire
                        res.data.requests[i].Attachments = Attachments;
                    }


                    setRequest(res.data.requests);
                    if (res.data.requests && res.data.requests.length != 0) {
                        setType(res.data.requests[0].type)
                        setTitle(res.data.requests[0].title)
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

                setLoading(false); // Met à jour `loading` uniquement pour la dernière requête

            });
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        console.log(requests)
    }, [requests]);

    const handleRetry = () => {
        setError("");

        getData();
    };
    return (
        <>
          


 <Row className="align-items-center mb-3">
                <Col lg={8}>
                    <h4 className="page-title">Request</h4>
                </Col>


            </Row>


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


            <Row className="align-items-center mb-3">
                <Col lg={8}>
                    <h4 className="page-title">Request</h4>
                </Col>

                <Col lg={4}>
                    <div className="text-lg-end mt-xl-0 mt-2">
                        <Button
                            variant="dark"
                            onClick={toggleHide}
                            className="rounded-pill waves-effect waves-light"
                        >
                            respand
                        </Button>

                    </div>
                </Col>
            </Row>



            <Modal show={showModel} onHide={toggleHide} size="xl" >
                <Modal.Body>
                    <Form noValidate onSubmit={handleSubmit}>
                        {charge_tinymce && (
                            <div className="loading-container">
                                <Spinner type="grow" color="primary" size="lg" />
                                <p>Please wait while the data loads...</p>
                            </div>
                        )}
                        {!charge_tinymce && (
                            <>
                                <Form.Group className="mb-3" controlId="validationEmployees">
                                    <Form.Label>sending for</Form.Label>
                                    <EmployeeSearchSelect
                                        value={employees}
                                        onChange={(emp) => {
                                            setEmployeesStatus('neutral');
                                            setEmployees(emp);
                                        }}
                                        isMulti={true}
                                        name="employees"
                                        className={`${getInputClass(employeesStatus)}`}
                                        defaultEmployee={defaultemployees}
                                        isValid={employeesStatus === 'invalid'} // Définir l'état d'erreur
                                    />
                                    {employeesStatus === 'invalid' && (
                                        <Form.Control.Feedback type="invalid">
                                            {"Please provide a valid employee."}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>



                                <Card>


                                    <FileUploader onFileUpload={handleFileUpload}


                                     
                                    />

                                </Card>
                            </>
                        )}



                        <MyEdit className="mb-3" onContentChange={handleContentChange} onload={onLoad} token={auth.token} isValid={contentStatus === 'invalid'} />

                        <Row className="mb-3" >
                            <Col>
                                <div className="text-center mb-3">
                                    <button
                                        type="submit"
                                        className="btn w-sm btn-success waves-effect waves-light me-1"
                                        disabled={loading2}
                                    >
                                        {loading2 ? <div>{t("loading")}<Spinner color="white" size="sm" /></div> : t("send")}
                                    </button>



                                </div>
                            </Col>
                        </Row>

                    </Form>
                </Modal.Body>
            </Modal>


            {loading && (
                <div className="loading-container">
                    <Spinner type="grow" color="primary" size="lg" />
                    <p>Please wait while the data loads...</p>
                </div>)
            }
            {!loading && error && (
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={handleRetry}>Retry</button>
                </div>
            )}

            {loading && (
                <div className="loading-container">
                    <Spinner type="grow" color="primary" size="lg" />
                    <p>Please wait while the data loads...</p>
                </div>)
            }

            {!loading && !error && Array.isArray(requests) && (
                requests.map((r) => (
                    <>
                        <Card className="mb-3">
                            <Card.Body>
                                <div className="d-flex align-items-start mb-3 mt-1">

                                    <ImageFetch
                                        image={'/api/file/employee/profile/image'}
                                        defaulBody={{ id: r.Employee.id }}
                                        className="d-flex me-2 rounded-circle"
                                        alt={r.Employee.first_name + ' ' + r.Employee.last_name}
                                        width={32}
                                        height={32}
                                    />
                                    <div className="w-100">
                                        <small className="float-end">{r.createdAt}</small>
                                        <h6 className="m-0 font-14">{r.Employee.first_name + ' ' + r.Employee.last_name}</h6>
                                        <small className="text-muted">
                                            From: {(r.RequestRecipients).map(rr => (
                                                rr.Employee.first_name + ' ' + rr.Employee.last_name
                                            ))}
                                        </small>
                                    </div>
                                </div>
                                <AccessFile token={auth.token} files={r.Attachments} />
                                <hr />

                                <ReadBox className="mb-3" content={r.content} />

                                {/* Bouton pour ouvrir le modal de réponse */}
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        let employeest = [
                                            {
                                                id:r.Employee.id,
                                                first_name:r.Employee.first_name,
                                                last_name:r.Employee.last_name,
                                            }
                                        ]
                                       
                                        /*r.RequestRecipients.forEach(tt => {

                                            employeest.push(tt.Employee)
                                        })
                                        employeest.push(r.Employee)*/
                                        setEmployees([r.Employee.id])
                                        setEDefaultEmployees(employeest)


                                        setShowModal(true)
                                    }}
                                >
                                    Répondre
                                </Button>
                            </Card.Body>
                        </Card>
                    </>
                ))
            )}






        </>
    );
};

export default Request;
