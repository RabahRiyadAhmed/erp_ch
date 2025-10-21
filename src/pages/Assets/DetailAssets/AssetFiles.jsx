import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import getFile from "../../../utils/getFile";

const AssetFiles = ({ asset, auth }) => {
    const [fileUrls, setFileUrls] = useState({}); // Stocke les URLs générées
    const [loadingFiles, setLoadingFiles] = useState({}); // Indique si un fichier est en cours de chargement
    const [errors, setErrors] = useState({}); // Stocke les erreurs spécifiques à chaque fichier
    const formatBytes = (bytes,  decimals= 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
      };
    const handleFileClick = async (file) => {
        if (fileUrls[file]) {
            // URL déjà chargée, pas besoin de la regénérer
            window.open(fileUrls[file], "_blank");
            return;
        }

        setLoadingFiles((prev) => ({ ...prev, [file]: true })); // Indique que le fichier est en cours de chargement

        try {
            const url = await getFile(
                `${process.env.REACT_APP_API_URL}/api/file/asset/file?file=${file}&id=${asset.id}`,
                auth.token
            );

            // Mise à jour de l'URL générée
            setFileUrls((prev) => ({ ...prev, [file]: url }));
            window.open(url, "_blank"); // Ouvre le fichier une fois chargé
        } catch (error) {
            console.error("Erreur lors du chargement du fichier :", error);
            setErrors((prev) => ({ ...prev, [file]: "Impossible de charger le fichier." }));
        } finally {
            setLoadingFiles((prev) => ({ ...prev, [file]: false })); // Arrêt du chargement
        }
    };

    return (
        <Row className="mx-n1 g-0">
            {(asset?.asset_files || []).map((file, i) => (
                <Col key={i} xl={3} lg={6}>
                    <Card className="m-1 shadow-none border">
                        <div className="p-2">
                            <Row className="align-items-center">
                                <Col className="col-auto pe-0">
                                    <div className="avatar-sm">
                                        <span className="avatar-title bg-light text-secondary rounded">
                                            <i className="mdi mdi-folder-account font-18"></i>
                                        </span>
                                    </div>
                                </Col>
                                <Col>
                                    {loadingFiles[file.file_path] ? (
                                        // Indicateur de chargement
                                        <span className="text-muted">Chargement...</span>
                                    ) : errors[file.file_path] ? (
                                        // Message d'erreur
                                        <span className="text-danger">{errors[file.file_path]}</span>
                                    ) : (
                                        // Bouton pour charger et ouvrir le fichier
                                        <Link
                                            to="#"
                                            onClick={() => handleFileClick(file.file_path)}
                                            className="text-muted fw-bold"
                                        >
                                            {file.name}
                                            <p className="mb-0 font-13">{formatBytes(file.size)}</p>
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

export default AssetFiles;
