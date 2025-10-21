import React, { useState ,useEffect,useContext} from "react";
import { Row, Col, Card, Form ,InputGroup,Button} from "react-bootstrap";
import { Navigate, Link, useNavigate } from "react-router-dom";
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
import EmployeeSearchSelect from "../../../components/erp/EmployeeSearchSelect";
import Spinner from "../../../components/Spinner";
import { useTranslation } from "react-i18next";
import { logout, updateToken } from '../../../redux/authSlice';
import { useSelector, useDispatch } from "react-redux";
// styles
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// components
import PageTitle from "../../../components/PageTitle";
import FileUploader from "../../../components/FileUploader";
import { FormInput } from "../../../components/";


import currencies_file from '../../../assets/static/currencies.json'

const ProductEdit = () => {
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
 
  //const [id,setId] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.Auth);
  const dispatch = useDispatch()




  const [type,setType] = useState("purchased"); /*purchased = Acheté || rented = Loué || lent = Prêté */
  const [serial_number,setSerialNumber] = useState("")
  const [asset_name,setAssetName] = useState("")
  const [asset_image, setAssetImage] = useState(null);
  const [asset_price, setAssetPrice] = useState(0.0)
  const [asset_description, setAssetDescription] = useState("")
  const [purchase_date,setPurchaseDate] = useState(null)
  const [warranty_expiration,setWarrantyExpiration] = useState(null)
  const [status,setStatus] = useState('available')
  const [employee_id,setEmployeeId] = useState(null)
  const [asset_files,setAssetFile] = useState([])
  const [rental_provider,setRentalProvider] = useState(null)
  const [rental_start_date,setRentalStartDate] = useState(null)
  const [rental_end_date,setRentalEndDate] = useState(null)
  const [loaner,setLoaner] = useState(null)
  const [loan_start_date,setLoanStartDate] = useState(null)
  const [loan_end_date,setLoanEndDate] = useState(null)
  const [loading,setLoading] =useState(false)
  const [error,setError] =useState(null)



  const [currencyOptions, setCurrencyOptions] = useState([{ label: "Devises", options: currenciesOptions }]);
  const [asset_currency, setAssetCurrency] = useState(null);
  const [editorState, setEditorState] = useState();


  const handleImageCropped = (image) => {
    setAssetImage(image); 
  };
  const schemaResolver = yupResolver(
    yup.object().shape({
    /*  asset_name: yup.string().required("Asset name is required"),
      serial_number: yup.string().required("Serial number is required"),
      asset_price: yup
        .number()
        .typeError("Price must be a valid number")
        .required("Price is required"),
      status: yup.string().required("Status is required"),
      purchase_date: yup.date().when("type", {
        is: "purchased",
        then: yup.date().required("Purchase date is required"),
        otherwise: yup.date().nullable(),
      }),
      rental_provider: yup.string().when("type", {
        is: "rented",
        then: yup.string().required("Rental provider is required"),
        otherwise: yup.string().nullable(),
      }),
      rental_start_date: yup.date().when("type", {
        is: "rented",
        then: yup.date().required("Rental start date is required"),
        otherwise: yup.date().nullable(),
      }),
      rental_end_date: yup.date().when("type", {
        is: "rented",
        then: yup.date().required("Rental end date is required"),
        otherwise: yup.date().nullable(),
      }),
    */})
  );

  const methods = useForm({ resolver: schemaResolver });
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {

    setLoading(true)

    var formData = new FormData();
   

     

     formData.append("type",type)
     formData.append('serial_number',serial_number)
     formData.append("asset_name",asset_name)
     formData.append("asset_description",asset_description)
     formData.append("purchase_date",purchase_date.toISOString())
     formData.append("status",status)
    if(warranty_expiration != null && warranty_expiration !== undefined){
      formData.append("warranty_expiration",warranty_expiration.toISOString())
    }
    if (employee_id !== null && employee_id !== undefined && employee_id!=="") {
      formData.append("employee_id", employee_id);
    }
    console.log(asset_currency)
    if(type!=='loan'){
      formData.append("asset_price",asset_price)
      formData.append("asset_currency",asset_currency.value)
    }
    if(type == 'rented'){
      if(rental_provider !== null && rental_provider !== undefined){
        formData.append("rental_provider", rental_provider);
      }
      if(rental_start_date !== null && rental_start_date !== undefined){
        formData.append("rental_start_date", rental_start_date.toISOString());
      }
      if(rental_end_date !== null && rental_end_date!== undefined){
        formData.append("rental_end_date", rental_end_date.toISOString());
      }
    }
    
    if(type == 'loan'){
      if(loaner !== null && loaner !== undefined){
        formData.append("loaner", loaner);
      }
      if(loan_start_date !== null && loan_start_date !== undefined){
        formData.append("loan_start_date", loan_start_date.toISOString());
      }
      if(loan_end_date !== null && loan_end_date!== undefined){
        formData.append("loan_end_date", loan_end_date.toISOString());
      }
    }
    if (asset_image) {
      formData.append('asset_image', asset_image);
    }
    
    // Ajouter les fichiers s'ils existent
    if (asset_files && asset_files.length > 0) {
      asset_files.forEach((f) => {
        formData.append("files", f);
      });
    }

  fetch(`${process.env.REACT_APP_API_URL}/api/asset/create`, {
    method: "POST",
    headers: { Authorization: `Bearer ${auth.token}`, },
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => {
  
      if (res.status) {
        
        if (res.token) {
          updateToken(res.token);
        }
        navigate('/assets/detail/'+res.data.asset.id);
      } else {
        if (res.message === "Token error") {
          logout();
        }
        setError(res.message || "system error");

      }
    })
    .catch((error) => {
      
      console.log(error)
      setError(t("An unexpected error occurred."));
    })
    .finally(()=>{
      setLoading(false);
    });
  };

  const onEditorStateChange = (editorStates) => {
    setEditorState(editorStates);
  };
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


        const defaultOption = formattedOptions.find((option) => option.value === "DZD");
        setAssetCurrency(defaultOption);
      } catch (error) {
        setCurrencyOptions([{ label: "Devises", options: currenciesOptions }])
        console.error("Erreur lors de la récupération des devises :", error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleChange = (selectedOption) => {
    setAssetCurrency(selectedOption);
    console.log("Devise sélectionnée :", selectedOption);
  };
  const handleTypeChange = (event) => {
    setType(event.target.value); // Met à jour l'état avec la valeur sélectionnée
    setRentalEndDate(null)
    setRentalProvider(null)
    setRentalStartDate(null)

    setLoaner(null)
    setLoanEndDate(null)
    setLoanStartDate(null)
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value); // Met à jour l'état avec la valeur sélectionnée
  };
 
  const formatOptionLabel = ({ value, label }, { context }) => {
    return context === "menu" ? `${value} - ${label}` : value; // `menu` = liste ouverte, sinon affichage simple
  };

  const handleFileUpload = (uploadedFiles) => {
    setAssetFile(uploadedFiles);
  };
  return (
    <>
      <Row>
        <Col>
          <div className="page-title-box">
            <h4 className="page-title">Add Assets</h4>
          </div>
        </Col>
      </Row>

      <form onSubmit={handleSubmit(onSubmit)}>
      <div>
     
    </div>
        <Row>
          <Col lg={6}>
            <Card>
              <Card.Body>
                <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                  General
                </h5>
                <FormInput
                  name="asset_name"
                  label="Asset Name"
                  placeholder="e.g : laptop"
                  containerClass={"mb-3"}
                  register={register}
                  key="assetname"
                  value={asset_name}
                  onChange={(e)=>{setAssetName(e.target.value)}}
                  maxLength={99}
                  required
                  errors={errors}
                  control={control}
                />
                <FormInput
                  name="serial_number"
                  label="Serial Number"
                  placeholder="e.g : 123-123"
                  containerClass={"mb-3"}
                  register={register}
                  key="serial_number"
                  value={serial_number}
                  onChange={(e)=>{setSerialNumber(e.target.value)}}
                  maxLength={99}
                  errors={errors}
                  control={control}
                />
                

                <FormInput
                  type="textarea"
                  rows="3"
                  name="asset_description"
                  label="Description"
                  placeholder="Please enter description"
                  containerClass={"mb-3"}
                  register={register}
                  key="asset_description"
                  value={asset_description}
                  onChange={(e)=>{setAssetDescription(e.target.value)}}
                  errors={errors}
                  control={control}
                />
                <Form.Group className="mb-3">
               <Form.Label>Purchase date</Form.Label>
               <InputGroup>
                 <DatePicker
                   selected={purchase_date}
                   onChange={date=>setPurchaseDate(date)} // Garde l'objet Date
                   dateFormat="yyyy-MM-dd hh:mm aa" // Format compatible avec date-fns
                   showTimeInput
                   required
                   isClearable
                   className="form-control" // Ajoute les styles Bootstrap
                   placeholderText="select date"
                 />
                 
               </InputGroup>
             </Form.Group> 
             <Form.Group className="mb-3">
               <Form.Label>Warranty expiration date</Form.Label>
               <InputGroup>
               
                 <DatePicker
                   selected={warranty_expiration}
                   onChange={date=>setWarrantyExpiration(date)} // Garde l'objet Date
                   dateFormat="yyyy-MM-dd hh:mm aa" // Format compatible avec date-fns
                   showTimeInput
                   isClearable
                   className="form-control" // Ajoute les styles Bootstrap
                   placeholderText="select date"
                 />

                
               </InputGroup>
             </Form.Group>
              </Card.Body>
            </Card>
            
          <Card>
            <Card.Body>
            <div className="mb-3">
              <label className="mb-2">Type d'asset</label>
              <select
                className="form-select"
                value={type}
                onChange={handleTypeChange}
              >
                <option value="purchased">purchased</option>
                <option value="rented">rented</option>
                <option value="loan">loan</option>
              </select>
            </div>

            {(type==='purchased' || type==='rented') && 
                <Form.Group className="mb-3">
                <Form.Label>Price </Form.Label>
                <InputGroup>
                  {/* Champ de prix */}
                  <Form.Control
                    type="number"
                    min={0}
                    required
                    name="asset_price"
                    placeholder="Saisir le montant"
                    value={asset_price}
                    onChange={(e) => setAssetPrice(e.target.value)}
                    errors={errors}
                  control={control}
                  />
                  {/* Sélecteur de devise */}
                  <Select
                    className="react-select react-select-container w-25"
                    classNamePrefix="react-select"
                    options={currencyOptions}
                    value={asset_currency}
                    onChange={handleChange}
                    placeholder="Devise"
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    formatOptionLabel={formatOptionLabel}
                  />
                </InputGroup>
                {/* Affichage d'erreurs */}
                {errors?.asset_price && <Form.Control.Feedback type="invalid">{errors.asset_price.message}</Form.Control.Feedback>}
              </Form.Group>
            }
            {type=="rented" && 
            <>
            <FormInput
                  name="rental_provider"
                  label="Rental Provider"
                  placeholder="e.g : Mr rental"
                  containerClass={"mb-3"}
                  register={register}
                  key="rental_provider"
                  value={rental_provider}
                  onChange={(e)=>{setRentalProvider(e.target.value)}}
                  maxLength={99}
                  errors={errors}
                  control={control}
                />
             <Form.Group className="mb-3">
               <Form.Label>rental start date</Form.Label>
               <InputGroup>
                 <DatePicker
                   selected={rental_start_date}
                   onChange={date=>setRentalStartDate(date)} // Garde l'objet Date
                   dateFormat="yyyy-MM-dd hh:mm aa" // Format compatible avec date-fns
                   showTimeInput
                   isClearable
                   className="form-control" // Ajoute les styles Bootstrap
                   placeholderText="select date"
                 />
                 
               </InputGroup>
             </Form.Group> <Form.Group className="mb-3">
               <Form.Label>rental end date</Form.Label>
               <InputGroup>
               
                 <DatePicker
                   selected={rental_end_date}
                   onChange={date=>setRentalEndDate(date)} // Garde l'objet Date
                   dateFormat="yyyy-MM-dd hh:mm aa" // Format compatible avec date-fns
                   showTimeInput
                   isClearable
                   className="form-control" // Ajoute les styles Bootstrap
                   placeholderText="select date"
                 />

                 

               </InputGroup>
             </Form.Group>
            </>
              
            }


{type=="loan" && 
            <>
            <FormInput
                  name="loaner"
                  label="loaner"
                  placeholder="e.g : Mr loan"
                  containerClass={"mb-3"}
                  register={register}
                  key="loaner"
                  value={loaner}
                  onChange={(e)=>{setLoaner(e.target.value)}}
                  maxLength={99}
                  errors={errors}
                  control={control}
                />
             <Form.Group className="mb-3">
               <Form.Label>loan start date</Form.Label>
               <InputGroup>
                 <DatePicker
                   selected={loan_start_date}
                   onChange={date=>setLoanStartDate(date)} // Garde l'objet Date
                   dateFormat="yyyy-MM-dd hh:mm aa" // Format compatible avec date-fns
                   showTimeInput
                   isClearable
                   className="form-control" // Ajoute les styles Bootstrap
                   placeholderText="select date"
                 />
                 
               </InputGroup>
             </Form.Group> <Form.Group className="mb-3">
               <Form.Label>loan end date</Form.Label>
               <InputGroup>
               
                 <DatePicker
                   selected={loan_end_date}
                   onChange={date=>setLoanEndDate(date)} // Garde l'objet Date
                   dateFormat="yyyy-MM-dd hh:mm aa" // Format compatible avec date-fns
                   showTimeInput
                   isClearable
                   className="form-control" // Ajoute les styles Bootstrap
                   placeholderText="select date"
                 />

                
               </InputGroup>
             </Form.Group>
            </>
              
            }
           

            </Card.Body>
            </Card>
          </Col>

          {/*********************************************************************************************************************** */}
          {/*********************************************************************************************************************** */}
          <Col lg={6}>

          <Card>
              <Card.Body>
                <h5 className="text-uppercase mt-0 mb-3 bg-light p-2">
                additional data
                </h5>
                <div className="mb-3">
                  <label className="mb-2">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={handleStatusChange}
                  >

                    <option value="available">available</option>
                    <option value="under_maintenance">under_maintenance</option>
                    <option value="in_use">in_use</option>
                    <option value="purchased">purchased</option>
                    <option value="reserved">reserved</option>
                    <option value="out_of_service">out_of_service</option>
                    <option value="pending_repair">pending_repair</option>
                    <option value="obsolete">obsolete</option>
                    <option value="sold">sold</option>
                    <option value="loan">loan</option>
                  </select>
                </div>
             
             
             <Form.Group className="mb-3">
             <Form.Label>select employee</Form.Label>
             <EmployeeSearchSelect
                      value={employee_id}
                      onChange={(emp) => setEmployeeId( emp )}
                    />
                    
                </Form.Group>
              </Card.Body>
            </Card>

          <Card>
            <Card.Body>
              <h5 className="text-uppercase mt-0 mb-3 bg-light p-2">Product Images</h5>
              <Form.Group className="mb-3 text-center">
                <div className="d-flex justify-content-center align-items-center" >
                  <ImageCropper onImageCropped={handleImageCropped} />
                 
                </div>
               
              </Form.Group>
            </Card.Body>
          </Card>



            <Card>
              <Card.Body>
                <h5 className="text-uppercase mt-0 mb-3 bg-light p-2">
                  Product Images
                </h5>
                <FileUploader  onFileUpload={handleFileUpload}/>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="text-center mb-3">
              <button
                type="submit"
                className="btn w-sm btn-success waves-effect waves-light me-1"
                disabled={loading}
              >
                {loading ? <div>{t("loading")}<Spinner  color="white" size="sm" /></div> : t("send")}
              </button>
             
            </div>
          </Col>
        </Row>
      </form>
    </>
  );
};

export default ProductEdit;
