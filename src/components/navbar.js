import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "../assets/sass/dark-theme.css";
import "../assets/sass/main.css";
import 'bootstrap/dist/css/bootstrap.css';
import Clock from 'react-live-clock';
import axios from 'axios';

function Navbar({sendLanguage}) {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    let date_time = new Date();
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    let year = date_time.getFullYear();
    let date = ("0" + date_time.getDate()).slice(-2);
    let current_date = `${year}/${month}/${date} `;


    const [operatorInfo, setOperatorInfo] = useState(null);
    const [username, setUsername] = useState();
    const [iconClicked, setIconClicked] = useState(false);
    const [style, setStyle] = useState()
    const [connection, setConnection] = useState();
    const [selectedLanguage, setSelectedLanguage] = useState();



    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setSelectedLanguage(lng);
        sendLanguage(lng);
    };


    useEffect(() => {
        // Fetch data from your backend when the component mounts
        const fetchData = async () => {
            const username = window.location.pathname.split('/').pop();
            setUsername(username);
            try {
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/info/getInfo`, {
                    username: username,
                });

                setOperatorInfo(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, []);

    useEffect(() => {
        // Fetch data from your backend when the component mounts
        const checkConnection = () => {
            if (!navigator.onLine) {
                setConnection('offline')
            }
            else {
                setConnection('')
            }
        };

        const intervalId = setInterval(checkConnection, 5000);

        return () => clearInterval(intervalId);

    }, [connection]);

    useEffect(() => {
        // Fetch data from your backend when the component mounts
        const getStyle = async () => {
            const username = window.location.pathname.split('/').pop();
            setUsername(username);
            try {
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getDailyTarget`, {
                    username: username,
                });

                setStyle(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getStyle();

    }, []);

    const handleLogout = () => {
        navigate(`/`);
    };

    const handleClick = () => {
        setIconClicked(prevState => !prevState);
    }


    return (
        <html lang="en" data-bs-theme="dark">

            <body>
                <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                    <div className="container-fluid">	<a className="navbar-brand mx-2 rounded">PMS</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent2" aria-controls="navbarSupportedContent2" aria-expanded="false" aria-label="Toggle navigation"> <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent2">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2 align-items-center">
                                <li className="nav-item"><a className="nav-link active d-flex align-items-center gap-1" aria-current="page"><span className="material-symbols-outlined">
                                    factory
                                </span>{operatorInfo && operatorInfo.plantName || t('Plant')}</a>
                                </li>
                                <li className="nav-item me-auto"><a className="nav-link d-flex align-items-center gap-1"><span className="material-symbols-outlined">
                                    view_module
                                </span>{t('Line')} - {operatorInfo && operatorInfo.lineNo || t('Line')}</a>
                                </li>
                                <li className="nav-item me-auto"><a className="nav-link d-flex align-items-center gap-1"><span className="material-symbols-outlined">
                                    styler
                                </span>{t('Style')} - {style && style.style || t('Style')}</a>
                                </li>
                                <li className="nav-item me-auto">
                                    <a className="nav-link d-flex align-items-center gap-1" href="javascript:;">
                                        {current_date}
                                        <a></a>
                                        <Clock format={'HH:mm:ss'} ticking={true} timezone={'Asia/Colombo'} />
                                    </a>
                                </li>
                                {connection === 'offline' ? <li className="nav-item me-auto"><a className="nav-link d-flex align-items-center gap-1 text-danger"><span class="material-symbols-outlined text-danger">
                                    wifi_off
                                </span> {t('You Have No Internet')}</a>
                                </li> : ''}
                            </ul>


                            <form className="d-flex align-items-center justify-content-center">
                                <button className="btn btn-light mx-2 w-auto" type="submit"><i className='bx bx-cart'></i> {operatorInfo && operatorInfo.decodedUsername || t('User')}</button>
                                <button className="btn btn-light radius-30 px-2" type="button" onClick={handleClick}><span className="material-symbols-outlined" style={{ fontSize: 30 }}>
                                    account_circle
                                </span></button>
                                {iconClicked && <button className="btn btn-danger h-50 w-auto" onClick={handleLogout}>{t('Log out')}</button>}
                            </form>

                            <div className="dropdown w-auto">
                                <button className="btn btn-secondary dropdown-toggle w-auto" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    Language
                                </button>
                                <ul className="dropdown-menu w-auto position-absolute" aria-labelledby="dropdownMenuButton1">
                                    <li><a className={`dropdown-item ${selectedLanguage === 'en' ? 'active bg-primary' : ''}`} onClick={() => changeLanguage('en')}>English</a></li>
                                    <li><a className={`dropdown-item ${selectedLanguage === 'zh' ? 'active bg-primary' : ''}`} onClick={() => changeLanguage('zh')}>中国人</a></li>
                                    <li><a className={`dropdown-item ${selectedLanguage === 'sn' ? 'active bg-primary' : ''}`} onClick={() => changeLanguage('sn')}>සිංහල</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </body>
        </html>
    )
}

export default Navbar;
