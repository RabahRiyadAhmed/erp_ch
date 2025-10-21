import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Dropdown, Tab, Nav, Modal, Alert } from "react-bootstrap";
import { useParams, useNavigate } from 'react-router-dom';
// components
import moment from "moment"
import { AuthContext } from "../../../helpers/AuthContext";
import { useTranslation } from "react-i18next";
import Spinner from "../../../components/Spinner";
import getFile from "../../../utils/getFile"

import AssetFiles from "./AssetFiles"
import AccessFile from '../../../components/erp/AccessFile';
import { logout, updateToken } from '../../../redux/authSlice';
import { useSelector, useDispatch } from "react-redux";
import ImageFetch from '../../../components/erp/ImageFetch';
const ProductDetails = () => {
  const { t } = useTranslation();

  const auth = useSelector((state) => state.Auth);
  const dispatch = useDispatch();

  const [imageUrl, setImageUrl] = useState(null);
  const [fileUrls, setFileUrls] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState(false);

  // États pour gérer les données et erreurs
  const [asset, setAsset] = useState({});
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState(null);
  const [error2, setError2] = useState(null);

  const handleGetSharableLink = () => {
    const link = `${process.env.REACT_APP_API_URL}/assets/detail/${id}`;
    navigator.clipboard.writeText(link).then(() => { }).catch(err => {
      console.error("Erreur lors de la copie du lien :", err);
    });
  };

  const handleUpdate = () => {
    navigate('/assets/update/' + id)
  }




  // Fonction pour récupérer les données de l'asset
  const getData = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/asset/detail`, {
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
          console.log(res.data.asset)

          let Attachments = [];
          const attachmentsList = res.data.asset.AssetAttachments || []; // Vérifie si Attachments existe
          if (Array.isArray(attachmentsList)) {
            attachmentsList.forEach(att => {
              Attachments.push({
                file_path: att.file_path,
                file_size: att.file_size,
                file_name: att.file_name,
                file_type: att.file_type,
                preview: att.preview, // Correction ici (orthographe)
                url: `/api/file/asset/file?file=${att.file_path}&id=${id}`
              });
            });
          }

          // Ajoute Attachments au request si nécessaire
          res.data.asset.AssetAttachments = Attachments;
          setAsset(res.data.asset);
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

  // Charger les données lors du premier rendu
  useEffect(() => {
    getData();
  }, [id]); // Ajout de 'id' dans le tableau de dépendances



  useEffect(() => {
    // Charger l'image quand le composant est monté
    if (asset && asset.asset_image) {
      const url = `${process.env.REACT_APP_API_URL}/api/file/asset/image?image=${asset.asset_image}`;
      getFile(url, auth.token).then(setImageUrl);
      const fetchFileUrls = async () => {
        if (asset && asset.asset_files) {
          const urls = {};
          for (const file of asset.asset_files) {
            // Générer une URL pour chaque fichier
            const url = await getFile(`${process.env.REACT_APP_API_URL}/api/file/asset/image?image=${file}`, auth.token);
            urls[file] = url;
          }
          setFileUrls(urls); // Met à jour l'état avec les URLs générées
        }
      };

      fetchFileUrls();



    }
  }, [asset]);

  const toggleDeleteHide = () => {
    setDeleteModal(!deleteModal);
  }


  const handleDelete = (e) => {
    e.preventDefault();
    setLoading2(true)
    setError2(null)
    fetch(`${process.env.REACT_APP_API_URL}/api/asset/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ id: id })
    })
      .then((res) => {
        if (!res.ok) {
          setError2("Network response was not ok");
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((res) => {
        if (res.status) {
          navigate('/assets')
        } else {
          if (res.message === "Token error") {
            dispatch(logout());
          }
          setError2(res.message || "System error");
        }
        if (res.token) {
          dispatch(updateToken(res.token));
        }
      })
      .catch((error) => {
        console.error(error);
        setError2("An unexpected error occurred.");
      })
      .finally(() => {
        setLoading2(false);
      });
  }
  // Gestion du retry en cas d'erreur
  const handleRetry = () => {
    setError("");

    getData();
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
      `}</style>


      <Modal show={deleteModal} onHide={toggleDeleteHide}>
        <Modal.Body>
          <div className="text-center mt-2 mb-4">
            <div className="auth-logo">
              <span className="logo-xl">
                <img src={`${process.env.REACT_APP_API_URL}/image/logo.jpeg`} alt="" />
              </span>

            </div>
          </div>
          {error2 && (
            <Alert variant="danger" className="my-2">
              {error2}
            </Alert>
          )}
          <form className="ps-3 pe-3" onSubmit={handleDelete}>
            <h3> delete asset</h3>
            <div className="mb-3">
              <p htmlFor="up_name" className="form-label">
                Are you sure you want to delete this resource ?
              </p>
              <p htmlFor="up_name" className="form-label">
                delete : {asset.name_asset}
              </p>

            </div>

            <div className="mb-3 text-center">
              <button className="btn rounded-pill btn-primary" type="submit" disabled={loading2}>
                {loading2 ? <div>{t("loadinf...")}<Spinner color="white" size="sm" /></div> : t("send")}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Row>
        <Col>
          <div className="page-title-box">
            <h4 className="page-title">asset detail</h4>
          </div>
        </Col>
      </Row>


      <Row>
        <Col>
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
            <Card>
              <Card.Body>
                <Dropdown className="card-widgets" align="end">
                  <Dropdown.Toggle className="table-action-btn dropdown-toggle btn btn-light btn-xs">
                    <i className="mdi mdi-dots-horizontal"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleGetSharableLink}>
                      <i className="mdi mdi-link me-2 text-muted vertical-middle"></i>
                      Get Sharable Link
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleUpdate}>
                      <i className="mdi mdi-square-edit-outline me-2 text-muted vertical-middle"></i>
                      edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={toggleDeleteHide}>
                      <i className="mdi mdi-delete me-2 text-muted vertical-middle"></i>
                      Remove
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Row>
                  {/*<Col lg={5}>
                 
                        <img
                           src={
                            imageUrl
                                ? imageUrl // URL récupérée depuis l'API
                                : `${process.env.REACT_APP_API_URL}/image/assets/assets.png` // Image par défaut
                        }
                        alt=""
                        className="img-fluid mx-auto d-block rounded"
                        />
                    
                </Col>*/}

                  <Col lg={4}>

                    <div className="text-center">
                      <img
                        src={
                          imageUrl
                            ? imageUrl // URL récupérée depuis l'API
                            : `${process.env.REACT_APP_API_URL}/image/assets/assets.png` // Image par défaut
                        }
                        alt={asset.name_asset || "Default asset image"}
                        className="img-fluid mx-auto d-block rounded"
                      />
                      <h4 className="mb-1 font-20">{asset.name_asset}</h4>
                      <p className="text-muted  font-14">{asset.serial_number}</p>
                    </div>

                    <p className="font-14 text-center text-muted">
                      {asset.asset_description}
                    </p>



                    <div className="row mt-4 text-center">
                      <div className="col-6">
                        <h5 className="fw-normal text-muted">Purchase date</h5>
                        <h4 className="font-14 text-center text-muted">{moment(asset.purchase_date).utc().format('YYYY-MM-DD HH:mm')}</h4>
                      </div>
                      <div className="col-6">
                        <h5 className="fw-normal text-muted">
                          Warranty expiration
                        </h5>
                        <h4 className="font-14 text-center text-muted">{asset.warranty_expiration ? moment(asset.warranty_expiration).utc().format('YYYY-MM-DD HH:mm') : '/'}</h4>
                      </div>
                    </div>

                  </Col>

                  <Col lg={8}>
                    <div className="ps-xl-3 mt-3 mt-xl-0">





                      <h4 className="mb-3">  type : {" "}
                        <div className="badge bg-soft-success text-success ">{asset.type}</div>
                      </h4>




                      <h4 className="mb-3"> Status : {" "}
                        <div className="badge bg-soft-success text-success ">{asset.status}</div>
                      </h4>

                      {(asset.type === 'purchased' || asset.type === 'rented') && asset.asset_price && (
                        <h4 className="mb-4">
                          Price :{" "}
                          <b>{asset.asset_price} {asset.asset_currency}</b>
                        </h4>

                      )}

                      {asset.type === 'rented' && (
                        <div className="row mt-4">
                          <h5 className="fw-normal">Rental provider : <b className="font-14 text-muted">{asset.rental_provider ? asset.rental_provider : '/'}</b></h5>
                          <h5 className="fw-normal">Rental start date : <b className="font-14 text-muted">{asset.rental_start_date ? moment(asset.rental_start_date).utc().format('YYYY-MM-DD HH:mm') : '/'}</b></h5>
                          <h5 className="fw-normal">Rental end date : <b className="font-14 text-muted">{asset.rental_end_date ? moment(asset.rental_end_date).utc().format('YYYY-MM-DD HH:mm') : '/'}</b></h5>
                        </div>
                      )}

                      {asset.type === 'loan' && (
                        <div className="row mt-4">
                          <h5 className="fw-normal">Loaner : <b className="font-14 text-muted">{asset.loaner ? asset.loaner : '/'}</b></h5>
                          <h5 className="fw-normal">Loan start date : <b className="font-14 text-muted">{asset.loan_start_date ? moment(asset.loan_start_date).utc().format('YYYY-MM-DD HH:mm') : '/'}</b></h5>
                          <h5 className="fw-normal">Loan end date : <b className="font-14 text-muted">{asset.loan_end_date ? moment(asset.loan_end_date).utc().format('YYYY-MM-DD HH:mm') : '/'}</b></h5>
                        </div>
                      )}


                      {asset.Employee && (
                        <div className="d-flex align-items-center">
                          <div className="inbox-item-img me-3">
                           
                            <ImageFetch


                              image={'/api/file/employee/profile/image'}
                              defaulBody={{ id: asset.Employee.id }}
                              className="rounded-circle"
                              alt={`${asset.Employee.first_name} ${asset.Employee.last_name}`}
                              width={52}
                              height={52}

                            />

                          </div>
                          <div>
                            <p className="inbox-item-author mb-1">
                              {asset.Employee.first_name} {asset.Employee.last_name}
                            </p>
                            <p className="inbox-item-text mb-1">
                              {asset.Employee.EmployeeRoles[0]?.Role.role_name || "No Role"}
                            </p>
                          </div>
                        </div>
                      )}

                      {!asset.Employee && (
                        <h4 className="mb-4">This asset is not assigned to anyone</h4>
                      )}




                      <AccessFile token={auth.token} files={asset.AssetAttachments} />
                    </div>
                  </Col>
                </Row>

              </Card.Body>
            </Card>

          )}

        </Col>
      </Row>
    </>
  );
};

export default ProductDetails;

