import React, { useState, useEffect } from 'react';
import "../assets/sass/dark-theme.css";
import "../assets/sass/main.css";
import 'bootstrap/dist/css/bootstrap.css';
import Clock from 'react-live-clock';
import axios from 'axios';

function Navbar() {

    let date_time = new Date();
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    let year = date_time.getFullYear();
    let date = ("0" + date_time.getDate()).slice(-2);
    let current_date = `${year}/${month}/${date} `; 


    const [operatorInfo,setOperatorInfo] = useState(null);
    const [username, setUsername] = useState();


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


    return (
        <html lang="en" data-bs-theme="dark">

            <body>
                <nav  className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div  className="container-fluid">	<a  className="navbar-brand mx-2 bg-primary rounded" href="#">Softmatter</a>
                        <button  className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent2" aria-controls="navbarSupportedContent2" aria-expanded="false" aria-label="Toggle navigation"> <span  className="navbar-toggler-icon"></span>
                        </button>
                        <div  className="collapse navbar-collapse" id="navbarSupportedContent2">
                            <ul  className="navbar-nav me-auto mb-2 mb-lg-0 gap-2 align-items-center">
                                <li  className="nav-item"><a  className="nav-link active d-flex align-items-center gap-1" aria-current="page" href="#"><span  className="material-symbols-outlined">
                                    factory
                                </span>{operatorInfo && operatorInfo.plantName || 'Plant'}</a>
                                </li>
                                <li  className="nav-item me-auto"><a  className="nav-link d-flex align-items-center gap-1" href="javascript:;"><span  className="material-symbols-outlined">
                                view_module
                                </span>Line - {operatorInfo && operatorInfo.lineNo || 'Line'}</a>
                                </li>
                                <li  className="nav-item me-auto"><a  className="nav-link d-flex align-items-center gap-1" href="javascript:;"><span  className="material-symbols-outlined">
                                styler
                                </span>Style</a>
                                </li>
                                <li className="nav-item me-auto">
                                    <a className="nav-link d-flex align-items-center gap-1" href="javascript:;">
                                    {current_date}
                                    <a></a>
                                    <Clock format={'HH:mm:ss'} ticking={true} timezone={'Asia/Colombo'}/>
                                    </a>
                                </li>
                            </ul>
                            <form  className="d-flex">
                                <button  className="btn btn-light mx-2 w-auto" type="submit"><i  className='bx bx-cart'></i> {operatorInfo && operatorInfo.decodedUsername || 'User'}</button>
                                <button  className="btn btn-light radius-30 px-2" type="submit"><span  className="material-symbols-outlined" style={{ fontSize: 30 }}>
                                    account_circle
                                </span></button>
                            </form>
                        </div>
                    </div>
                </nav>
            </body>
        </html>
    )
}

export default Navbar;
