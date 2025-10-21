import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { logout, updateToken } from "../../redux/authSlice";
import Calender from "../../components/erp/Calender";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from "../../components/Spinner";
import Access from "../../utils/Access";
import {
    Row,
    Col,
    Card,
    Button,
    Modal,
    Alert,
    Dropdown,
    Form
} from "react-bootstrap";
import moment from 'moment';

const CalenderDashboard = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.Auth);
    const { t, i18n } = useTranslation();
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventData, setEventData] = useState({
        id: null,
        title: null,
        content: null,
        start: null,
        end: null,
        type: null,
    });
    const [eventDataStatus, setEventDataStatus] = useState({
        title: "neutral",
        content: "neutral",
        start: "neutral",
        end: "neutral",
        type: "neutral",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loading2, setLoading2] = useState(false);
    const [error2, setError2] = useState(null);
    const [loading3, setLoading3] = useState(false);
    const [error3, setError3] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [calenderDate, setCalenderDate] = useState(new Date());
    const [modeView, setModeView] = useState('month');

    const calendarRef = useRef(null); // Référence pour accéder à l'API FullCalendar

    const getData = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/events/getList`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({ mode: modeView, date: calenderDate }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status) {
                    setEvents(res.data.events);
                    if (res.token) {
                        dispatch(updateToken(res.token));
                    }
                } else {
                    if (res.message === "Token error") {
                        dispatch(logout());
                    }
                    setError(res.message || "system error");
                }
            })
            .catch(() => {
                setError("An unexpected error occurred.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        console.log('getData')
        if (auth) {
            getData();
        }
    }, [auth,showModal,calenderDate]);

    const handleRetry = () => {
        setError("");
        setLoading(true);
        getData();
    };

    const changeMode = (data) => {
        if(data == 'dayGridMonth'){
            setModeView('month')
        }
        if(data == 'timeGridWeek'){
            setModeView('week')
        }
        if(data == 'dayGridDay'){
            setModeView('day')
        }
    }
    const handleEventClick = (e) => {
        setSelectedEvent(e.event);
        toggleModal();
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const toggleEditModal = () => {
        setShowEditModal(!showEditModal);
    };

    const toggleDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    };

    const handleCalenderDate = (date) => {
        setCalenderDate(date);
    };

    const handleViewChange = (view) => {
        console.log("Vue actuelle :", view);
    };

    const handleAddEvent = () => {
        setEventData({
            id: null,
            title: null,
            content: null,
            start: null,
            end: null,
            type: null
        });
        setEventDataStatus({
            title: "neutral",
            content: "neutral",
            start: "neutral",
            end: "neutral",
            type: "neutral",
        });
        toggleEditModal();
    };

    const heandleEditEvent = () => {
        console.log(selectedEvent.id);
        setEventData({
            id: selectedEvent.id,
            title: selectedEvent.title,
            content: selectedEvent?.extendedProps.content,
            start: selectedEvent.start,
            end: selectedEvent.end,
            type: selectedEvent?.extendedProps.type,
        });
        setEventDataStatus({
            title: "neutral",
            content: "neutral",
            start: "neutral",
            end: "neutral",
            type: "neutral",
        });
        toggleEditModal();
    };

    const validateField = (name, value) => {
        if (name === "title" && !value) return "invalid";
        if (name === "content" && !value) return "invalid";
        if (name === "start" && !value) return "invalid";
        if (name === "type" && !value) return "invalid";
        return "neutral";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let isValid = true;
        const newFieldStatus = { ...eventDataStatus };

        // Validation locale
        for (const field in eventData) {
            newFieldStatus[field] = validateField(field, eventData[field]);
            if (newFieldStatus[field] === "invalid") isValid = false;
        }

        setEventDataStatus(newFieldStatus);

        // Arrêter ici si la validation locale échoue
        if (!isValid) {
            return;
        }

        setLoading2(true);
        setError2(null);

        const data = {
            id: eventData.id,
            title: eventData.title,
            content: eventData.content,
            start: eventData.start ? moment(eventData.start.toISOString()).format('YYYY-MM-DD HH:mm') : null,
            end: eventData.end ? moment(eventData.end.toISOString()).format('YYYY-MM-DD HH:mm') : null,
            type: eventData.type,
        };

        fetch(`${process.env.REACT_APP_API_URL}/api/events/add_or_update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({ ...data }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status) {
                    // Mettre à jour l'état local des événements
                    setEvents((prevEvents) => {
                        const eventIndex = prevEvents.findIndex((e) => e.id === res.data.event.id);
                        if (eventIndex !== -1) {
                            // Mettre à jour l'événement existant
                            const updatedEvents = [...prevEvents];
                            updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], ...res.data.event };
                            return updatedEvents;
                        } else {
                            // Ajouter un nouvel événement
                            return [...prevEvents, res.data.event]; // Assurez-vous que l'API retourne l'ID du nouvel événement
                        }
                    });

                    setShowEditModal(false); // Fermer le modal
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
    };

    const handleSubmitDelete = (e) => {
        e.preventDefault();
        setLoading3(true);
        setError3(null);

        fetch(`${process.env.REACT_APP_API_URL}/api/events/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({ id: selectedEvent.id }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status) {
                   
                    let ee = events.filter((e) => e.id != selectedEvent.id)
                  
                    
                    // Supprimer l'événement de l'état local
                    setEvents(ee);

                    // Forcer FullCalendar à se mettre à jour
                    if (calendarRef.current) {
                        const calendarApi = calendarRef.current.getApi();
                        calendarApi.refetchEvents(); // Rafraîchir les événements
                    }

                    setShowDeleteModal(false); // Fermer le modal
                    setShowModal(false);
                    console.log(events)
                } else {
                    if (res.message === "Token error") {
                        logout();
                    }
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
            });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setEventData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        // Reset local errors
        setEventDataStatus((prev) => ({
            ...prev,
            [name]: "neutral",
        }));
    };

    const handleStart = (date) => {
        setEventData({ ...eventData, start: date });
        setEventDataStatus({ ...eventData, start: "neutral" });
    };

    const handleEnd = (date) => {
        setEventData({ ...eventData, end: date });
        setEventDataStatus({ ...eventData, end: "neutral" });
    };

    const getInputClass = (status) => {
        if (status === "invalid") return "is-invalid";
        return ""; // Neutral or valid
    };

    return (
        <>
            <Modal show={showModal} onHide={toggleModal} size="lm">
                <Modal.Body>
                    {Access(auth, 'HR') && (
                        <Dropdown className="card-widgets" align="end">
                            <Dropdown.Toggle className="table-action-btn dropdown-toggle btn btn-light btn-xs">
                                <i className="mdi mdi-dots-horizontal"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={heandleEditEvent}>
                                    <i className="mdi mdi-square-edit-outline me-2 text-muted vertical-middle"></i>
                                    edit
                                </Dropdown.Item>
                                <Dropdown.Item onClick={toggleDeleteModal}>
                                    <i className="mdi mdi-delete me-2 text-muted vertical-middle"></i>
                                    Remove
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                    <h3>{selectedEvent && selectedEvent.title ? selectedEvent.title : t("title")} </h3>
                    <div className="mb-3">
                        <label htmlFor="event_content" className="form-label">
                            {t("type")}
                        </label>
                        <p className="mb-1">
                            {selectedEvent && selectedEvent?.extendedProps.type ? selectedEvent?.extendedProps.type : "/"}
                        </p>
                    </div>
                    <div className="mb-3">
                        <Row>
                            <Col xl={6}>
                                <label htmlFor="event_content" className="form-label">
                                    {t("start_t")}
                                </label>
                                <p className="mb-1">
                                    {selectedEvent && selectedEvent.start ? moment(selectedEvent.start).format("YYYY-MM-DD HH:mm") : "/"}
                                </p>
                            </Col>
                            {selectedEvent && selectedEvent.end && (
                                <Col xl={6}>
                                    <label htmlFor="event_content" className="form-label">
                                        {t("end_t")}
                                    </label>
                                    <p className="mb-1">
                                        {moment(selectedEvent.end).format("YYYY-MM-DD HH:mm")}
                                    </p>
                                </Col>
                            )}
                        </Row>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="event_content" className="form-label">
                            {t("content")}
                        </label>
                        <p className="mb-1">
                            {selectedEvent && selectedEvent?.extendedProps.content ? selectedEvent.extendedProps.content : "/"}
                        </p>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={toggleDeleteModal} size="lm">
                <Modal.Header className="py-3 px-4 border-bottom-0" closeButton>
                    <Modal.Title as="h5" id="modal-title">
                        {t("Delete event")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate onSubmit={handleSubmitDelete}>
                        <div className="mb-3">
                            <label htmlFor="event_content" className="form-label">
                                {t("delete_event_text")}
                            </label>
                            <p className="mb-1">
                                {selectedEvent ? selectedEvent.title : "/"}
                            </p>
                        </div>
                        {!loading3 && error3 && (
                            <div className="error-container">
                                <p>{error3}</p>
                            </div>
                        )}
                        <Row className="mt-2">
                            <Col className="text-end">
                                {!loading3 && (
                                    <Button className="btn btn-light me-1" onClick={toggleDeleteModal}>
                                        {t("Cancel")}
                                    </Button>
                                )}
                                <Button
                                    variant="success"
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    {loading3 ? <div>{t("sending in progress")}<Spinner color="white" size="sm" /></div> : t("send")}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showEditModal} onHide={toggleEditModal} size="lm">
                <Modal.Header className="py-3 px-4 border-bottom-0" closeButton>
                    <Modal.Title as="h5" id="modal-title">
                        {eventData.id ? t("Edit Event") : t("Add New Event")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="validationTitle">
                            <Form.Label>{t("title")}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={t("Title")}
                                name="title"
                                value={eventData.title}
                                onChange={handleChange}
                                className={getInputClass(eventDataStatus.title)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {t('Please provide a valid 1') + ' ' + t("title")}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="validationType">
                            <Form.Label>{t("type")}</Form.Label>
                            <select
                                className={`form-select ${getInputClass(eventDataStatus.type)}`}
                                value={eventData.type}
                                onChange={handleChange}
                                name="type"
                            >
                                <option key={1} value="">{t("Select option")}</option>
                                <option key={2} value="meeting">{t("meeting")}</option>
                                <option key={3} value="holiday">{t("holiday")}</option>
                                <option key={4} value="training">{t("training")}</option>
                                <option key={5} value="event">{t("event")}</option>
                                <option key={6} value="reminder">{t("reminder")}</option>
                            </select>
                            <Form.Control.Feedback type="invalid">
                                {t('Please provide a valid 1') + ' ' + t("type")}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Row>
                            <Col xl={6}>
                                <Form.Group className="mb-3" controlId="validationStart">
                                    <Form.Label>{t('start_t')}</Form.Label>
                                    <DatePicker
                                        selected={eventData.start}
                                        onChange={(date) => handleStart(date)}
                                        dateFormat="yyyy-MM-dd hh:mm aa"
                                        showTimeInput
                                        required
                                        isClearable
                                        name="start"
                                        className={`form-control ${getInputClass(eventDataStatus.start)}`}
                                        placeholderText="Select date"
                                    />
                                    {eventDataStatus.start === "invalid" && (
                                        <div>
                                            {t('Please provide a valid 2') + ' ' + t("date")}
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col xl={6}>
                                <Form.Group className="mb-3" controlId="validationEnd">
                                    <Form.Label>{t('end_t')}</Form.Label>
                                    <DatePicker
                                        selected={eventData.end}
                                        onChange={(date) => handleEnd(date)}
                                        dateFormat="yyyy-MM-dd hh:mm aa"
                                        showTimeInput
                                        required
                                        isClearable
                                        name="end"
                                        className={`form-control ${getInputClass(eventDataStatus.end)}`}
                                        placeholderText={t("Select date")}
                                    />
                                    {eventDataStatus.end === "invalid" && (
                                        <div>
                                            {t('Please provide a valid 2') + ' ' + t("date")}
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="validationContent">
                            <Form.Label>{t("content")}</Form.Label>
                            <Form.Control
                                type="textarea"
                                placeholder={t("content")}
                                name="content"
                                value={eventData.content}
                                onChange={handleChange}
                                as="textarea" rows={3}
                                className={getInputClass(eventDataStatus.content)}
                            />
                            <Form.Control.Feedback type="invalid">
                                {t('Please provide a valid 1') + ' ' + t("type")}
                            </Form.Control.Feedback>
                        </Form.Group>
                        {!loading2 && error2 && (
                            <div className="error-container">
                                <p>{error2}</p>
                            </div>
                        )}
                        <Row className="mt-2">
                            <Col className="text-end">
                                {!loading2 && (
                                    <Button className="btn btn-light me-1" onClick={toggleEditModal}>
                                        {t("Cancel")}
                                    </Button>
                                )}
                                <Button
                                    variant="success"
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    {loading2 ? <div>{t("sending in progress")}<Spinner color="white" size="sm" /></div> : t("send")}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>

            <Calender
                onDateClick={(data) => console.log(data)}
                onEventClick={handleEventClick}
                onDrop={() => console.log()}
                onEventDrop={(e) => console.log(e)}
                events={events}
                editable={false}
                eventResizableFromStart={false}
                onViewChange={handleViewChange}
                initialDate={calenderDate}
                onChangeDate={setCalenderDate}
                handleAddEvent={handleAddEvent}
                handleCalenderDate={handleCalenderDate}
                placeholderText={t("Select date")}
                locale={i18n.language === "fr" ? "fr" : "en"}
                changeMode={changeMode}
                ref={calendarRef} // Passez la référence ici
            />
        </>
    );
};

export default CalenderDashboard;