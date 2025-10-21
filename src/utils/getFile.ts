function getFile(url:string, token:string,body?:any) {
    console.log(body)
    return fetch(url, {
        
        method: body ? 'POST' :'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body:body ? JSON.stringify(body) :null
    })
    .then(response => {
        if (!response.ok) {
            console.error(`Failed to fetch image: ${response.statusText}`);
            return null;
        }
        return response.blob(); // Retourne un Blob
    })
    .then(blob => {
        if (blob) {
            return URL.createObjectURL(blob); // Crée une URL temporaire pour le Blob
        }
        return null;
    })
    .catch(error => {
        console.error('Error fetching image:', error);
        return null;
    });
}

export default getFile;
