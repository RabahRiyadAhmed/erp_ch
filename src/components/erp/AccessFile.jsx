import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import getFile from "../../utils/getFile";

const AccessFile = ({ files, token, defaultBody,file_url }) => {
  const [fileUrls, setFileUrls] = useState({}); // URLs temporaires des fichiers
  const [previewUrls, setPreviewUrls] = useState({}); // URLs temporaires des prévisualisations
  const [loadingFiles, setLoadingFiles] = useState({}); // Chargement en cours
  const [errors, setErrors] = useState({}); // Gestion des erreurs spécifiques

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Précharger les prévisualisations d'images
  useEffect(() => {
    const fetchPreviews = async () => {
      const previews = {};
      for (const file of files || []) {
        if (file.file_type && file.file_type.startsWith("image/")) {
          try {
            const url = await getFile(file.preview, token, defaultBody);
            previews[file.file_path] = url;
          } catch (error) {
            console.error("Erreur lors du chargement de la prévisualisation :", error);
            previews[file.file_path] = null;
          }
        }
      }
      setPreviewUrls(previews);
    };
    fetchPreviews();
  }, []);

  const handleFileClick = async (file) => {
    if (fileUrls[file.file_path]) {
      window.open(fileUrls[file.file_path], "_blank");
      return;
    }

    setLoadingFiles((prev) => ({ ...prev, [file.file_path]: true }));

    try {
      const url = await getFile(file.url ? file.url : file.file_path, token, defaultBody);
      setFileUrls((prev) => ({ ...prev, [file.file_path]: url }));
      window.open(url, "_blank");
    } catch (error) {
      console.error("Erreur lors du chargement du fichier :", error);
      setErrors((prev) => ({
        ...prev,
        [file.file_path]: "Impossible de charger le fichier.",
      }));
    } finally {
      setLoadingFiles((prev) => ({ ...prev, [file.file_path]: false }));
    }
  };

  return (
    <Row className="mx-n1 g-0">
      {(files || []).map((file, i) => (
        <Col key={i} xl={4} lg={6}>
          <Card className="m-1 shadow-none border">
            <div className="p-2">
              <Row className="align-items-center">
                {/* Prévisualisation des images ou icône */}
                <Col className="col-auto pe-0">
                  <div className="avatar-sm">
                    {file.file_type && file.file_type.startsWith("image/") ? (
                      previewUrls[file.file_path] ? (
                        <img
                          src={previewUrls[file.file_path]}
                          alt={file.name}
                          className="avatar-sm rounded bg-light"
                        />
                      ) : (
                        <span className="text-muted">Chargement...</span>
                      )
                    ) : (
                      <span className="avatar-title bg-light text-secondary rounded">
                        <i className={`mdi mdi-${getFileIcon(file.file_type)} font-18`}></i>
                      </span>
                    )}
                  </div>
                </Col>

                {/* Informations sur le fichier */}
                <Col>
                  {loadingFiles[file.file_path] ? (
                    <span className="text-muted">Chargement...</span>
                  ) : errors[file.file_path] ? (
                    <span className="text-danger">{errors[file.file_path]}</span>
                  ) : (
                    <Link
                      to="#"
                      onClick={() => handleFileClick(file)}
                      className="text-muted fw-bold"
                    >
                      {file.file_name || "Sans nom"}
                      <p className="mb-0 font-13">
                        Taille : {file.file_size ? formatBytes(file.file_size) : "Inconnue"}
                      </p>
                      <p className="mb-0 font-13 text-muted">
                        Type : {file.file_type || "Inconnu"}
                      </p>
                    </Link>
                  )}
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

// Fonction pour mapper les types de fichiers à des icônes
const getFileIcon = (fileType) => {
  if (!fileType) return "file";
  if (fileType.startsWith("image/")) return "image-outline";
  if (fileType.startsWith("video/")) return "video-outline";
  if (fileType.startsWith("application/pdf")) return "file-pdf-outline";
  if (fileType.startsWith("application/")) return "file-document-outline";
  return "file-outline";
};

export default AccessFile;
