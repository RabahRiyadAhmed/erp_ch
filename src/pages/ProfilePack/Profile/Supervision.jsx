import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageFetch from "../../../components/erp/ImageFetch";
const Supervision = ({ supervises, supervisor }) => {
  return (
    <Card>
      <Card.Body>
        <h4 className="header-title mb-3">Supervisor</h4>
        <div>
          {supervisor ? ( // Vérifie si `supervisor` existe
            <div key={"supervisor"} className="d-flex align-items-center mb-3">
              <div className="inbox-item-img me-3">
              <ImageFetch 
              

              image={'/api/file/employee/profile/image'}
             defaulBody={{id:supervisor.id}}
              className="rounded-circle"
              alt={`${supervisor.first_name} ${supervisor.last_name}`}
              width={50}
              height={50}
              
              />

                
              </div>
              <div>
                <p className="inbox-item-author mb-1">
                  {supervisor.first_name} {supervisor.last_name}
                </p>
                <p className="inbox-item-text mb-1">
                  {supervisor.EmployeeRoles[0]?.Role.role_name || "No Role"}
                </p>
              </div>
            </div>
          ) : (
            <p>No supervisor assigned</p> // Message si `supervisor` est null
          )}
        </div>

        <h4 className="header-title mb-3">Supervise</h4>
        <div>
          {supervises && supervises.length > 0 ? ( // Vérifie si `supervises` existe et n'est pas vide
            supervises.map((supervise, index) => (
              <div key={index} className="d-flex align-items-center mb-3">
                <div className="inbox-item-img me-3">
                <ImageFetch 
             image={'/api/file/employee/profile/image'}
             defaulBody={{id:supervise.id}}
            className="rounded-circle"
            alt={`${supervise.first_name} ${supervise.last_name}`}
            width={50}
            height={50}
              
              />
                  
                </div>
                <div>
                  <p className="inbox-item-author mb-1">
                    {supervise.first_name} {supervise.last_name}
                  </p>
                  <p className="inbox-item-text mb-1">
                    {supervise.EmployeeRoles[0]?.Role.role_name || "No Role"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No supervised employees</p> // Message si `supervises` est vide ou null
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Supervision;
