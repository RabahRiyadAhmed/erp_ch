import { useRef,useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

const MyEditor = ({ onContentChange, onload ,token,isValid}) => {
  const editorRef = useRef(null);
  const savedState = localStorage.getItem('layoutState');
  const savedStateParse = savedState ? JSON.parse(savedState) :null
  const isDarkMode = savedStateParse && savedStateParse.layoutColor =='dark'
  console.log(isDarkMode)
  const handleEditorChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent(); // Récupère le contenu HTML
      if (onContentChange) {
        onContentChange(content); // Transmet le contenu au parent
      }
    }
  };
 
  const editorStyle = {
   
    borderColor: isValid ? 'initial' : 'red', // Si invalide, bordure rouge
    borderWidth: '2px',
    borderStyle: 'solid',
  };
  return (
    <div>
      <Editor
      
        onInit={(evt, editor) => {
          editorRef.current = editor;
          onload(false)

        }}
        init={{
          skin: isDarkMode ? 'oxide-dark' : 'oxide',          // Choisir le thème oxide-dark pour le mode sombre
          content_css: isDarkMode ? 'tinymce-5-dark' : 'default',
          setup: (editor) => {
            console.log('before')
            editor.on("BeforeRequest", (e) => {
              e.headers = {
                ...e.headers,
                Authorization: `Bearer ${token}`, // Ajouter le token dans l'en-tête
              };
            });
          },
          branding: false, // Supprimer le footer "Powered by TinyMCE"
          menubar: true,
          promotion: false, 
          plugins:
            "image media table advlist autolink link lists charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount",
          toolbar:
            "undo redo | bold italic | image | table media | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
          automatic_uploads: true,

          // Gestionnaire pour insérer des images depuis le PC
          file_picker_callback: function (callback, value, meta) {
            const input = document.createElement("input");
            if (meta.filetype === "media") {
              input.setAttribute("type", "file");
              input.setAttribute("accept", "video/*,audio/*"); // Accepter fichiers vidéo/audio
            } else if (meta.filetype === "image") {
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*"); // Accepter uniquement les images
            }
          
            input.onchange = function () {
              const file = this.files[0];

              // Convertir le fichier en base64
              const reader = new FileReader();
              reader.onload = function () {
                callback(reader.result, { alt: file.name });
              };
              reader.onerror = function () {
                alert("Erreur lors de la lecture du fichier !");
              };
              reader.readAsDataURL(file);
            };

            input.click();
          },
         
        }}
        skin={isDarkMode ? 'oxide-dark' : 'oxide'}         // Choisir le thème oxide-dark pour le mode sombre
        content_css={isDarkMode ? 'dark' : 'default'}       // Utiliser un CSS sombre pour le contenu
       
        style={editorStyle} 
        onEditorChange={handleEditorChange} // Détecter les changements
        tinymceScriptSrc={`${process.env.REACT_APP_API_URL}/tinymce/tinymce.min.js`}
        
      />
    </div>
  );
};

export default MyEditor;
