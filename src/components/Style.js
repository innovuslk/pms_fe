import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useTranslation } from "react-i18next";
import '../assets/css/style.css';
import axios from 'axios';

function Style() {
    const { t } = useTranslation();
    const [styles, setStyles] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState('Select Size');
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null); // null: default, 'success': success, 'error': error
    const [operatorInfo, setOperatorInfo] = useState();

    const username = window.location.pathname.split('/').pop().replace('&admin=true', '');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/info/getInfo`, { username });
                setOperatorInfo(response.data);

                // Fetch styles after operator info is set
                const styleResponse = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getStyle`, {
                    operation: response.data.operation
                });

                if (styleResponse.data.styles) {
                    setStyles(styleResponse.data.styles);
                }

                // Retrieve the last selected style for the specific user from local storage
                const savedStyle = localStorage.getItem(`selectedStyle_${username}`);
                if (savedStyle) {
                    setSelectedStyle(savedStyle);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    const handleStyleSelect = (style) => {
        setSelectedStyle(style);
        setLoading(true);
        setStatus(null);

        // Save the selected style to local storage with the username as part of the key
        localStorage.setItem(`selectedStyle_${username}`, style);

        axios.post(`http://${process.env.REACT_APP_HOST_IP}/insert/insertStyle`, { username, size: style })
            .then(response => {
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
            <button 
                className="btn neon-gradient-btn dropdown-toggle w-100 d-flex align-items-center justify-content-center" 
                type="button" 
                id="dropdownMenuButton1" 
                data-bs-toggle="dropdown" 
                aria-expanded="false" 
                style={{ height: "3rem", fontWeight: "600" }}
                disabled={loading}
            >
                {loading ? <span className="material-symbols-outlined">cached</span> : selectedStyle}
                {status === 'success' && <span className="material-symbols-outlined">task_alt</span>}
                {status === 'error' && <span className="material-symbols-outlined text-danger">close</span>}
            </button>
            <ul className="dropdown-menu w-100 position-absolute" aria-labelledby="dropdownMenuButton1">
                {styles.map((style, index) => (
                    <li key={index} onClick={() => handleStyleSelect(style)}>
                        <a className="dropdown-item">{style}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Style;
