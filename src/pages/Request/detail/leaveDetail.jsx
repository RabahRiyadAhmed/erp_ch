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
import getFile from "../../../utils/getFile";
import Access from "../../../utils/Access";
import AccessFile from '../../../components/erp/AccessFile';
import ImageFetch from '../../../components/erp/ImageFetch';
import { setDefaultLocale } from "react-datepicker";
import moment from 'moment'
import classNames from "classnames";
const Request = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [requests, setRequest] = useState([])
    const [leave, setLeave] = useState(null)
    const [is_sup, setISSUP] = useState(false)
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
    const [defaultemployees, setEDefaultmployees] = useState([])
    const [content, setContent] = useState("")
    const [titleStatus, setTitleStatus] = useState("neutral")
    const [typeStatus, setTypeStatus] = useState("neutral")
    const [employeesStatus, setEmployeesStatus] = useState("neutral")
    const [contentStatus, setContentStatus] = useState("neutral")
    const [files, setFile] = useState([])
    const [imageUrl, setImageUrl] = useState(null)
    const [imageUrlSup, setImageUrlSup] = useState(null)
    const [imageUrlRh, setImageUrlRh] = useState(null)
    const [imageUrlFinal, setImageUrlFinal] = useState(null)
    const [responseStatus, setResponseStatus] = useState('');
    const getInputClass = (status) => {
        if (status === "invalid") return "is-invalid";
        return ""; // Neutral or valid
    };

    useEffect(() => {
        if (auth) {
            if (leave) {
                const url = `${process.env.REACT_APP_API_URL}/api/file/employee/profile/image`;
                getFile(url, auth.token, { id: leave.employee_id }).then(setImageUrl)
                if (leave.supervisor) {
                    const url = `${process.env.REACT_APP_API_URL}/api/file/employee/profile/image`;
                    getFile(url, auth.token, { id: leave.supervisor.id }).then(setImageUrlSup)
                }
                if (leave.rh) {
                    const url = `${process.env.REACT_APP_API_URL}/api/file/employee/profile/image`;
                    getFile(url, auth.token, { id: leave.rh.id }).then(setImageUrlRh)
                }
                if (leave.finalApprover) {
                    const url = `${process.env.REACT_APP_API_URL}/api/file/employee/profile/image`;
                    getFile(url, auth.token, { id: leave.finalApprover.id }).then(setImageUrlFinal)
                }
            }

        }
    }, [auth, leave])
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

    const handleleaveApprovouve = async () => {
        try {
            const fileUrl = await getFile(`${process.env.REACT_APP_API_URL}/api/generate-file/leave`, auth.token, { id: id });

            // Vérifiez si fileUrl est une chaîne de caractères valide avant d'ouvrir l'URL
            if (fileUrl) {
                window.open(fileUrl, "_blank");
            } else {
                console.error("L'URL du fichier est invalide ou manquante.");
            }
        } catch (error) {

            console.error("Erreur lors de la génération du fichier PDF :", error);
        }

    }
    const handleType = (type) => {
        setType("neutral")
        setType(type)
    }
    const handleContentChange = (content) => {
        setContentStatus("neutral")
        setContent(content)
    };

    const handleResponse = (respond => {
        setLoading2(true);
        setError2(null)
        fetch(`${process.env.REACT_APP_API_URL}/api/request/leave/employee/respond`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({ id: id, respond: respond })
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status) {
                    navigate(0)
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
                if (error.name === "AbortError") {
                    console.log("Requête annulée :", error);
                } else {
                    console.error(error);
                    setError2("An unexpected error occurred.");
                }
            })
            .finally(() => {

                setLoading2(false); // Met à jour `loading` uniquement pour la dernière requête

            });
    })

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



    const getData = () => {

        console.log(auth)
        setLoading(true);

        fetch(`${process.env.REACT_APP_API_URL}/api/request/leave/employee/detail`, {
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

                    let Attachments = [];
                    const attachmentsList = res.data.leave.LeaveAttachments || []; // Vérifie si Attachments existe
                    if (Array.isArray(attachmentsList)) {
                        attachmentsList.forEach(att => {
                            Attachments.push({
                                file_path: att.file_path,
                                file_size: att.file_size,
                                file_name: att.file_name,
                                file_type: att.file_type,
                                preview: att.preview, // Correction ici (orthographe)
                                url:`/api/file/leave/file?file=${att.file_path}&id=${id}`
                            });
                        });
                    }

                    // Ajoute Attachments au request si nécessaire
                    res.data.leave.LeaveAttachments = Attachments;
                   
                    setLeave(res.data.leave)
                    setISSUP(res.data.is_sup)
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


    const handleRetry = () => {
        setError("");

        getData();
    };
    const StatusColumn = (status) => {
        return (
            <>
                <span
                    className={classNames("badge", "fs-5", {
                        "bg-success": status === "approved",
                        "bg-soft-danger text-danger": status === "rejected",
                        "bg-soft-secondary text-secondary": status === "pending",
                    })}
                >
                    {status}
                </span>
            </>
        );
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


            <Row className="align-items-center mb-3">
                <Col lg={8}>
                    <h4 className="page-title">Request</h4>
                </Col>


            </Row>






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



            {!loading && !error && (

                <Card className="mb-3">
                    <Card.Body>
                        <div className="d-flex align-items-start mb-3 mt-1">
                            

                            <ImageFetch


                                image={'/api/file/employee/profile/image'}
                                defaulBody={{ id: leave.employee.id }}
                                className="rounded-circle"
                                alt={leave.employee.first_name + ' ' + leave.employee.last_name}
                                width={32}
                                height={32}

                            />

                            <div className="w-100">
                                <small className="float-end">{StatusColumn(leave.status)}</small>
                                {Access(auth, 'HR') && (<div className="float-end" onClick={handleleaveApprovouve}><i className="mdi mdi-link me-2 text-muted vertical-middle"> get</i></div>)}

                                <h6 className="m-0 font-14">{leave.employee.first_name + ' ' + leave.employee.last_name}</h6>
                                <small className="text-muted">
                                    {moment(leave.createdAt).format('YYYY-MM-DD HH:mm')}
                                </small>

                            </div>
                        </div>
                        <Row>
                            <Col xs={12} sm={6} md={4} lg={4} xl={4}>
                                <h4 className="font-13 text-muted text-uppercase mb-1">
                                    request type :
                                </h4>
                                <p className="mb-1">{leave.type}</p>
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={4} xl={4}>
                                <h4 className="font-13 text-muted text-uppercase mb-1">
                                    start date :
                                </h4>
                                <p className="mb-1">{moment(leave.start_date).format('YYYY-MM-DD HH:MM')}</p>
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={4} xl={4}>
                                <h4 className="font-13 text-muted text-uppercase mb-1">
                                    end date :
                                </h4>
                                <p className="mb-1">{leave.end_date ? moment(leave.end_date).format('YYYY-MM-DD HH:MM') : '/'}</p>
                            </Col>
                        </Row>


                        <AccessFile token={auth.token} files={leave.LeaveAttachments} file_url={'/api/file/leave/file'}/>
                        <hr />
                        <h4 className="font-13 text-muted text-uppercase mb-1">
                            content :
                        </h4>
                        <p className="mb-1">{leave.content}</p>


                        <hr />

                        <Row>
                            {leave && leave.supervisor_approved != null && (
                                <Col xs={12} sm={6} md={4} lg={4} xl={4}>
                                    <div className="d-flex align-items-start mb-3 mt-1">
                                        <img
                                            className="d-flex me-2 rounded-circle"
                                            src={imageUrlSup}
                                            alt={leave.supervisor.first_name + ' ' + leave.supervisor.last_name}
                                            height="32"
                                        />
                                        <div className="w-100">

                                            <h6 className="m-0 font-14">{leave.supervisor.first_name + ' ' + leave.supervisor.last_name}</h6>
                                            <small className="text-muted">
                                                {moment(leave.supervisor_date).format('YYYY-MM-DD HH:mm')}
                                            </small>
                                        </div>
                                    </div>
                                    <div>
                                        <span
                                            className={classNames("badge", "fs-6", {
                                                "bg-success": leave.supervisor_approved === true,
                                                "bg-soft-danger text-danger": leave.supervisor_approved === false,

                                            })}
                                        >
                                            {leave.supervisor_approved ? "approved" : "rejected"}
                                        </span>
                                    </div>
                                </Col>
                            )}

                            {leave && leave.rh_approved != null && (
                                <Col xs={12} sm={6} md={4} lg={4} xl={4}>
                                    <div className="d-flex align-items-start mb-3 mt-1">
                                        <img
                                            className="d-flex me-2 rounded-circle"
                                            src={imageUrlRh}
                                            alt={leave.rh.first_name + ' ' + leave.rh.last_name}
                                            height="32"
                                        />
                                        <div className="w-100">

                                            <h6 className="m-0 font-14">{leave.rh.first_name + ' ' + leave.rh.last_name}</h6>
                                            <small className="text-muted">
                                                {moment(leave.rh_date).format('YYYY-MM-DD HH:mm')}
                                            </small>
                                        </div>
                                    </div>
                                    <div>
                                        <span
                                            className={classNames("badge", "fs-6", {
                                                "bg-success": leave.rh_approved === true,
                                                "bg-soft-danger text-danger": leave.rh_approved === false,

                                            })}
                                        >
                                            {leave.rh_approved ? "approved" : "rejected"}
                                        </span>
                                    </div>
                                </Col>
                            )}


                            {leave && leave.final_approved != null && (
                                <Col xs={12} sm={6} md={4} lg={4} xl={4}>
                                    <div className="d-flex align-items-start mb-3 mt-1">
                                        <img
                                            className="d-flex me-2 rounded-circle"
                                            src={imageUrlFinal}
                                            alt={leave.finalApprover.first_name + ' ' + leave.finalApprover.last_name}
                                            height="32"
                                        />
                                        <div className="w-100">

                                            <h6 className="m-0 font-14">{leave.finalApprover.first_name + ' ' + leave.finalApprover.last_name}</h6>
                                            <small className="text-muted">
                                                {moment(leave.final_approver_date).format('YYYY-MM-DD HH:mm')}
                                            </small>
                                        </div>
                                    </div>
                                    <div>
                                        <span
                                            className={classNames("badge", "fs-6", {
                                                "bg-success": leave.final_approved === true,
                                                "bg-soft-danger text-danger": leave.final_approved === false,

                                            })}
                                        >
                                            {leave.final_approved ? "approved" : "rejected"}
                                        </span>
                                    </div>
                                </Col>
                            )}





                        </Row>


                        {auth && (((auth.role === 'HR'|| auth.role === 'DHR') && leave.rh_approved == null) || (auth.role === 'CEO' && leave.final_approved == null) || (is_sup && leave.supervisor_approved == null)) && (
                            <>
                                <br></br>
                                <hr></hr>
                                {!loading2 && error2 && (
                                    <div className="error-container">
                                        <p>{error2}</p>

                                    </div>
                                )}
                                <h4 className="font-13 text-muted text-uppercase mb-1">
                                    respond to the request
                                </h4>
                                <button
                                    type="button"
                                    className="btn w-sm btn-success waves-effect waves-light me-1"
                                    onClick={() => handleResponse('approved')}
                                    disabled={loading2 || responseStatus !== ''}
                                >
                                    {loading2 && responseStatus === 'approved' ? (
                                        <div>{t("loading")}<Spinner color="white" size="sm" /></div>
                                    ) : (
                                        t("Approve")
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className="btn w-sm btn-danger waves-effect waves-light me-1"
                                    onClick={() => handleResponse('rejected')}
                                    disabled={loading2 || responseStatus !== ''}
                                >
                                    {loading2 && responseStatus === 'rejected' ? (
                                        <div>{t("loading")}<Spinner color="white" size="sm" /></div>
                                    ) : (
                                        t("Reject")
                                    )}
                                </button>
                            </>
                        )}

                    </Card.Body>
                </Card>

            )}






        </>
    );
};

export default Request;
