import React, { useEffect} from "react";
import './userUnknown.scss'
const UserUnknownModal=({modalRef,isOpen, onClose, position })=>{


     useEffect(() => {
        const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
        };

        if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);
    return(
        <>
            <div className={`user-unknown-modal ${isOpen?"active":""} flex-column`}  ref={modalRef} style={{ top: position.top, left: position.left }}>
                <h5>Want to do this?</h5>
                <span>sign in to do this</span>
                <a href="/api/channel/auth/google" className="mt-5">sign in</a>

            </div>
        </>
    )

}
export default UserUnknownModal