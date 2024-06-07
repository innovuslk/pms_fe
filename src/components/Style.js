import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useTranslation } from "react-i18next";
import '../assets/css/style.css';
import axios from 'axios';


function Style() {
    const { t } = useTranslation();
    const [styles, setStyles] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState('Select Style');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // null: default, 'success': success, 'error': error

    const username = window.location.pathname.split('/').pop(); 

    useEffect(() => {
        // Fetch styles from the backend
        axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getStyle`)
            .then(response => {
                if (response.data.styles) {
                    setStyles(response.data.styles);
                }
                console.log(response);
            })
            .catch(error => {
                console.error('Error fetching styles:', error);
            });
    }, []);

    const handleStyleSelect = (style) => {
        setSelectedStyle(style);
        setLoading(true);
        setStatus(null);
        // Send selected style and username to the API
        axios.post(`http://${process.env.REACT_APP_HOST_IP}/insert/insertStyle`, {
            username: username,
            size: style
        })
        .then(response => {
            console.log('Style updated successfully:', response);
            setLoading(false);
            setStatus('success');
        })
        .catch(error => {
            console.error('Error updating style:', error);
            setLoading(false);
            setStatus('error');
        });
    };

    return (
        <div className="dropdown col mb-3 p-0">
            <button className="btn neon-gradient-btn dropdown-toggle w-100 d-flex align-items-center justify-content-center" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" style={{ height: "3rem", fontWeight: "600" }}>
                {loading ? <span  className="material-symbols-outlined">
                cached
                </span> : selectedStyle}
                {status === 'success' &&<span  className="material-symbols-outlined">
                task_alt
                </span>}
                {status === 'error' && <span  className="material-symbols-outlined text-danger">
                close
                </span>}
            </button>
            <ul className="dropdown-menu w-100 position-absolute" aria-labelledby="dropdownMenuButton1">
                {styles.map((style, index) => (
                    <li key={index} onClick={() => handleStyleSelect(style)}><a className='dropdown-item'>{style}</a></li>
                ))}
            </ul>
        </div>
    );
}

export default Style;
