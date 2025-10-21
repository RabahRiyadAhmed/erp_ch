import { Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import getFile from "../../utils/getFile";
import { useNavigate } from "react-router-dom";
import moment from "moment"
import { useSelector, useDispatch } from "react-redux";
const EmployeeWidget = ({ content }) => {


const auth = useSelector((state ) => state.Auth);
const dispatch = useDispatch()
    const [imageUrl, setImageUrl] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth) {
            const url = `${process.env.REACT_APP_API_URL}/api/file/employee/profile/image`;
            getFile(url, auth.token, { id: content.id }).then(setImageUrl);
        }
    }, [auth]);

    const isAllowed = auth?.role === "HR"; // Vérifie si l'utilisateur a le rôle "HR"

    const handleCardClick = () => {
        if (isAllowed) {
            navigate(`/employee/details/${content.id}`);
        }
    };

    return (
        <Col md={12} xl={6}>
            <Card
                className={`widget-rounded-circle ${isAllowed ? "clickable" : ""}`} // Classe personnalisée si autorisé
                onClick={isAllowed ? handleCardClick : null} // N'exécute l'événement que si autorisé
                style={{ cursor: isAllowed ? "pointer" : "not-allowed" }} // Change le curseur selon les permissions
            >
                <Card.Body>
                    <div className="row align-items-center">
                        <div className="col-auto">
                            <div className="avatar-lg">
                                <img
                                    src={imageUrl ? imageUrl : "image/profile.jpg"}
                                    className="img-fluid rounded-circle"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="col">
                            <h5 className="mb-1 mt-2 font-16">
                                {content.first_name + " " + content.last_name}
                            </h5>
                            {content && content.lastRole && (
                                <p className="mb-2 text-muted">
                                    {content.lastRole}
                                </p>
                            )}

                            {content && content.EmployeeRoles.length != 0 && content.EmployeeRoles[0].Role && (
                                <p className="mb-2 text-muted">
                                    {content.EmployeeRoles[0].Role.role_name}
                                </p>
                            )}

                            {content && content.EmployeeRoles.length != 0 && content.EmployeeRoles[0].probation_end_date && (
                                <p className="mb-2 text-muted">
                                    {moment(content.EmployeeRoles[0].probation_end_date).format('YYYY-MM-DD')}
                                </p>)
                            }

                            {content && content.EmployeeRoles.length != 0 && content.EmployeeRoles[0].role_end_date && (
                                <p className="mb-2 text-muted">
                                    {moment(content.EmployeeRoles[0].role_end_date).format('YYYY-MM-DD')}
                                </p>)
                            }

                            {content && content.deletedAt && (
                                <p className="mb-2 text-muted">
                                    {moment(content.deletedAt).format('YYYY-MM-DD')}
                                </p>)
                            }

                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default EmployeeWidget;
