import React, { useState, useEffect, memo } from 'react';
import { logout, updateToken } from '../../redux/authSlice';
import { useSelector, useDispatch } from "react-redux";
import Select, { components } from 'react-select';
import ImageFetch from "./ImageFetch";

const EmployeeSearchSelect = ({ defaultEmployee, onChange, isMulti = false, className, isValid }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const auth = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const savedState = localStorage.getItem('layoutState');
  const savedStateParse = savedState ? JSON.parse(savedState) : null;
  const isDarkMode = savedStateParse && savedStateParse.layoutColor === 'dark';

  // Fonction pour charger les employés
  const loadEmployees = async (term) => {
    if (term.length >= 3) {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employee/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({ term: term, limit: 10 }),
        });

        const res = await response.json();

        if (res.status) {
          setEmployees(res.data.employees);
          if (res.token) {
            dispatch(updateToken(res.token));
          }
        } else {
          if (res.message === "Token error") {
            dispatch(logout());
          }
          setError(res.message || "System error");
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    } else {
      setEmployees([]);
    }
  };

  useEffect(() => {
    if (searchTerm.length >= 3) {
      loadEmployees(searchTerm);
    } else {
      setEmployees([]);
    }
  }, [searchTerm]);

  // Vérification et mise en place de la valeur par défaut (single ou multi)
  useEffect(() => {
    if (defaultEmployee) {
      if (Array.isArray(defaultEmployee)) {
        // Cas multi-sélection : formater le tableau d'employés
        const formattedDefaultEmployees = defaultEmployee.map((employee) => ({
          value: employee.id,
          label: `${employee.first_name} ${employee.last_name}`,
          image: employee.image,
        }));
        setSelectedEmployee(formattedDefaultEmployees);
      } else {
        // Cas unique : formater l'objet employé
        const formattedDefaultEmployee = {
          value: defaultEmployee.id,
          label: `${defaultEmployee.label}`,
          image: defaultEmployee.image,
        };
        setSelectedEmployee(formattedDefaultEmployee);
      }
    }
  }, [defaultEmployee]);

  const handleSelectChange = (selectedOption) => {
    if (isMulti) {
      setSelectedEmployee(selectedOption);
      onChange(selectedOption ? selectedOption.map(option => option.value) : []);
    } else {
      setSelectedEmployee(selectedOption);
      onChange(selectedOption ? selectedOption.value : '');
    }
  };

  const employeeOptions = employees.map((employee) => ({
    value: employee.id,
    label: `${employee.first_name} ${employee.last_name}`,
    image: employee.image,
  }));

  // Composants personnalisés mémorisés
  const CustomSingleValue = memo(({ data }) => (
    <div className="d-flex align-items-center">
      <ImageFetch
        image={'/api/file/employee/profile/image'}
        defaulBody={{ id: data.value }}
        className="rounded-circle"
        alt={data.first_name + ' ' + data.last_name}
        width={30}
        height={30}
      />
      {data.label}
    </div>
  ));

  const CustomOption = memo((props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} className="d-flex align-items-center p-2">
        <ImageFetch
          image={'/api/file/employee/profile/image'}
          defaulBody={{ id: data.value }}
          className="rounded-circle"
          alt={data.label}
          width={30}
          height={30}
        />
        {data.label}
      </div>
    );
  });

  const CustomMultiValue = memo(({ data, removeProps }) => (
    <div className="d-flex align-items-center" style={{ border: '1px solid #ccc', borderRadius: '20px', padding: '5px 10px', margin: '5px', backgroundColor: isDarkMode ? '#333' : '#f7f7f7' }}>
      <ImageFetch
        image={'/api/file/employee/profile/image'}
        defaulBody={{ id: data.value }}
        className="rounded-circle"
        alt={data.first_name + ' ' + data.last_name}
        width={30}
        height={30}
      />
      {data.label}
      <span {...removeProps} className="ml-2 cursor-pointer" style={{ marginLeft: '10px', color: '#999' }}>
        <i className="fa fa-times" style={{ fontSize: '12px' }}></i>
      </span>
    </div>
  ));

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: isDarkMode ? '#36404A' : '#fff',
      borderColor: isValid ? "#F1556C" : base.borderColor,
      color: isDarkMode ? '#fff' : '#36404A',
      "&:hover": {
        borderColor: isValid ? "#F1556C" : base.borderColor,
      },
    }),
    input: (base) => ({
      ...base,
      color: isDarkMode ? '#fff' : '#36404A', // Texte tapé en blanc en mode sombre
    }),
    placeholder: (base) => ({
      ...base,
      color: isDarkMode ? '#fff' : '#36404A', // Placeholder blanc en mode sombre
    }),
    singleValue: (base) => ({
      ...base,
      color: isDarkMode ? '#fff' : '#36404A', // Texte sélectionné en blanc en mode sombre
    }),
    option: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? '#36404A' : '#fff',
      color: isDarkMode ? '#fff' : '#36404A',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? '#36404A' : '#f7f7f7',
      color: isDarkMode ? '#fff' : '#36404A',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? '#333' : '#fff', // Fond du menu déroulant
      borderColor: isDarkMode ? '#555' : '#ccc', // Bordure du menu
    }),
  };

  return (
    <div className="mb-3">
      <Select
        inputId="employee-search"
        value={selectedEmployee}
        onChange={handleSelectChange}
        options={employeeOptions}
        placeholder="Search employees..."
        isClearable
        isSearchable
        isMulti={isMulti}
        loadingMessage={() => "Loading..."}
        noOptionsMessage={() => "No employees found"}
        onInputChange={(e) => setSearchTerm(e)}
        components={{
          SingleValue: CustomSingleValue,
          Option: CustomOption,
          MultiValue: CustomMultiValue,
        }}
        styles={customStyles}
        className={className}
      />
      {loading && <div className="mt-2">Loading...</div>}
      {error && <div className="mt-2 text-danger">{error}</div>}

      {isValid && (
        <div style={{ fontSize: "0.875em", marginTop: "0.25rem", color: '#f1556c' }}>
          Please select a valid option.
        </div>
      )}
    </div>
  );
};

export default EmployeeSearchSelect;