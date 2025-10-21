import React, { useContext, useState } from "react";

import {
    Row,
    Col,
    Card,
    Button,
    Modal,
    Alert,
    Dropdown, Form, FloatingLabel
} from "react-bootstrap";
import moment from 'moment'
import DatePicker from "react-datepicker";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MapWithLeaflet from './MapWithLeaflet'
import { useParams, Link, useNavigate } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { FormInput } from "../../../components/";
import Access from "../../../utils/Access";
import getFile from "../../../utils/getFile";
import { RootState } from "../../../redux/store";
import { logout, updateToken } from '../../../redux/authSlice';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
const PersonalInfo = ({ employee_role }: any) => {
    const { t } = useTranslation()
    const [error2, setError2] = useState<any>();
    const [loading2, setLoading2] = useState(false);
    const [probationConfirmModal, setProbationConfirmModal] = useState<boolean>(false)
    const [date_repport, setDateRepport] = useState<any>(null)
    const [date_repportStatus, setDateRepportStatus] = useState<string>("neutral")
    const [error3, setError3] = useState<any>();
    const [loading3, setLoading3] = useState(false);
    const [extensionPeriodModal, setExtensionPeriodModal] = useState<boolean>(false)
    const [extensionPeriod, setExtensionPeriod] = useState<any>(0)
    const [extensionPeriodStatus, setExtensionPeriodStatus] = useState<string>("neutral")
    const [endOfContractModal, setEndOfContractModal] = useState<boolean>(false)
    const [error4, setError4] = useState<any>();
    const [loading4, setLoading4] = useState(false);
    const auth = useSelector((state: RootState) => state.Auth);
    const navigate = useNavigate();
    const handleUpdate = () => {
        navigate('/employee/update/post/' + employee_role.employee_id + '/' + employee_role.id)
    }


    const getInputClass = (status: string) => {
        if (status === "invalid") return "is-invalid";
        return ""; // Neutral or valid
    };


    const handleAttestation = async () => {
        try {
            const fileUrl = await getFile(`${process.env.REACT_APP_API_URL}/api/generate-file/attestation-de-travail`, auth.token, { id: employee_role.id });

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



    const handleProbationEnd = async () => {
        try {
            const fileUrl = await getFile(`${process.env.REACT_APP_API_URL}/api/generate-file/ProbationEnd`, auth.token, { id: employee_role.id });

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

    


    const handleProbationConfirm = async (e: any) => {
        e.preventDefault();
        setLoading2(true)
        setError2(null)
        if (!date_repport) {
            setDateRepportStatus('invalid')
            return;
        }
        try {

            const fileUrl = await getFile(`${process.env.REACT_APP_API_URL}/api/generate-file/ProbationConfirm`, auth.token, { id: employee_role.id, date_repport: moment(date_repport.toISOString()).format('YYYY-MM-DD') });
            setLoading2(false)
            // Vérifiez si fileUrl est une chaîne de caractères valide avant d'ouvrir l'URL
            if (fileUrl) {
                window.open(fileUrl, "_blank");
                setProbationConfirmModal(false)
            } else {
                setError2("L'URL du fichier est invalide ou manquante.")
                console.error("L'URL du fichier est invalide ou manquante.");
            }
        } catch (error) {
            setError2("Erreur lors de la génération du fichier PDF")
            console.error("Erreur lors de la génération du fichier PDF :", error);
        }
        setLoading2(false)
    };
    const toggleProbationConfirmModalHide = () => {
        setDateRepport(null)
        setProbationConfirmModal(!probationConfirmModal);
    }

    const handleProbationExtension = async (e: any) => {
        e.preventDefault();
        setLoading3(true)
        setError3(null)
        if (!date_repport && !extensionPeriod) {
            if(!extensionPeriod) setExtensionPeriodStatus('invalid')
            if(!date_repport) setDateRepportStatus('invalid')
            
            return;
        }
        try {

            const fileUrl = await getFile(`${process.env.REACT_APP_API_URL}/api/generate-file/ProbationExtension`, auth.token, { id: employee_role.id, date_repport: moment(date_repport.toISOString()).format('YYYY-MM-DD'), extensionPeriod });
            setLoading3(false)
            // Vérifiez si fileUrl est une chaîne de caractères valide avant d'ouvrir l'URL
            if (fileUrl) {
                window.open(fileUrl, "_blank");
                setExtensionPeriodModal(false)
            } else {
                setError3("L'URL du fichier est invalide ou manquante.")
                console.error("L'URL du fichier est invalide ou manquante.");
            }
        } catch (error) {
            setError3("Erreur lors de la génération du fichier PDF")
            console.error("Erreur lors de la génération du fichier PDF :", error);
        }
        setLoading3(false)
    };
    const toggleProbationExtensionModalHide = () => {
        setDateRepport(null)
        setExtensionPeriod(null)
        setExtensionPeriodModal(!extensionPeriodModal);
    }


    const changeProbationConfirm = (date: any) => {
        setDateRepportStatus('neutral')
        setDateRepport(date)
    };

    const changeProbationConfirm2 = (date: any) => {
        setDateRepportStatus('neutral')
        setDateRepport(date)
    };

    const toggleEndOfContractModalHide = () => {
        setDateRepport(null)
        setEndOfContractModal(!endOfContractModal);
    }


    const handleEndOfContract = async (e: any) => {
        e.preventDefault();
        setLoading2(true)
        setError2(null)
        if (!date_repport) {
            setDateRepportStatus('invalid')
            return;
        }
        try {

            const fileUrl = await getFile(`${process.env.REACT_APP_API_URL}/api/generate-file/EndOFContract`, auth.token, { id: employee_role.id, date_repport: moment(date_repport.toISOString()).format('YYYY-MM-DD') });
            setLoading4(false)
            // Vérifiez si fileUrl est une chaîne de caractères valide avant d'ouvrir l'URL
            if (fileUrl) {
                window.open(fileUrl, "_blank");
                setProbationConfirmModal(false)
            } else {
                setError4("L'URL du fichier est invalide ou manquante.")
                console.error("L'URL du fichier est invalide ou manquante.");
            }
        } catch (error) {
            setError4("Erreur lors de la génération du fichier PDF")
            console.error("Erreur lors de la génération du fichier PDF :", error);
        }
        setLoading4(false)
    };
    return (
        <>



            <Modal show={probationConfirmModal} onHide={toggleProbationConfirmModalHide}>
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
                    <form className="ps-3 pe-3" onSubmit={handleProbationConfirm} >
                        <h3> Date Repport </h3>
                        <div className="mb-3">
                            <Form.Group className="mb-3" controlId="validationBirth_date">
                                <Form.Label>Date Repport</Form.Label>

                                <DatePicker
                                    selected={date_repport}
                                    onChange={(date) => setDateRepport(date)}
                                    dateFormat="yyyy-MM-dd"
                                    showTimeInput
                                    required
                                    isClearable
                                    name="role_end_date"
                                    className={`form-control ${getInputClass(date_repportStatus)}`} // Appliquer la classe CSS basée sur l'état
                                    placeholderText="Select date"
                                />

                                {date_repportStatus === "invalid" && (
                                    <div >
                                        Please select a valid date.
                                    </div>
                                )}
                            </Form.Group>

                        </div>

                        <div className="mb-3 text-center">
                            <button className="btn rounded-pill btn-primary" type="submit" disabled={loading2}>
                                {loading2 ? <div>{t("loading...")}<Spinner color="white" size="sm" /></div> : t("send")}
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>




            <Modal show={extensionPeriodModal} onHide={toggleEndOfContractModalHide}>
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
                    <form className="ps-3 pe-3" onSubmit={ handleProbationConfirm} >
                        <h3> End of contract </h3>
                        <div className="mb-3">
                            <Form.Group className="mb-3" controlId="validationBirth_date">
                                <Form.Label>Date Repport</Form.Label>

                                <DatePicker
                                    selected={date_repport}
                                    onChange={(date) => setDateRepport(date)}
                                    dateFormat="yyyy-MM-dd"
                                    showTimeInput
                                    required
                                    isClearable
                                    name="role_end_date"
                                    className={`form-control ${getInputClass(date_repportStatus)}`} // Appliquer la classe CSS basée sur l'état
                                    placeholderText="Select date"
                                />

                                {date_repportStatus === "invalid" && (
                                    <div >
                                        Please select a valid date.
                                    </div>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="validationFirstName">
                                <Form.Label>Probation period extension</Form.Label>
                                <Form.Control
                                    type="number"
                                    min={0}
                                    placeholder="probation period"
                                    name="probation_period"
                                    value={extensionPeriod}
                                    onChange={(e:any)=>setExtensionPeriod(e.target.value)}
                                    className={getInputClass(extensionPeriodStatus)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid probation period.
                                </Form.Control.Feedback>
                            </Form.Group>

                        </div>

                        <div className="mb-3 text-center">
                            <button className="btn rounded-pill btn-primary" type="submit" disabled={loading2}>
                                {loading3 ? <div>{t("loading...")}<Spinner color="white" size="sm" /></div> : t("send")}
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>


            <Modal show={endOfContractModal} onHide={toggleEndOfContractModalHide}>
                <Modal.Body>
                    <div className="text-center mt-2 mb-4">
                        <div className="auth-logo">
                            <span className="logo-xl">
                                <img src={`${process.env.REACT_APP_API_URL}/image/logo.jpeg`} alt="" />
                            </span>

                        </div>
                    </div>
                    {error4 && (
                        <Alert variant="danger" className="my-2">
                            {error4}
                        </Alert>
                    )}
                    <form className="ps-3 pe-3" onSubmit={handleEndOfContract} >
                        <h3> Date Repport </h3>
                        <div className="mb-3">
                            <Form.Group className="mb-3" controlId="validationBirth_date">
                                <Form.Label>Date Repport</Form.Label>

                                <DatePicker
                                    selected={date_repport}
                                    onChange={(date) => setDateRepport(date)}
                                    dateFormat="yyyy-MM-dd"
                                    showTimeInput
                                    required
                                    isClearable
                                    name="role_end_date"
                                    className={`form-control ${getInputClass(date_repportStatus)}`} // Appliquer la classe CSS basée sur l'état
                                    placeholderText="Select date"
                                />

                                {date_repportStatus === "invalid" && (
                                    <div >
                                        Please select a valid date.
                                    </div>
                                )}
                            </Form.Group>

                        </div>

                        <div className="mb-3 text-center">
                            <button className="btn rounded-pill btn-primary" type="submit" disabled={loading4}>
                                {loading4 ? <div>{t("loading...")}<Spinner color="white" size="sm" /></div> : t("send")}
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            {console.log(employee_role)}

            <h5 className="  text-uppercase bg-light p-2">
                <i className="mdi mdi-bag-checked me-1"></i> Post
            </h5>
            {Access(auth, 'HR') && (
                <Dropdown className="card-widgets" align="end">
                    <Dropdown.Toggle className="table-action-btn dropdown-toggle btn btn-light btn-xs">
                        <i className="mdi mdi-dots-horizontal"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>

                        <Dropdown.Item onClick={handleAttestation}>
                            <i className="mdi mdi-square-edit-outline me-2 text-muted vertical-middle"></i>
                            Attestation de travail
                        </Dropdown.Item>


                        <Dropdown.Item onClick={handleProbationEnd}>
                            <i className="mdi mdi-square-edit-outline me-2 text-muted vertical-middle"></i>
                            Probation End
                        </Dropdown.Item>

                        <Dropdown.Item onClick={toggleProbationConfirmModalHide}>
                            <i className="mdi mdi-square-edit-outline me-2 text-muted vertical-middle"></i>
                            Probation Confirm
                        </Dropdown.Item>

                        <Dropdown.Item onClick={toggleProbationExtensionModalHide}>
                            <i className="mdi mdi-square-edit-outline me-2 text-muted vertical-middle"></i>
                            Probation extension
                        </Dropdown.Item>

                        <Dropdown.Item onClick={toggleEndOfContractModalHide}>
                            <i className="mdi mdi-square-edit-outline me-2 text-muted vertical-middle"></i>
                            end of contract
                        </Dropdown.Item>

                        <Dropdown.Item onClick={handleUpdate}>
                            <i className="mdi mdi-square-edit-outline me-2 text-muted vertical-middle"></i>
                            edit
                        </Dropdown.Item>
                        {/*<Dropdown.Item onClick={toggleDeleteHide}>
                            <i className="mdi mdi-delete me-2 text-muted vertical-middle"></i>
                            Remove
                            </Dropdown.Item>*/}
                    </Dropdown.Menu>
                </Dropdown>
            )}
            <div>
                <h4 className="font-13 text-muted text-uppercase mb-1">
                    Post :
                </h4>
                <p className="mb-1">
                    {employee_role.Role.role_name}
                </p>
                <Row>
                    <Col lg={6}>
                        <h4 className="font-13 text-muted text-uppercase mb-1">
                            start :
                        </h4>
                        <p className="mb-1">{employee_role.role_start_date}</p>
                    </Col>
                    <Col lg={6}>
                        <h4 className="font-13 text-muted text-uppercase mb-1">
                            end :
                        </h4>
                        <p className="mb-1">{employee_role.role_end_date}</p>
                    </Col>
                </Row>
                <Row>
                    <Col lg={4}>
                        <h4 className="font-13 text-muted text-uppercase mb-1">
                            payment type :
                        </h4>
                        <p className="mb-1">{employee_role.payment_type}</p>
                    </Col>
                    <Col lg={4}>
                        <h4 className="font-13 text-muted text-uppercase mb-1">
                            payment Rate:
                        </h4>
                        <p className="mb-1">{employee_role.payment_rate} <span className="badge bg-secondary text-light">{employee_role.currency}</span>

                        </p>
                    </Col>
                    <Col lg={4}>
                        <h4 className="font-13 text-muted text-uppercase mb-1">
                            employment status :
                        </h4>
                        <p className="mb-1">{employee_role.employment_status}</p>
                    </Col>
                </Row>

                <Row>
                    <Col lg={4}>
                        <h4 className="font-13 text-muted text-uppercase mb-1">
                            localisation :
                        </h4>
                        <p className="mb-1">{employee_role.Location.name}</p>
                    </Col>
                    <Col lg={4}>
                        <h4 className="font-13 text-muted text-uppercase mb-1">
                            Division :
                        </h4>
                        <p className="mb-1">{employee_role.Division.division_name}</p>
                    </Col>
                    <Col lg={4}>
                        <h4 className="font-13 text-muted text-uppercase mb-1">
                            Department :
                        </h4>
                        <p className="mb-1">{employee_role.Department.department_name}</p>
                    </Col>

                    <h4 className="header-title mb-3">Basic Google Map</h4>

                    <div
                        className="gmaps"
                        style={{ position: "relative", overflow: "hidden" }}
                    >
                        <MapWithLeaflet />
                    </div>
                </Row>
            </div>

        </>
    );
};

export default PersonalInfo;
