import React, { useState, useEffect, useContext, useRef } from 'react';
import getFile from './../../utils/getFile';


import { useSelector, useDispatch } from "react-redux";

const ImageFetch = React.memo(({ image, className, defaulBody, width, height, alt, style }) => {
    const auth = useSelector((state) => state.Auth);
const dispatch = useDispatch()
    const [imageUrl, setImageUrl] = useState(image);

  

    useEffect(() => {
        if (auth) {
            const url = `${process.env.REACT_APP_API_URL}` + image;
            getFile(url, auth.token, defaulBody).then(setImageUrl )
        } 
    }, [auth]);

    return (
        <img
            className={className}
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
            style={style}
        />
    );
});

export default ImageFetch;
