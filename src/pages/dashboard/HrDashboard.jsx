import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { AuthContext } from "../../helpers/AuthContext";
import {  useSelector } from 'react-redux';
import { login,logout,updateToken } from '../../redux/authSlice';
import { Navigate, Link, useNavigate, useParams } from "react-router-dom";
import moment from 'moment'
import Spinner from "../../components/Spinner";
import { useTranslation } from "react-i18next";
import Chart from "react-apexcharts";
import { Card } from "react-bootstrap";
import BarChart from "./BarChart";
import RevenueChart from "./RevenueChart";
import DonutChart from "./DonutChart";
import EmployeeWidget from "./EmployeeWidget";
import StatisticsWidget from "../../components/StatisticsWidget";
import StatisticsWidget4 from "../../components/StatisticsWidget4";
const HrDashBoard = () => {
  const auth = useSelector((state) => state.Auth);
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { t } = useTranslation();
  const getData = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/data/dashboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({}),
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
    if(auth){
        getData();
    }
    console.log(auth)
  
  }, [auth]);

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
          <h4 className="page-title">dashboard</h4>
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
        <>
        
         {/**  <Row>
            <Col md={6} xl={3}>
              <StatisticsWidget
                variant="primary"
               
                description="Total employee"
                stats={data || data.total_employee}
                icon="fe-heart"
              />
            </Col>
            <Col md={6} xl={3}>
              <StatisticsWidget
                variant="success"
                description="Total active employee"
                stats={data || data.active_employee  }
                icon="fe-shopping-cart"
              />
            </Col>
            <Col md={6} xl={3}>
              <StatisticsWidget
                variant="info"
                description="Conversion"
                stats="0.58"
                counterOptions={{
                  suffix: "%",
                  decimals: 2,
                }}
                icon="fe-bar-chart-line-"
              />
            </Col>
            <Col md={6} xl={3}>
              <StatisticsWidget
                variant="warning"
                description="Today's Visits"
                stats="78412"
                icon="fe-eye"
              />
            </Col>
          </Row>*/}

<Row>
            <Col xl={6}>
              <RevenueChart locationData={data ? data.location : []} />
            </Col>
            <Col xl={6}>
              <BarChart departementActivity={data ? data.departmentActivity : []} />
            </Col>
          </Row>



          <Row>
            <Col xl={6}>
              {data && data.newRecruits.length != 0 && (
                <>
                  <h3>New Recruit</h3>
                  <Row>
                    {data.newRecruits.map((exdata) => (
                      <EmployeeWidget content={exdata} />
                    ))}
                  </Row>
                </>
              )}
              {data && data.newRecruits.length == 0 && (
                <>
                  <h3>New Recruit</h3>
                  <Col md={12} xl={6}>
                    <Card className="widget-rounded-circle">
                      <Card.Body>
                      <h5 className="mb-1 mt-2 font-16">No new recruits at the moment.</h5>
                      </Card.Body>
                    </Card>

                  </Col>
                </>
              )}

            </Col>
            <Col xl={6}>
              {data && data.exit_employee.length != 0 && (
                <>
                  <h3>exit employee</h3>
                  <Row>
                    {data.exit_employee.map((exdata) => (
                      <EmployeeWidget content={exdata} />
                    ))}
                  </Row>
                </>
              )}
              {data && data.exit_employee.length == 0 && (
                <>
                  <h3>exit employee</h3>
                  <Col md={12} xl={6}>
                    <Card className="widget-rounded-circle">
                      <Card.Body>
                      <h5 className="mb-1 mt-2 font-16">No employees have recently left.</h5>
                      </Card.Body>
                    </Card>

                  </Col>
                </>
              )}
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              {data && data.newRecruits.length != 0 && (
                <>
                  <h3>New Recruit</h3>
                  <Row>
                    {data.newRecruits.map((exdata) => (
                      <EmployeeWidget content={exdata} />
                    ))}
                  </Row>
                </>
              )}
              {data && data.newRecruits.length == 0 && (
                <>
                  <h3>New Recruit</h3>
                  <Col md={12} xl={6}>
                    <Card className="widget-rounded-circle">
                      <Card.Body>
                      <h5 className="mb-1 mt-2 font-16">No new recruits at the moment.</h5>
                      </Card.Body>
                    </Card>

                  </Col>
                </>
              )}

            </Col>
            <Col xl={6}>
              {data && data.exit_employee.length != 0 && (
                <>
                  <h3>exit employee</h3>
                  <Row>
                    {data.exit_employee.map((exdata) => (
                      <EmployeeWidget content={exdata} />
                    ))}
                  </Row>
                </>
              )}
              {data && data.exit_employee.length == 0 && (
                <>
                  <h3>exit employee</h3>
                  <Col md={12} xl={6}>
                    <Card className="widget-rounded-circle">
                      <Card.Body>
                      <h5 className="mb-1 mt-2 font-16">No employees have recently left.</h5>
                      </Card.Body>
                    </Card>

                  </Col>
                </>
              )}
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              {data && data.probationEndingSoon.length != 0 && (
                <>
                  <h3>Peobation end</h3>
                  <Row>
                    {data.probationEndingSoon.map((exdata) => (
                      <EmployeeWidget content={exdata} />
                    ))}
                  </Row>
                </>
              )}
              {data && data.probationEndingSoon.length == 0 && (
                <>
                  <h3>Peobation end</h3>
                  <Col md={12} xl={6}>
                    <Card className="widget-rounded-circle">
                      <Card.Body>
                      <h5 className="mb-1 mt-2 font-16">No probation periods ending soon.</h5>
                      </Card.Body>
                    </Card>

                  </Col>
                </>
              )}
            </Col>
            
<Col xl={6}>
              {data && data.expiringContracts.length != 0 && (
                <>
                  <h3>expiring contract</h3>
                  <Row>
                    {data.expiringContracts.map((exdata) => (
                      <EmployeeWidget content={exdata} />
                    ))}
                  </Row>
                </>
              )}
              {data && data.expiringContracts.length == 0 && (
                <>
                  <h3>Probation end</h3>
                  <Col md={12} xl={6}>
                    <Card className="widget-rounded-circle">
                      <Card.Body>
                      <h5 className="mb-1 mt-2 font-16">No contracts expiring soon.</h5>
                      </Card.Body>
                    </Card>

                  </Col>
                </>
              )}
            </Col>
          </Row>
          <Row>
            <Col xl={6}>

              <DonutChart data={data ? data.employeeStatus : []} title="Employee Status Distribution" />
            </Col>
           
          </Row>
          {/*
        

         
          



         
      */}
        </>
      )}

    </>
  );
};

export default HrDashBoard;
