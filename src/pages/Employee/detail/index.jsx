import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Tab, Nav } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
// components
import Spinner from "../../../components/Spinner";
import UserBox from "../../ProfilePack/Profile/UserBox";
import Supervision from "../../ProfilePack/Profile/Supervision";
import PersonalInfo from "../../ProfilePack/Profile/PersonalInfo";
import Leave from "../../ProfilePack/Profile/Leave";
import Document from "../../ProfilePack/Profile/Document";
import Post from "../../ProfilePack/Profile/Post";
import { AuthContext } from "../../../helpers/AuthContext";

const Profile = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(true);
  const { auth, logout, updateToken } = useContext(AuthContext);
  const { id } = useParams();
  const tabs = [
    { key: "personel", label: "personel", element: <PersonalInfo personalDetails={data.employee} /> },
    {
      key: "Emploi", label: "Emploi", element: <Post id={id}/>
    },
    { key: "congee", label: "congee", element: <Leave id={id}/> },
    { key: "document", label: "Document" ,element:<Document id={id} />},
  ];

  const getData = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/profile/employee/detail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({id:id}),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {

          setData(res.data);
          console.log(data.employee)
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
          <Col xl={3} lg={3}>
            <UserBox data={data} />
            <Supervision supervises={data.supervises} supervisor={data.supervisor} />
          </Col>
          <Col xl={9} lg={9}>
            <Tab.Container defaultActiveKey="personel">
              <Card>
                <Card.Body>
                  <Nav variant="tabs" className="nav nav-pills flex-wrap">
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

export default Profile;
