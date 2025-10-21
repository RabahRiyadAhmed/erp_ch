import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../helpers/AuthContext";
import Select from 'react-select';

const EmployeeSearchSelect = ({ defaultEmployee, onChange }) => {
  console.log(defaultEmployee)
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { auth, logout, updateToken } = useContext(AuthContext);
  const [selectedEmployee, setSelectedEmployee] = useState(defaultEmployee || null); // Pré-remplir avec une valeur par défaut si elle est fournie

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
            updateToken(res.token);
          }
        } else {
          if (res.message === "Token error") {
            logout();
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

  const handleSelectChange = (selectedOption) => {
    setSelectedEmployee(selectedOption); // Met à jour la sélection locale
    onChange(selectedOption ? selectedOption.value : ''); // Appelle le parent avec l'ID sélectionné
  };

  const employeeOptions = employees.map((employee) => ({
    value: employee.id,
    label: `${employee.first_name} ${employee.last_name}`,
    image: employee.image,
  }));

  const customSingleValue = ({ data }) => (
    <div className="d-flex align-items-center">
      <img
        src={data.image}
        alt={data.label} 
        style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 10 }}
      />
      {data.label} 
    </div>
  );

  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} className="d-flex align-items-center p-2">
        <img
          src={`${process.env.REACT_APP_API_URL}` + data.image}
          alt={data.label}
          style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 10 }}
        />
        {data.label}
      </div>
    );
  };

  return (
    <div className="mb-3">
      <Select
        inputId="employee-search"
        value={selectedEmployee} // Gérer la valeur sélectionnée (par défaut ou utilisateur)
        onChange={handleSelectChange}
        options={employeeOptions}
        placeholder="Select an employee"
        isClearable
        isSearchable
        loadingMessage={() => "Loading..."}
        noOptionsMessage={() => "No employees found"}
        onInputChange={(e) => setSearchTerm(e)}
        components={{ SingleValue: customSingleValue, Option: customOption }}
      />
      {loading && <div className="mt-2">Loading...</div>}
      {error && <div className="mt-2 text-danger">{error}</div>}
    </div>
  );
};

export default EmployeeSearchSelect;
