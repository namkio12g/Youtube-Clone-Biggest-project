import React, { useState, useRef, useEffect } from "react";

const AutoResizeTextarea = ({placeholder,title,fontSize,txtAreaRef,text="",nameInp}) => {
  const [value, setValue] = useState(text);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (txtAreaRef.current) {
      txtAreaRef.current.style.height = "auto"; 
      txtAreaRef.current.style.height = `${txtAreaRef.current.scrollHeight}px`; // 
    }
  }, [value]); 

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
        <div className="custom-texarea-box position-relative">
        <textarea className="custom-textarea"
            ref={txtAreaRef}
            name={nameInp}
            text={value}
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
