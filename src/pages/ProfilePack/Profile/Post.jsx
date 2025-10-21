import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Tab, Nav,Button } from "react-bootstrap";

// components
import Spinner from "../../../components/Spinner";
import UserBox from "./UserBox";
import Supervision from "./Supervision";
import PersonalInfo from "./PersonalInfo";
import Leave from "./Leave";
import CurrentPost from "./CurrentPost";
import OldPost from "./OldPost";
import FuturePost from "./FuturePost";
import { AuthContext } from "../../../helpers/AuthContext";
import { useTranslation } from "react-i18next";
import { useParams, Link, useNavigate } from "react-router-dom";
import Access from '../../../utils/Access'
const Post = ({ id = null }) => {
   const { t } = useTranslation();
    const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(true);
  const { auth, logout, updateToken } = useContext(AuthContext);
  console.log(id)
  const tabs = [
    {
      key: "current", label: "Current Post", element: data.employee_role
        ? <CurrentPost employee_role={data.employee_role} />
        : <div>No role information available</div>
    },


    {
      key: "olPost", label: "Old post", element: (data && data.employee_role_old &&  data.employee_role_old.length!=0)
        ? (data.employee_role_old.map(ero => <CurrentPost employee_role={ero} />))
        : <div>No role information available</div>,
    },




    {
      key: "futurePost",
      label: "Future post",
      element: data.employee_role_future
        ? <CurrentPost employee_role={data.employee_role_future} />
        : (
          <>
            <div className="d-flex justify-content-center">
              <p>No role information available</p>
             
            </div>
            <div className="d-flex justify-content-center">
           
              {id && Access(auth, 'HR') && (
                <Button onClick={() => navigate('/employee/form/role/' + id)}>
                  <div>{t("new role")}</div>
                </Button>
              )}
            </div>
            </>
          ),
    }
    
  ];

  const getData = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/profile/employee_role${id ? '/detail' : ''}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ id }),
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
      .catch(() => {
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

  return (
    <>
      <style jsx="true">{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #f8f9fa;
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
        <Row>

          <Col xl={12} lg={12}>
            <Tab.Container defaultActiveKey="current">
              <Card>
                <Card.Body>
                  <Nav variant="pills"
                    as="ul"
                    className="nav nav-pills nav-fill navtab-bg">
                    {tabs.map((tab) => (
                      <Nav.Item key={tab.key}>
                        <Nav.Link eventKey={tab.key} className="nav-link">
                          {tab.label}
                        </Nav.Link>
                      </Nav.Item>
                    ))}
                  </Nav>

                  <Tab.Content>
                    {tabs.map((tab) => (
                      <Tab.Pane eventKey={tab.key} key={tab.key}>
                        {tab.element}
                      </Tab.Pane>
                    ))}
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Post;
