import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Form, InputGroup, Button } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import moment from "moment"

import EmployeeSearchSelect from "../../../components/erp/EmployeeSearchSelect";
import Spinner from "../../../components/Spinner";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../helpers/AuthContext";
// styles
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// components
import PageTitle from "../../../components/PageTitle";
import FileUploader from "../../../components/FileUploader";
import { FormInput } from "../../../components/";




import currencies_file from '../../../assets/static/currencies.json'


const FormValidation = () => {
  const customStyles = {
    control: (base) => ({
      ...base,
      width: "100%", // pour prendre toute la largeur du parent
    }),
    menu: (base) => ({
      ...base,
      fontSize: "16px", // Augmenter la taille de la police pour rendre les options plus lisibles
      width: "auto", // Laisser le menu ajuster sa largeur selon le contenu
      minWidth: "200px", // Largeur minimale pour le menu
    }),
    option: (base) => ({
      ...base,
      fontSize: "16px", // Taille de police plus grande pour chaque option
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999, // Assurez-vous que le menu reste au-dessus des autres éléments
    }),
  };

  const currenciesOptions = Object.entries(currencies_file).map(([code, name]) => ({
    value: code,
    label: `${name}`,
  }));

  const { employee_id,id } = useParams();
  const defaultBody = id ? { id: employee_id } : null
  const [currencyOptions, setCurrencyOptions] = useState([{ label: "Devises", options: currenciesOptions }]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { auth, logout, updateToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [loading2, setLoading2] = useState(false)
  const [error2, setError2] = useState(null)

  const [roles, setRoles] = useState([])
  const [depatements, setDepatements] = useState([])
  const [divisions, setDivisions] = useState([])
  const [locations, setLocations] = useState([])
  const [currency, setCurrency] = useState()
  const [defaultEmployee, setDefaultEmployee] = useState(null)

  const [formState, setFormState] = useState({
    
    payment_type: '',
    payment_rate: null,
    currency: 'DZD',
    employment_status: '',
    supervisor_id: null,
    role_id: null,
    role_start_date: null,
    role_end_date: null,
    probation_period: 0,
    contract_id:null,
    division_id: null,
    location_id: null,
    department_id: null,

  });

  const [fieldStatus, setFieldStatus] = useState({

   
    payment_type: "neutral",
    payment_rate: "neutral",
    currency: "neutral",
    employment_status: "neutral",
    supervisor_id: "neutral",
    role_id: "neutral",
    role_start_date: "neutral",
    role_end_date: "neutral",
    probation_period: "neutral",
    contract_path: "neutral",
    division_id: "neutral",
    location_id: "neutral",
    department_id: "neutral",
  });

  const [emailError, setEmailError] = useState("");

  



  const validateField = (name, value) => {

    console.log(name)
    console.log(value)

    if (!value && name !== "supervisor_id"  && name !== "probation_period") return "invalid"; // Field is empty
   
    if (name === "department_id" && !value) return "invalid";
    if (name === "nationality" && value=='') return "invalid";
   
    if (name === "birth_date" && !value) return "invalid";
    if (name === "payment_rate" && !value) return "invalid";
    return "neutral"; // No error
  };

  /**
   * Handles form submission.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    let isValid = true;
    const newFieldStatus = { ...fieldStatus };

    // Local validation
    for (const field in formState) {
      newFieldStatus[field] = validateField(field, formState[field]);
      if (newFieldStatus[field] === "invalid") isValid = false;
    }
    console.log(formState)
    console.log(newFieldStatus)
    setFieldStatus(newFieldStatus);

    // Stop here if local validation fails
    if (!isValid) {
      return;
    }
    /*const formData = new FormData();
    formData.append('employee_id', employee_id);
    if (id) {
      formData.append('id', id);
    }
    
    formData.append('payment_type', formState.payment_type);
    formData.append('payment_rate', formState.payment_rate || 0);
    formData.append('currency', formState.currency);
    formData.append('employment_status', formState.employment_status);
    if (formState.supervisor_id) {
      formData.append('supervisor_id', formState.supervisor_id);
    }
    formData.append('probation_period', formState.probation_period);

    formData.append('role_id', formState.role_id);


    



    formData.append('role_start_date', formState.role_start_date ? moment(formState.role_start_date.toISOString()).format('YYYY-MM-DD') : '');
    formData.append('role_end_date', formState.role_end_date ? moment(formState.role_end_date.toISOString()).format('YYYY-MM-DD') : '');
    if (formState.contract_path) {
      formData.append('contract_path', formState.contract_path); // Gérer les fichiers pour contract_path
    }
    formData.append('division_id', formState.division_id);
    formData.append('location_id', formState.location_id);
    formData.append('department_id', formState.department_id);*/

    const data = {
      
      employee_id:employee_id,
      role_id: formState.role_id,
      marital_status: formState.marital_status,
      payment_type: formState.payment_type,
      payment_rate: formState.payment_rate,
      currency: formState.currency,
      employment_status: formState.employment_status,
      probation_period: formState.probation_period,
      contract_id:formState.contract_id,
      action:'update',
      employee_role_id:id,
      role_start_date: formState.role_start_date ? moment(formState.role_start_date.toISOString()).format('YYYY-MM-DD') : null,
      role_end_date:  formState.role_end_date ? moment(formState.role_end_date.toISOString()).format('YYYY-MM-DD') : null,
      department_id: formState.department_id,
      division_id: formState.division_id,
      location_id: formState.location_id,
      supervisor_id : formState.supervisor_id ? formState.supervisor_id :null,
  }
 
    setLoading2(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/employee/role/form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          console.log(res)
          navigate('/employee/pending/detail/' + res.data.employee_waiting.id)

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
    /* const isEmailTaken = await checkEmailInDatabase(formState.email);
     if (isEmailTaken) {
       setEmailError("This email is already in use.");
       setFieldStatus((prev) => ({
         ...prev,
         email: "invalid",
       }));
       return; // Stop here if email exists
     } else {
       setEmailError("");
     }
 
     // If everything is valid, submit the form
     alert("Form submitted successfully!");*/
  };

  /**
   * Updates fields and resets errors if necessary.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormState((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Reset local errors
    setFieldStatus((prev) => ({
      ...prev,
      [name]: "neutral",
    }));

    if (name === "email") {
      setEmailError("");
    }

  };

  /**
   * Determines the CSS class for a field.
   */
  const getInputClass = (status) => {
    if (status === "invalid") return "is-invalid";
    return ""; // Neutral or valid
  };

  const handleImageCropped = (image) => {
    setFormState({ ...formState, image: image })
  };
  /********************************************************************* */
  const getData = () => {
    setLoading(true);

      fetch(`${process.env.REACT_APP_API_URL}/api/employee/role/detail3`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ id:id,employee_id:employee_id })
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status) {
            setFormState({
              payment_type: res.data.employee_waiting.payment_type,
              payment_rate: res.data.employee_waiting.payment_rate,
              currency: res.data.employee_waiting.currency,
              employment_status: res.data.employee_waiting.employment_status,
              supervisor_id: res.data.employee_waiting.supervisor_id,
              role_id: res.data.employee_waiting.role_id,
              role_start_date: new Date(res.data.employee_waiting.role_start_date),
              role_end_date: new Date(res.data.employee_waiting.role_end_date),
              probation_period: res.data.employee_waiting.probation_period,
              division_id: res.data.employee_waiting.division_id,
              location_id: res.data.employee_waiting.location_id,
              department_id: res.data.employee_waiting.department_id,

            })

            if (res.data.employee_waiting.supervisor) {
              setDefaultEmployee({
                id: res.data.employee_waiting.supervisor.id,
                label: res.data.employee_waiting.supervisor.first_name + ' ' + res.data.employee_waiting.supervisor.last_name,
                image: res.data.employee_waiting.supervisor.image
              })
            }

            setLocations(res.data.locations)
            setDepatements(res.data.departments)
            setDivisions(res.data.divisions)
            setRoles(res.data.roles)


          } else {
            if (res.message === "Token error") {
              logout();
            }
            setError(res.message || "System error");
          }
          if (res.token) {
            updateToken(res.token);
          }
        })
        .catch((error) => {
          console.error(error);
          setError("An unexpected error occurred.");
        })
        .finally(() => {
          setLoading(false);
        });
  

  };

  useEffect(() => {
    getData();
  }, []);





  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch("https://openexchangerates.org/api/currencies.json");
        const currencies = await response.json();

        // Transformer les devises en format compatible avec react-select
        const formattedOptions = Object.entries(currencies).map(([code, name]) => ({
          value: code,
          label: `${name}`,
        }));

        setCurrencyOptions([{ label: "Devises", options: formattedOptions }]);


        const defaultOption = formattedOptions.find((option) => option.value === formState.currency);

        setCurrency(defaultOption)
      } catch (error) {

        setCurrencyOptions([{ label: "Devises", options: currenciesOptions }])
        const defaultOption = currenciesOptions.find((option) => option.value === formState.currency);

        setCurrency(defaultOption)
        console.error("Erreur lors de la récupération des devises :", error);
      }
    };

    fetchCurrencies();
  }, []);
  const handleRetry = () => {
    setError("");

    getData();
  };
  /********************************************************************* */
  const handleNationality = (nationality) => {
    setFieldStatus({ ...fieldStatus, nationality: "neutral" })
    setFormState({ ...formState, nationality: nationality })
  };

  const handleCountry = (country) => {
    setFieldStatus({ ...fieldStatus, country: "neutral" })
    setFormState({ ...formState, country: country })
  };

  const handleBirthDate = (date) => {
    setFieldStatus({ ...fieldStatus, birth_date: "neutral" })
    setFormState({ ...formState, birth_date: date })
  };

  const handleRoleStartDate = (date) => {
    setFieldStatus({ ...fieldStatus, role_start_date: "neutral" })
    setFormState({ ...formState, role_start_date: date })
  };

  const handleRoleEndDate = (date) => {
    setFieldStatus({ ...fieldStatus, role_end_date: "neutral" })
    setFormState({ ...formState, role_end_date: date })
  };

  const handleMaritalStatus = (marital_status) => {
    setFieldStatus({ ...fieldStatus, marital_status: "neutral" })
    setFormState({ ...formState, marital_status: marital_status })
  };

  const handleEmploymentStatus = (employment_status) => {
    setFieldStatus({ ...fieldStatus, employment_status: "neutral" })
    setFormState({ ...formState, employment_status: employment_status })
  };


  const handlePaymentType = (payment_type) => {
    setFieldStatus({ ...fieldStatus, payment_type: "neutral" })
    setFormState({ ...formState, payment_type: payment_type })
  };

  const formatOptionLabel = ({ value, label }, { context }) => {
    return context === "menu" ? `${value} - ${label}` : value; // `menu` = liste ouverte, sinon affichage simple
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
          color:rgb(43, 118, 198);
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

      {!loading && !error && (
        <>
          <Form noValidate onSubmit={handleSubmit}>
            <Row>
              <Col>
                <div className="page-title-box">
                  <h4 className="page-title">New Employee</h4>
                </div>
              </Col>
            </Row>
          




            <Card>
              <Card.Body>
                <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                  Employee data
                </h5>

                <Row>
                  <Col lg={6}>

                    <Form.Group className="mb-3" controlId="validationEmploymentStatus">
                      <Form.Label>Payment type</Form.Label>
                      <select
                        className={`form-select ${getInputClass(fieldStatus.payment_type)}`}
                        value={formState.payment_type}
                        onChange={(e) => handlePaymentType(e.target.value)}
                        name="payment_type"
                      >
                        <option value="">Select option</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="bi_weekly">Bi-weekly</option>
                        <option value="daily">Daily</option>
                        <option value="hourly">Hourly</option>
                        <option value="project_based">Project-based</option>
                        <option value="commission">Commission</option>
                        <option value="milestone_based">Milestone-based</option>
                        <option value="advance">Advance</option>
                        <option value="one_time">One-time</option>



                      </select>
                      <Form.Control.Feedback type="invalid">
                        Please select a valid marital status.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>payment rate </Form.Label>
                      <InputGroup>
                        {/* Champ de prix */}

                        <Form.Control
                          type="number"
                          placeholder="payment rate"
                          name="payment_rate"
                          value={formState.payment_rate}
                          onChange={handleChange}
                          min={0}
                          className={getInputClass(fieldStatus.payment_rate)}
                          required
                        />

                        {/* Sélecteur de devise */}
                        <Select
                          className="react-select react-select-container w-25"
                          classNamePrefix="react-select"
                          options={currencyOptions}
                          value={currency}
                          onChange={option => {
                            setCurrency(option)
                            setFormState({ ...formState, currency: option.value })
                          }}
                          placeholder="Currency"
                          name="currency"
                          styles={customStyles}
                          menuPortalTarget={document.body}
                          formatOptionLabel={formatOptionLabel}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please select a valid payment_rate.
                        </Form.Control.Feedback>
                      </InputGroup>
                      {/* Affichage d'erreurs */}

                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="validationEmploymentStatus">
                      <Form.Label>employment status</Form.Label>
                      <select
                        className={`form-select ${getInputClass(fieldStatus.employment_status)}`}
                        value={formState.employment_status}
                        onChange={(e) => handleEmploymentStatus(e.target.value)}
                        name="marital_status"
                      >
                        <option value="">Select option</option>
                        <option value="full_time">Full-time</option>
                        <option value="part_time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="temporary">Temporary</option>
                        <option value="intern">Intern</option>
                        <option value="seasonal">Seasonal</option>
                        <option value="consultant">Consultant</option>
                        <option value="probation">Probation</option>
                        <option value="on_call">On-call</option>
                        <option value="remote">Remote</option>


                      </select>
                      <Form.Control.Feedback type="invalid">
                        Please select a valid marital status.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="validationFirstName">
                      <Form.Label>Probation period</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        placeholder="probation period"
                        name="probation_period"
                        value={formState.probation_period}
                        onChange={handleChange}
                        className={getInputClass(fieldStatus.probation_period)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid probation period.
                      </Form.Control.Feedback>
                    </Form.Group>

                  </Col>




                </Row>


                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="validationRole">
                      <Form.Label>Role</Form.Label>
                      <select
                        className={`form-select ${getInputClass(fieldStatus.role_id)}`}
                        value={formState.role_id}
                        onChange={(e) => setFormState({ ...formState, role_id: e.target.value })}
                        name="role_id"
                      >
                        <option value="">Select option</option>
                        {roles && roles.length > 0 ? (
                          roles.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.role_name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>No role available</option>
                        )}
                      </select>
                      <Form.Control.Feedback type="invalid">
                        Please select a valid role.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="validationRoleStartDate">
                      <Form.Label>role_start_date</Form.Label>

                      <DatePicker
                        selected={formState.role_start_date}
                        onChange={(date) => handleRoleStartDate(date)}
                        dateFormat="yyyy-MM-dd"
                        showTimeInput
                        required
                        isClearable
                        name="role_start_date"
                        className={`form-control ${getInputClass(fieldStatus.role_start_date)}`} // Appliquer la classe CSS basée sur l'état
                        placeholderText="Select date"
                      />

                      {fieldStatus.role_start_date === "invalid" && (
                        <div >
                          Please select a valid date.
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="validationBirth_date">
                      <Form.Label>role_end_date</Form.Label>

                      <DatePicker
                        selected={formState.role_end_date}
                        onChange={(date) => handleRoleEndDate(date)}
                        dateFormat="yyyy-MM-dd"
                        showTimeInput
                        required
                        isClearable
                        name="role_end_date"
                        className={`form-control ${getInputClass(fieldStatus.role_end_date)}`} // Appliquer la classe CSS basée sur l'état
                        placeholderText="Select date"
                      />

                      {fieldStatus.role_end_date === "invalid" && (
                        <div >
                          Please select a valid date.
                        </div>
                      )}
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="validationBirth_date">
                      <Form.Label>supperieur</Form.Label>
                      <EmployeeSearchSelect
                        value={formState.supervisor_id}
                        onChange={(emp) => setFormState({ ...formState, supervisor_id: emp })}
                        defaultEmployee={defaultEmployee}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="validationDivision">
                      <Form.Label>division</Form.Label>
                      <select
                        className={`form-select ${getInputClass(fieldStatus.division_id)}`}
                        value={formState.division_id}
                        onChange={(e) => setFormState({ ...formState, division_id: e.target.value })}
                        name="division_id"
                      >
                        <option value="">Select option</option>
                        {divisions && divisions.length > 0 ? (
                          divisions.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.division_name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>No diviion available</option>
                        )}
                      </select>
                      <Form.Control.Feedback type="invalid">
                        Please select a valid divion.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="validationDepartment">
                      <Form.Label>Department</Form.Label>
                      <select
                        className={`form-select ${getInputClass(fieldStatus.department_id)}`}
                        value={formState.department_id}
                        onChange={(e) => setFormState({ ...formState, department_id: e.target.value })}
                        name="department_id"
                      >
                        <option value="">Select option</option>
                        {depatements && depatements.length > 0 ? (
                          depatements.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.department_name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>No departments available</option>
                        )}
                      </select>
                      <Form.Control.Feedback type="invalid">
                        Please select a valid department.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="validationlocation">
                      <Form.Label>Location</Form.Label>
                      <select
                        className={`form-select ${getInputClass(fieldStatus.location_id)}`}
                        value={formState.location_id}
                        onChange={(e) => setFormState({ ...formState, location_id: e.target.value })}
                        name="location_id"
                      >
                        <option value="">Select option</option>
                        {locations && locations.length > 0 ? (
                          locations.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>No location available</option>
                        )}
                      </select>
                      <Form.Control.Feedback type="invalid">
                        Please select a valid location.
                      </Form.Control.Feedback>
                    </Form.Group>



                  </Col>
                </Row>





                {!loading2 && error2 && (
                  <div className="error-container">
                    <p>{error2}</p>

                  </div>
                )}









                <Button type="submit"> {loading2 ? <div>{t("loading")}<Spinner color="white" size="sm" /></div> : t("send")}</Button>

              </Card.Body>
            </Card>
          </Form>
        </>
      )}
    </>
  );
};

export default FormValidation;
