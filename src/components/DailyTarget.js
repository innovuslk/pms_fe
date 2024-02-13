import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

function DailyTarget() {

    const [dailyTarget, setDaillytarget] = useState();

    useEffect(() => {
        getDailyTarget();

        const intervalId = setInterval(getDailyTarget, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [dailyTarget]);

    const getDailyTarget = async () => {
        try {
            const username = window.location.pathname.split('/').pop();
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getDailyTarget`,{
                username:username
            });
            setDaillytarget(response.data.dailyTarget)

        }
        catch (error) {
            console.error("Failed to dailyTarget",error);
        }
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center mx-1">
        <h3 className="mb-0">{dailyTarget || '0'}</h3>
        <p className="mb-0">Target</p>
    </div>
    )

}


export default DailyTarget;
