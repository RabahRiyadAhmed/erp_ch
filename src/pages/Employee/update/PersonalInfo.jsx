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

  const { id } = useParams();
 
  const defaultBody = id ? { id: id } : null
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { auth, logout, updateToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [loading2, setLoading2] = useState(false)
  const [error2, setError2] = useState(null)


  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    bio: '',
    image: null,
    nationality: '',
    birth_date: null,
    gender: null,
    marital_status: '',
    social_security_number: null,
    identification_number: null,
    country: null,
    postal_code: null,
    street: null,
    city: null,
    region: null,
    no_emp: null,

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
    gender: "neutral",
    marital_status: "neutral",
    social_security_number: "neutral",
    identification_number: "neutral",
    country: "neutral",
    postal_code: "neutral",
    street: "neutral",
    city: "neutral",
    region: "neutral",


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

    if (!value && name !== 'bio' && name !== "contrat" && name !== "supervisor_id") return "invalid"; // Field is empty
    if (name === "email" && !/\S+@\S+\.\S+/.test(value)) return "invalid"; // Invalid email
    if (name === "department_id" && !value) return "invalid";
    if (name === "nationality" && value == '') return "invalid";
    if (name === "country" && value == null) return "invalid";
    if (name === "gender" && !value) return "invalid";
    if (name === "birth_date" && !value) return "invalid";

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

    formData.append('nationality', formState.nationality);
    formData.append('birth_date', formState.birth_date ? moment(formState.birth_date.toISOString()).format('YYYY-MM-DD') : ''); // Convertir en format ISO si nécessaire
    formData.append('gender', formState.gender || '');
    formData.append('marital_status', formState.marital_status || '');
    formData.append('social_security_number', formState.social_security_number || '');
    formData.append('identification_number', formState.identification_number || '');

    if (formState.image) {
      formData.append('image', formState.image); // Gérer le fichier image
    }

    formData.append('country', formState.country);
    formData.append('postal_code', formState.postal_code);
    formData.append('street', formState.street);
    formData.append('city', formState.city);
    formData.append('region', formState.region);


    if (formState.no_emp) {
      formData.append('no_emp', formState.no_emp); // Gérer le fichier image
    }


    setLoading2(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/employee/PersonalInfo/update`, {
      method: "PUT",
      headers: {

        Authorization: `Bearer ${auth.token}`,
      },
      body: formData
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          console.log(res)
          navigate('/employee/detail/' + id)

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
    fetch(`${process.env.REACT_APP_API_URL}/api/employee/personalInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ id: id })
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          console.log(res.data)
          setFormState({
            first_name: res.data.employee.first_name,
            last_name: res.data.employee.last_name,
            email: res.data.employee.email,
            phone: res.data.employee.phone,
            bio: res.data.employee.bio,
            image: process.env.REACT_APP_API_URL + '/api/file/employee/profile/image',
            nationality: res.data.employee.nationality,
            birth_date: new Date(res.data.employee.birth_date),
            gender: res.data.employee.gender,
            marital_status: res.data.employee.marital_status,
            social_security_number: res.data.employee.social_security_number,
            identification_number: res.data.employee.identification_number,
            country: res.data.employee.country,
            postal_code: res.data.employee.postal_code,
            street: res.data.employee.street,
            city: res.data.employee.city,
            region: res.data.employee.region,
            no_emp:res.data.no_emp

          })




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



  const handleMaritalStatus = (marital_status) => {
    setFieldStatus({ ...fieldStatus, marital_status: "neutral" })
    setFormState({ ...formState, marital_status: marital_status })
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
                  <h4 className="page-title">Update personnel info</h4>
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


                    <Form.Group className="mb-3" controlId="validationLastName">
                      <Form.Label>pointage id</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="no emp"
                        name="no_emp"
                        value={formState.no_emp}
                        onChange={handleChange}
                        className={getInputClass(fieldStatus.no_emp)}
                        required
                      />
                     
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
                {!loading2 && error2 && (
                  <div className="error-container">
                    <p>{error2}</p>

                  </div>
                )}







                <div className="d-flex justify-content-center align-items-center" >
                  <Button type="submit"> {loading2 ? <div>{t("Loading")}<Spinner color="white" size="sm" /></div> : t("Send")}</Button>
                </div>



              </Card.Body>
            </Card>

          </Form>
        </>
      )}
    </>
  );
};

export default FormValidation;
