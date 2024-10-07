import React, { useState, useRef, useEffect } from "react";

const AutoResizeTextarea = ({placeholder,title,fontSize}) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 
    }
  }, [value]); 

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
        <div className="custom-texarea-box position-relative">
        <textarea className="custom-textarea"
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            style={{
                width: "100%",
                resize: "none",
                overflow: "hidden",
                boxSizing: "border-box",

            }}
        />
        <span className="title"
        style={{
            position:"absolute",
            top:"0",
            left:"0",
        }}
        >{title}</span>
        </div>
    </>
  );
};

export default AutoResizeTextarea;
