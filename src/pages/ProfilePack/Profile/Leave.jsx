import React, { useContext, useState, useEffect } from "react";
import { Navigate, Link, useNavigate, useParams } from "react-router-dom";
import StatisticsWidget from "../../../components/StatisticsWidget";
import { Row, Col, Card, Form, InputGroup, Button, Modal, Alert, Dropdown } from "react-bootstrap";
import CountUp from "react-countup";
import Table from "../../../components/Table";
import Spinner from "../../../components/Spinner";
import { AuthContext } from "../../../helpers/AuthContext";
import FileUploader from "../../../components/FileUploader";
import moment from 'moment'
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import classNames from "classnames";
const Leave = ({id}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { auth, logout, updateToken } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error2, setError2] = useState("");
  const [loading2, setLoading2] = useState(false);
  const [data, setData] = useState(null);
  const [title, setTitle] = useState(null)
  const [type, setType] = useState(null)
  const [start_date, setStartDate] = useState(null)
  const [end_date, setEndDate] = useState(null)
  const [files, setFile] = useState([])
  const [content, setContent] = useState("")
  const [showModel, setShowModal] = useState(false)
  const [titleStatus, setTitleStatus] = useState("neutral")
  const [typeStatus, setTypeStatus] = useState("neutral")
  const [start_dateStatus, setStartDateStatus] = useState("neutral")
  const [end_dateStatus, setEndDateStatus] = useState("neutral")
  const [contentStatus, setContentStatus] = useState("neutral")


  const StatusColumn = ({ row }) => {
    return (
      <>
        <span
          className={classNames("badge", {
            "bg-success": row.original.status === "approved",
            "bg-soft-danger text-danger": row.original.status === "rejected",
            "bg-soft-secondary text-secondary": row.original.status === "pending",
          })}
        >
          {row.original.status}
        </span>
      </>
    );
  };
  const getInputClass = (status) => {
    if (status === "invalid") return "is-invalid";
    return ""; // Neutral or valid
  };

  const handleType = (type) => {
    setType("neutral")
    setType(type)
  }
  const handleNavigate = (row) => {
    navigate('/request/leave/detail/' + row.original.id)
  };

  const toggleCreate = () => {
    setTitle('')
    setTitleStatus("neutral")
    setType('')
    setTypeStatus("neutral")
    setContent('')

    setStartDate(null)
    setStartDateStatus("neutral")
    setEndDate(null)
    setEndDateStatus("neutral")
    setFile([])
    setShowModal(!showModel);
  };

  const toggleHide = () => {
    setShowModal(!showModel);
  }
  const handleFileUpload = (uploadedFiles) => {
    setFile(uploadedFiles);
  };



  const handleSubmit = (e) => {

    e.preventDefault();


    let isValid = true;

    if (!title) { isValid = false; setTitleStatus('invalid') }
    if (!start_date) { isValid = false; setStartDateStatus('invalid') }
    if (!end_date && type != 'sick_leave') { isValid = false; setEndDateStatus('invalid') }
    if (!content) { isValid = false; setContentStatus('invalid') }

    if (!type) { isValid = false; setTypeStatus('invalid') }

    if (!isValid) {
      return;
    }


    const formData = new FormData();
    console.log(title)
    console.log(type)
    console.log(moment(start_date).format('YYYY-MM-DD HH:mm'))
    console.log(moment(end_date).format('YYYY-MM-DD HH:mm'))
    console.log(content)
    formData.append('title', title);
    formData.append('type', type);
    formData.append('start_date', moment(start_date.toISOString()).format('YYYY-MM-DD HH:mm'));
    if (end_date) {
      formData.append('end_date', moment(end_date.toISOString()).format('YYYY-MM-DD HH:mm'));
    }

    if (files && files.length > 0) {
      files.forEach((f) => {
        formData.append("files", f);
      });
    }


    formData.append('content', content);
    console.log(formData)

    setLoading2(true);
    setError2(null);
    fetch(`${process.env.REACT_APP_API_URL}/api/request/leave/employee/send`, {
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
    fetch(`${process.env.REACT_APP_API_URL}/api/request/leave/employee/getLeave${id? '/detail' :''}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({id:id }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          setData(res.data);
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
        console.log(error);
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
    setLoading(true);
    getData();
  };


  const handleEndDate = (date) => {
    setEndDateStatus("neutral")
    setEndDate(date)
  };

  const handleStartDate = (date) => {
    setStartDateStatus("neutral")
    setStartDate(date)
  };

  const columns = [

    {
      Header: "Type",
      accessor: "type",
    },

    {
      Header: "Title",
      accessor: "title",
    },

    {
      Header: "start date",
      accessor: "start_date",
      Cell: ({ row }) => (moment(row.original.start_date).format('YYYY-MM-DD HH:mm'))
    },

    {
      Header: "return date",
      accessor: "end_date",
      Cell: ({ row }) => (moment(row.original.end_date).format('YYYY-MM-DD HH:mm'))
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: StatusColumn
    },

  ];
  return (
    <>
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
      {!loading && data && !error && (
        <div>
          <Modal show={showModel} onHide={toggleHide} size="xl" >
            <Modal.Body>
              <Form noValidate onSubmit={handleSubmit}>


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
                    <option value="release">release</option>
                    <option value="leave">leave</option>
                    <option value="sick_leave">sick leave</option>
                  </select>
                  <Form.Control.Feedback type="invalid">
                    Please select a valid marital status.
                  </Form.Control.Feedback>
                </Form.Group>


                <Form.Group className="mb-3" controlId="validationRoleStartDate">
                  <Form.Label>start_date</Form.Label>

                  <DatePicker
                    selected={start_date}
                    onChange={(date) => handleStartDate(date)}
                    dateFormat="yyyy-MM-dd hh:mm aa"
                    showTimeInput
                    required
                    isClearable
                    name="start_date"
                    className={`form-control ${getInputClass(start_dateStatus)}`} // Appliquer la classe CSS basée sur l'état
                    placeholderText="Select date"
                  />

                  {start_dateStatus === "invalid" && (
                    <div >
                      Please select a valid date.
                    </div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="validationBirth_date">
                  <Form.Label>end_date</Form.Label>

                  <DatePicker
                    selected={end_date}
                    onChange={(date) => handleEndDate(date)}
                    dateFormat="yyyy-MM-dd hh:mm aa"
                    showTimeInput
                    required
                    isClearable
                    name="end_date"
                    className={`form-control ${getInputClass(end_dateStatus)}`} // Appliquer la classe CSS basée sur l'état
                    placeholderText="Select date"
                  />

                  {end_dateStatus === "invalid" && (
                    <div >
                      Please select a valid date.
                    </div>
                  )}
                </Form.Group>


                <Form.Group className="mb-3" controlId="validationTitle">
                  <Form.Label>content</Form.Label>
                  <Form.Control
                    type="textarea"
                    placeholder="content"
                    name="content"
                    value={content}
                    onChange={(emp) => {
                      setContentStatus('neutral');
                      setContent(emp.target.value);
                    }}

                    className={getInputClass(contentStatus)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {"Please provide a valid email address."}
                  </Form.Control.Feedback>
                </Form.Group>


                <Card>


                  <FileUploader onFileUpload={handleFileUpload}


                    
                  />




                </Card>






                {!loading2 && error2 && (
                  <div className="error-container">
                    <p>{error2}</p>

                  </div>
                )}
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
          <Row>
            <Col md={12} xl={4}>
              <StatisticsWidget
                variant="primary"
                counterOptions={{
                  suffix: " day",
                }}
                description="number of days consumed"
                stats={data.consumedLeaveDays}
                icon="fe-calendar"
              />
            </Col>

            <Col md={12} xl={4}>
              <StatisticsWidget
                variant="primary"
                counterOptions={{
                  suffix: " day",
                }}
                description="number of days remaining"
                stats={data.remainingLeaveDays}
                icon="fe-clock"
              />
            </Col>

            <Col md={12} xl={4}>
              <StatisticsWidget
                variant="primary"
                counterOptions={{
                  suffix: " day",
                }}
                description="number of days accumulated"
                stats={data.accruedLeaveDays}
                icon="fe-plus-circle"
              />
            </Col>





          </Row>
          <Row className="align-items-center mb-3">
            <Col>
              <h4 className="header-title m-0">exist request</h4>
            </Col>
           {!id && (<Col className="text-end">
              <Button
                variant="dark"
                onClick={toggleCreate}
                className="rounded-pill waves-effect waves-light"
              >
                send request
              </Button>
            </Col>)}
          </Row>

          <Table
            columns={columns}
            data={data.leave_requests}
            pageSize={5}
            sizePerPageList={[
              { text: "5", value: 5 },
              { text: "10", value: 10 },
              { text: "20", value: 20 },
            ]}
            isSortable={true}
            pagination={true}
            isSearchable={true}
            onRowClick={(row) => handleNavigate(row)}
          />
        </div>
      )}
    </>
  );
};

export default Leave;
