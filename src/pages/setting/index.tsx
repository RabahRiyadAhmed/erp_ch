import React, { Suspense } from "react";
import { Row, Col, Card, Tab, Nav } from "react-bootstrap";
import Spinner from "../../components/Spinner";

const DivisionStetting = React.lazy(() => import("./DivisionStetting"));
const DepartmetSetting = React.lazy(() => import("./DepartmetSetting"));
const LocationSetting = React.lazy(() => import("./LocationSetting"));
const Theme = React.lazy(() => import("./Theme"));
const Business = React.lazy(() => import("./Business"));
interface TabContentType {
  id: number;
  title: string;
  icon?: string;
  element: React.ReactNode;
}

const Settings = () => {
  const tabContents: TabContentType[] = [
    { id: 1, title: "theme",  element: (
      <Theme />
  ) },
    { id: 2, title: "generale",  element: (
      <Suspense fallback={<Spinner />}>
        <Business />
      </Suspense>
    ) },
    
    { id: 3, title: "system", element: <p>system</p> },
    { id: 5, title: "employee", element: <p>employee</p> },
    {
      id: 5,
      title: "divison",
      element: (
        <Suspense fallback={<Spinner />}>
          <DivisionStetting />
        </Suspense>
      ),
    },
    {
      id: 6,
      title: "department",
      element: (
        <Suspense fallback={<Spinner />}>
          <DepartmetSetting />
        </Suspense>
      ),
    },
    {
      id: 7,
      title: "localisation",
      element: (
        <Suspense fallback={<Spinner />}>
          <LocationSetting />
        </Suspense>
      ),
    },
    { id: 8, title: "help", element: <p>help</p> },
  ];

  return (
    <>
      <Row>
        <Col>
          <div className="page-title-box">
            <h4 className="page-title">Settings</h4>
          </div>
        </Col>
      </Row>

      <Tab.Container defaultActiveKey="theme">
        <Row className="g-0">
          <Col xl={2} lg={3}>
            <Card className="text-center m-0">
              <Card.Body className="p-0">
                <Nav as="ul" variant="pills" className="flex-column">
                  {tabContents.map((tab) => (
                    <Nav.Item as="li" key={tab.id}>
                      <Nav.Link
                        className="cursor-pointer w-100 text-start"
                        eventKey={tab.title}
                      >
                        {tab.title}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={10} lg={9}>
            <Card>
              <Card.Body>
                <Tab.Content>
                  {tabContents.map((tab) => (
                    <Tab.Pane eventKey={tab.title} id={String(tab.id)} key={tab.id}>
                      {tab.element}
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
};

export default Settings;
