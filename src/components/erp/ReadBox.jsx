import React from "react";
import ReactShadow from "react-shadow"; // Import par défaut

const ReadBox = ({ content }) => {
  return (
    <ReactShadow.div>
      <div
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </ReactShadow.div>
  );
};

export default ReadBox;
