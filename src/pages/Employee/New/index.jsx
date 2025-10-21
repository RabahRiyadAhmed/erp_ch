import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Form, InputGroup, Button } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { Editor } from "react-draft-wysiwyg";
import DatePicker from "react-datepicker";
import classNames from "classnames";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment"
import ImageCropper from '../../../components/erp/ImageCropper';
import CountrySelect from '../../../components/erp/CountrySelect';
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


  const savedState = localStorage.getItem('layoutState');
  const savedStateParse = savedState ? JSON.parse(savedState) : null;
  const isDarkMode = savedStateParse && savedStateParse.layoutColor === 'dark';


  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? '#36404A' : '#fff', // Fond du select en mode sombre
      color: isDarkMode ? '#fff' : '#333', // Texte en mode sombre
     
      width: "100%", // pour prendre toute la largeur du parent
    }),
    input: (base) => ({
      ...base,
      color: isDarkMode ? '#fff' : '#333', // Texte tapé en blanc en mode sombre
    }),
    placeholder: (base) => ({
      ...base,
      color: isDarkMode ? '#fff' : '#999', // Placeholder blanc en mode sombre
    }),
    singleValue: (base) => ({
      ...base,
      color: isDarkMode ? '#fff' : '#333', // Texte sélectionné en blanc en mode sombre
    }),
    menu: (base) => ({
      ...base,
      fontSize: "16px", // Augmenter la taille de la police pour rendre les options plus lisibles
      width: "auto", // Laisser le menu ajuster sa largeur selon le contenu
      minWidth: "200px", // Largeur minimale pour le menu
      backgroundColor: isDarkMode ? '#333' : '#fff', // Fond du menu déroulant
      borderColor: isDarkMode ? '#555' : '#ccc', // Bordure du menu
    }),
    option: (base) => ({
      ...base,
     
      color: isDarkMode ? '#fff' : '#333',
      "&:hover": {
        backgroundColor: isDarkMode ? '#36404A' : '#f7f7f7',
        color: isDarkMode ? '#fff' : '#333',
      },
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


  
  const { id } = useParams();
  const defaultBody = id ? { id: id } : null
  const [currencyOptions, setCurrencyOptions] = useState([{ label: "Devises", options: currenciesOptions }]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { auth, logout, updateToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [loading2, setLoading2] = useState(false)
  const [error2, setError2] = useState(null)

  const [roles, setRoles] = useState([])
  const [departments, setDepartments] = useState([])
  const [divisions, setDivisions] = useState([])
  const [locations, setLocations] = useState([])
  const [currency, setCurrency] = useState()
  const [defaultEmployee, setDefaultEmployee] = useState(null)

  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    bio: '',
    image: null,
    nationality: '',
    birth_date: null,
    birth_place:'',
    gender: null,
    marital_status: '',
    social_security_number: null,
    identification_number: null,
    payment_type: '',
    payment_rate: null,
    currency: 'DZD',
    employment_status: '',
    supervisor_id: null,
    role_id: null,
    role_start_date: null,
    role_end_date: null,
    probation_period: 0,
    country: null,
    postal_code: null,
    street: null,
    city: null,
    region: null,
    division_id: null,
    location_id: null,
    department_id: null,

  });

  const [fieldStatus, setFieldStatus] = useState({

    first_name: "neutral",
    last_name: "neutral",
    email: "neutral",
    phone: "neutral",
    bio: "neutral",
    image: "neutral",
    nationality: "neutral",
    birth_date: "neutral",
    birth_place:"neutral",
    gender: "neutral",
    marital_status: "neutral",
    social_security_number: "neutral",
    identification_number: "neutral",
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
    country: "neutral",
    postal_code: "neutral",
    street: "neutral",
    city: "neutral",
    region: "neutral",
    division_id: "neutral",
    location_id: "neutral",
    department_id: "neutral",
  });

  const [emailError, setEmailError] = useState("");

  /**
   * Simulates server-side validation for the email.
   */
  const checkEmailInDatabase = async (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('****------------------')
        const existingEmails = ["test@example.com", "user@example.com"];
        resolve(existingEmails.includes(email));
      }, 1);
    });
  };

  /**
   * Validates a field locally (empty or incorrect format).
   */



  const validateField = (name, value) => {

    console.log(name)
    console.log(value)

    if (!value && name !== 'bio' && name !== 'image' && name !== "contrat" && name !== "supervisor_id") return "invalid"; // Field is empty
    if (name === "email" && !/\S+@\S+\.\S+/.test(value)) return "invalid"; // Invalid email
    if (name === "department_id" && !value) return "invalid";
    if (name === "nationality" && value=='') return "invalid";
    if (name === "country" && value==null) return "invalid";
    if (name === "gender" && !value) return "invalid";
    if (name === "birth_date" && !value) return "invalid";
    if (name === "birth_place" && value=='') return "invalid";
    
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
    const formData = new FormData();
    if (id) {
      formData.append('id', id);
    }
    formData.append('first_name', formState.first_name);
    formData.append('last_name', formState.last_name);
    formData.append('email', formState.email);
    formData.append('phone', formState.phone);
    formData.append('bio', formState.bio || ''); // Par défaut, chaîne vide si non défini
    if (formState.image) {
      formData.append('image', formState.image); // Gérer le fichier image
    }
    formData.append('nationality', formState.nationality);
    formData.append('birth_place', formState.birth_place);
    
    formData.append('birth_date', formState.birth_date ? moment(formState.birth_date.toISOString()).format('YYYY-MM-DD') : ''); // Convertir en format ISO si nécessaire
    formData.append('gender', formState.gender || '');
    formData.append('marital_status', formState.marital_status || '');
    formData.append('social_security_number', formState.social_security_number || '');
    formData.append('identification_number', formState.identification_number || '');
    formData.append('payment_type', formState.payment_type);
    formData.append('payment_rate', formState.payment_rate || 0);
    formData.append('currency', formState.currency);
    formData.append('employment_status', formState.employment_status);
    if (formState.supervisor_id) {
      formData.append('supervisor_id', formState.supervisor_id);
    }
    formData.append('probation_period', formState.probation_period);

    formData.append('role_id', formState.role_id);


    formData.append('country', formState.country);
    formData.append('postal_code', formState.postal_code);
    formData.append('street', formState.street);
    formData.append('city', formState.city);
    formData.append('region', formState.region);



    formData.append('role_start_date', formState.role_start_date ? moment(formState.role_start_date.toISOString()).format('YYYY-MM-DD') : '');
    formData.append('role_end_date', formState.role_end_date ? moment(formState.role_end_date.toISOString()).format('YYYY-MM-DD') : '');
    if (formState.contract_path) {
      formData.append('contract_path', formState.contract_path); // Gérer les fichiers pour contract_path
    }
    formData.append('division_id', formState.division_id);
    formData.append('location_id', formState.location_id);
    formData.append('department_id', formState.department_id);
    setLoading2(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/employee/temp`, {
      method: "POST",
      headers: {

        Authorization: `Bearer ${auth.token}`,
      },
      body: formData
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          console.log(res)
          navigate('/employee/waiting/detail/' + res.data.employee_waiting.id)

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
    if (id) {
      fetch(`${process.env.REACT_APP_API_URL}/api/employee/temp/detail2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ id })
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status) {
            setFormState({
              first_name: res.data.employee_waiting.first_name,
              last_name: res.data.employee_waiting.last_name,
              email: res.data.employee_waiting.email,
              phone: res.data.employee_waiting.phone,
              bio: res.data.employee_waiting.bio,
              image: process.env.REACT_APP_API_URL + '/api/file/employee/temp/profile/image',
              nationality: res.data.employee_waiting.nationality,
              birth_date: new Date(res.data.employee_waiting.birth_date),
              gender: res.data.employee_waiting.gender,
              marital_status: res.data.employee_waiting.marital_status,
              social_security_number: res.data.employee_waiting.social_security_number,
              identification_number: res.data.employee_waiting.identification_number,
              payment_type: res.data.employee_waiting.payment_type,
              payment_rate: res.data.employee_waiting.payment_rate,
              currency: res.data.employee_waiting.currency,
              employment_status: res.data.employee_waiting.employment_status,
              supervisor_id: res.data.employee_waiting.supervisor_id,
              role_id: res.data.employee_waiting.role_id,
              role_start_date: new Date(res.data.employee_waiting.role_start_date),
              role_end_date: new Date(res.data.employee_waiting.role_end_date),
              probation_period: res.data.employee_waiting.probation_period,
              country: res.data.employee_waiting.country,
              postal_code: res.data.employee_waiting.postal_code,
              street: res.data.employee_waiting.street,
              city: res.data.employee_waiting.city,
              region: res.data.employee_waiting.region,
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
            setDepartments(res.data.departments)
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
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/api/data/organisation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({})
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status) {

            setLocations(res.data.locations)
            setDepartments(res.data.departments)
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
    }

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
                  Personal information
                </h5>
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-3 text-center" controlId="validationImage">
                      <div className="d-flex justify-content-center align-items-center" >
                        <ImageCropper onImageCropped={handleImageCropped} aspectRatio={1} defaultImage={formState.image} defaultBody={defaultBody} token={auth.token} />
                      </div>

                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="validationEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        className={getInputClass(fieldStatus.email)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {emailError || "Please provide a valid email address."}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="validationPhone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        className={getInputClass(fieldStatus.phone)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid phone.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="validationPhone">
                      <Form.Label>bio</Form.Label>
                      <Form.Control
                        type="textarea"
                        placeholder="bio"
                        name="bio"
                        value={formState.bio}
                        onChange={handleChange}
                        as="textarea" rows={3}
                        className={getInputClass(fieldStatus.bio)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid phone.
                      </Form.Control.Feedback>
                    </Form.Group>


                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="validationFirstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="First Name"
                        name="first_name"
                        value={formState.first_name}
                        onChange={handleChange}
                        className={getInputClass(fieldStatus.first_name)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid first name.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="validationLastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Last Name"
                        name="last_name"
                        value={formState.last_name}
                        onChange={handleChange}
                        className={getInputClass(fieldStatus.last_name)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid last name.
                      </Form.Control.Feedback>
                    </Form.Group>



                    <Form.Group className="mb-3" controlId="validationNationality">
                      <Form.Label>Nationality</Form.Label>
                      <CountrySelect
                        onChange={handleNationality}
                        opValue={formState.nationality}
                        isInvalid={fieldStatus.nationality === "invalid"} // Vérification de la validité
                        isValid={fieldStatus.nationality === 'invalid'}
                        className={`${getInputClass(fieldStatus.nationality)}`}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select a valid nationality.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="validationMaritalStatus">
                      <Form.Label>Marital status</Form.Label>
                      <select
                        className={`form-select ${getInputClass(fieldStatus.marital_status)}`}
                        value={formState.marital_status}
                        onChange={(e) => handleMaritalStatus(e.target.value)}
                        name="marital_status"
                      >
                        <option value="">Select option</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                        <option value="separated">Separated</option>
                        <option value="engaged">Engaged</option>

                      </select>
                      <Form.Control.Feedback type="invalid">
                        Please select a valid marital status.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="validationBirth_date">
                      <Form.Label>Birth Date</Form.Label>

                      <DatePicker
                        selected={formState.birth_date}
                        onChange={(date) => handleBirthDate(date)}
                        dateFormat="yyyy-MM-dd"
                        showTimeInput
                        required
                        isClearable
                        maxDate={new Date().setFullYear(new Date().getFullYear() - 18)}
                        name="birth_date"
                        className={`form-control ${getInputClass(fieldStatus.birth_date)}`} // Appliquer la classe CSS basée sur l'état
                        placeholderText="Select date"
                      />

                      {fieldStatus.birth_date === "invalid" && (
                        <div >
                          Please select a valid date.
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="validationNIN">
                      <Form.Label>birth place</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="birth place"
                        name="birth_place"
                        value={formState.birth_place}
                        onChange={handleChange}
                        className={getInputClass(fieldStatus.birth_place)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid birth place.
                      </Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="validationNIN">
                      <Form.Label>Identification number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="identification number"
                        name="identification_number"
                        value={formState.identification_number}
                        onChange={handleChange}
                        className={getInputClass(fieldStatus.identification_number)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid identification number.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="validation">
                      <Form.Label>Social security number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="social security number"
                        name="social_security_number"
                        value={formState.social_security_number}
                        onChange={handleChange}
                        className={getInputClass(fieldStatus.social_security_number)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid social security number.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="validationGender">
                      <Form.Label>Gender</Form.Label>

                      <Form.Check
                        type="radio"
                        id="gender-man"
                        name="gender"
                        value="M"
                        label="Man"
                        onChange={handleChange}
                        checked={formState.gender === "M"}
                        className={getInputClass(fieldStatus.gender)}
                      />
                      <Form.Check
                        type="radio"
                        id="gender-woman"
                        name="gender"
                        value="F"
                        label="Woman"
                        onChange={handleChange}
                        checked={formState.gender === "F"}
                        className={getInputClass(fieldStatus.gender)}
                      />

                      <Form.Control.Feedback type="invalid">
                        Please select a valid gender.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>


                <Row>
                  <Col lg={6}>






                    <Form.Group className="mb-3" controlId="validationCountry">
                      <Form.Label>Country</Form.Label>
                      <CountrySelect
                        onChange={handleCountry}
                        opValue={formState.country}
                       
                        isValid={fieldStatus.country === 'invalid'}
                        className={`${getInputClass(fieldStatus.country)}`}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select a valid country.
                      </Form.Control.Feedback>
                    </Form.Group>

                  </Col>
                  <Col lg={6}>

                    <Form.Group className="mb-3" controlId="validationPostal_code">
                      <Form.Label>Postal code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="postal code"
                        name="postal_code"
                        value={formState.postal_code}
                        onChange={handleChange}
                        className={getInputClass(fieldStatus.postal_code)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid postal code.
                      </Form.Control.Feedback>
                    </Form.Group>



                  </Col>
                </Row>


                <Row>
                  <Col lg={4}>
                    <Form.Group className="mb-3" controlId="validationStreet">
                      <Form.Label>street</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Street"
                        name="street"
                        value={formState.street}
                        onChange={handleChange}
                        className={getInputClass(fieldStatus.street)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid street.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className="mb-3" controlId="validationCity">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="City"
                        name="city"
                        value={formState.city}
                        onChange={handleChange}
                        className={getInputClass(fieldStatus.city)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid city.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className="mb-3" controlId="validationRegion">
                      <Form.Label>region</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Region"
                        name="region"
                        value={formState.region}
                        onChange={handleChange}
                        className={getInputClass(fieldStatus.region)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid region.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

              </Card.Body>
            </Card>





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
                        {departments && departments.length > 0 ? (
                          departments.map((d) => (
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
