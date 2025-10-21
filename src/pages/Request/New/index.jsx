import React, { useState, useEffect,useCallback, useContext ,memo } from "react";
// components
import PageTitle from "../../../components/PageTitle";
import MyEdit from '../../../components/erp/MyEdit';
import EmployeeSearchSelect from '../../../components/erp/EmployeeSearchSelect';
import { AuthContext } from "../../../helpers/AuthContext";
import { useTranslation } from "react-i18next";
import { Row, Col, Card, Form, InputGroup, Button, Modal, Alert, Dropdown } from "react-bootstrap";
import { Navigate, Link, useNavigate } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { tileLayer } from "leaflet";
import FileUploader from "../../../components/FileUploader";
const Request = memo(() => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [error2, setError2] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const { auth, logout, updateToken } = useContext(AuthContext);
    const [title, setTitle] = useState(null)
    const [type, setType] = useState(null)
    const [employees, setEmployees] = useState([])
    const [content, setContent] = useState("")
    const [titleStatus, setTitleStatus] = useState("neutral")
    const [typeStatus, setTypeStatus] = useState("neutral")
    const [employeesStatus, setEmployeesStatus] = useState("neutral")
    const [contentStatus, setContentStatus] = useState("neutral")
    const [files, setFile] = useState([])
    const handleEmployeesChange = useCallback((emp) => {
        setEmployeesStatus('neutral');
        setEmployees(emp);
    }, []);

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
        console.log(value)
        setLoading(value)
        console.log(loading)
    };
    const handleFileUpload = (uploadedFiles) => {
        setFile(uploadedFiles);
    };
    const handleSubmit = (e) => {

        e.preventDefault();


        let isValid = true;

        if ( !title ) { isValid = false; setTitleStatus('invalid') }
        if (employees && Array.isArray(employees)) { if (employees.length == 0) { setEmployeesStatus('invalid'); isValid = false; } }
        if ( !type) { isValid = false; setTypeStatus('invalid') }

        if (!isValid) {
            return;
        }
        const formData = new FormData();

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
                    navigate('/request/detail/' + res.data.request.id)

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


    return (
        <>
            <PageTitle

                title={"Request"}
            />

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
           

            <Card>
                <Card.Body>
                    <Form noValidate onSubmit={handleSubmit}>
                         {loading && (
                <div className="loading-container">
                    <Spinner type="grow" color="primary" size="lg" />
                    <p>Please wait while the data loads...</p>
                </div>
            )}
                        {!loading && (
                            <>
                                <Form.Group className="mb-3" controlId="validationEmployees">
                                    <Form.Label>sending for</Form.Label>
                                    <EmployeeSearchSelect
                                        value={employees}
                                        onChange={handleEmployeesChange}
                                        isMulti={true}
                                        name="employees"
                                        className={`${getInputClass(employeesStatus)}`}
                                        isValid={employeesStatus === 'invalid'} // Définir l'état d'erreur
                                    />
                                    {employeesStatus === 'invalid' && (
                                        <Form.Control.Feedback type="invalid">
                                            {"Please provide a valid employee."}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="validationTitle">
                                    <Form.Label>Titre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="title"
                                        name="title"
                                        value={title}
                                        onChange={(emp) => {
                                            setTitleStatus('neutral');
                                            setTitle(emp.target.value);
                                        }}

                                        className={getInputClass(titleStatus)}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {"Please provide a valid email address."}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="validationEmploymentStatus">
                                    <Form.Label>TRequest type</Form.Label>
                                    <select
                                        className={`form-select ${getInputClass(typeStatus)}`}
                                        value={type}
                                        onChange={(e) => handleType(e.target.value)}
                                        name="type"
                                    >
                                        <option value="">Select option</option>
                                        <option value="complaint">complaint</option>
                                        <option value="request_for_information">request for information</option>
                                        <option value="exit_request">exit request</option>
                                        <option value="leave_request">leave request</option>
                                        <option value="report_a_problem">report a problem</option>
                                    </select>
                                    <Form.Control.Feedback type="invalid">
                                        Please select a valid marital status.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Label>Join file</Form.Label>
                                <Card>


                                    <FileUploader onFileUpload={handleFileUpload} />

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

                </Card.Body>
            </Card>

        </>
    );
});

export default Request;
