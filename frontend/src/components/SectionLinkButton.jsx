"use client";
import { IoCopyOutline } from "react-icons/io5"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function SectionLinkButton(props) {
    function notification() {
        toast(props.link + " kopieret til udklipsholder", {
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: true,
            theme: "dark",
            className: "toast",
        });
    }

    return (
        <div className="copy-to-clipboard-hover-container">
            <div className="copy-to-clipboard-button" onClick={() => { navigator.clipboard.writeText(props.link); notification(); }}>
                <IoCopyOutline />
            </div>
            <ToastContainer />
        </div>
    )
}