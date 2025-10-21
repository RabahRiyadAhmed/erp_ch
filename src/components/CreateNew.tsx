import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import classNames from "classnames";

interface CreateNewProps {
  otherOptions: {
    id: number;
    label: string;
    icon: string;
    redirectTo?: string; // Ajout de la redirection optionnelle
  }[];
}

const CreateNew = ({ otherOptions }: CreateNewProps) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        id="dropdown-notification"
        as="a"
        onClick={toggleDropdown}
        className={classNames("nav-link waves-effect waves-light", {
          show: dropdownOpen,
        })}
      >
        Create New <i className="mdi mdi-chevron-down"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu">
        <div onClick={toggleDropdown}>
          {(otherOptions || []).map((item, index) => (
            <React.Fragment key={index}>
              {index === otherOptions.length - 1 && (
                <div className="dropdown-divider"></div>
              )}
              <Link
                key={index}
                to={item.redirectTo || "#"}
                className="dropdown-item"
                onClick={() => {
                  console.log(`${item.label} clicked`);
                  toggleDropdown(); // Fermer le menu après clic
                }}
              >
                <i className={classNames(item.icon, "me-1")}></i>
                <span>{item.label}</span>
              </Link>
            </React.Fragment>
          ))}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CreateNew;
