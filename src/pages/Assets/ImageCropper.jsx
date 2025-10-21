import React, { useRef, useState ,useEffect} from 'react';
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import { Modal } from 'react-bootstrap';
import getFile from "./../../utils/getFile"
import selectImage from '../../assets/images/util/select-image-vector.jpg'

const ImageCropper = ({ onImageCropped, defaultImage ,token}) => {
    const [dfImage,setDFImage] = useState(null)
    
    console.log(dfImage)
    const [imageSrc, setImageSrc] = useState(null);
    const [croppedImage, setCroppedImage] = useState(selectImage);
    const [isCropperVisible, setIsCropperVisible] = useState(false);
    const imageRef = useRef(null);
    const fileInputRef = useRef(null);
    const cropperInstance = useRef(null);

    // Gérer le changement de fichier
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                setIsCropperVisible(true);
                if (cropperInstance.current) {
                    cropperInstance.current.destroy();
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Simuler un clic sur l'input fichier
    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Initialiser Cropper.js
    const initCropper = () => {
        if (imageRef.current) {
            cropperInstance.current = new Cropper(imageRef.current, {
                
            viewMode: 2,
            autoCropArea: 1, 
            zoomable: true,
            scalable: true,
            });
        }
    };

    // Recadrer l'image et fermer le modal
    const cropImage = () => {
        if (cropperInstance.current) {
            const canvas = cropperInstance.current.getCroppedCanvas({
                width: 500,
                height: 500,
            });
            setCroppedImage(canvas.toDataURL('image/png'));
            canvas.toBlob((blob) => {
                const file = new File([blob], 'croppedImage.png', { type: 'image/png' });
                onImageCropped(file);
            });
            setIsCropperVisible(false);
        }
    };

    // Annuler et fermer le modal
    const cancelCrop = () => {
        setIsCropperVisible(false);
        if (cropperInstance.current) {
            cropperInstance.current.destroy();
            cropperInstance.current = null;
        }
    };

    useEffect(() => {
        console.log(defaultImage)
        // Charger l'image quand le composant est monté
        if(defaultImage && defaultImage.name=='croppedImage.png')setDFImage(defaultImage)
            
        if (defaultImage) {
            const url = defaultImage;
            getFile(url, token).then(setDFImage);
        }
    }, [defaultImage]);

    return (
        <div>
            {/* Input fichier (caché) */}
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />

            {/* Image affichée avec clic pour ouvrir l'input */}
            <div>
                
                <img
                    src={dfImage ? dfImage : croppedImage}
                    alt="Cropped"
                    style={{ maxWidth: '250px', cursor: 'pointer' }}
                    onClick={handleImageClick}
                />
            </div>

            {/* Modal avec Cropper */}
            <Modal show={isCropperVisible} onHide={cancelCrop} backdrop="static" keyboard={false}>
                <Modal.Body>
                    {imageSrc && (
                        <div>
                            <img
                                ref={imageRef}
                                src={imageSrc}
                                alt="To crop"
                                style={{ maxWidth: '100%' }}
                                onLoad={initCropper}
                            />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" onClick={cancelCrop} className="btn btn-secondary">
                        Annuler
                    </button>
                    <button type="button" onClick={cropImage} className="btn btn-primary">
                        Recadrer
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ImageCropper;
