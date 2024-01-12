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
                const response = await axios.post('http://localhost:5000/info/getInfo', {
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
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div class="container-fluid">	<a class="navbar-brand mx-2 bg-primary rounded" href="#">Softmatter</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent2" aria-controls="navbarSupportedContent2" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent2">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-2 align-items-center">
                                <li class="nav-item"><a class="nav-link active d-flex align-items-center gap-1" aria-current="page" href="#"><span class="material-symbols-outlined">
                                    factory
                                </span>{operatorInfo && operatorInfo.plantName || 'Plant'}</a>
                                </li>
                                <li class="nav-item me-auto"><a class="nav-link d-flex align-items-center gap-1" href="javascript:;"><span class="material-symbols-outlined">
                                view_module
                                </span>Line - {operatorInfo && operatorInfo.lineNo || 'Line'}</a>
                                </li>
                                <li class="nav-item me-auto"><a class="nav-link d-flex align-items-center gap-1" href="javascript:;"><span class="material-symbols-outlined">
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
                            <form class="d-flex">
                                <button class="btn btn-light px-3" type="submit"><i class='bx bx-cart'></i> User123</button>
                                <button class="btn btn-light radius-30 px-4" type="submit"><span class="material-symbols-outlined" style={{ fontSize: 30 }}>
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