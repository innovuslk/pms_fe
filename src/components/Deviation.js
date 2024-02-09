import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

function Deviation({ shift, latestHour , pieceCount, sendDataToParent  }) {
    const [shiftHours, setShiftHours] = useState();
    const [shiftID, setShiftID] = useState('');
    const [dailyTarget, setDaillytarget] = useState();
    const [intHour, setIntHour] = useState()
    const [deviation,setDeviation] = useState();
    const [requiredRate, setRequiredRate] = useState(0);

    useEffect(() => {
        setShiftID(shift);
    }, [shift]);

    useEffect(() => {
        sendDataToParent(requiredRate,dailyTarget)
    },[requiredRate])

    useEffect(() => {
        getShiftHours();

        const intervalId = setInterval(getShiftHours, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [shiftHours]);

    useEffect(() => {
        getDailyTarget();

        const intervalId = setInterval(getDailyTarget, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [dailyTarget]);

    useEffect(() => {
        calculateDeviation(shiftHours,dailyTarget,intHour,pieceCount);

    },[shift, shiftHours, dailyTarget, intHour, pieceCount])

    useEffect(() => {
        switch (latestHour) {
            case "1st Hour":
                setIntHour(1);
                break;
            case "2nd Hour":
                setIntHour(2);
                break;
            case "3rd Hour":
                setIntHour(3);
                break;
            case "4th Hour":
                setIntHour(4);
                break;
            case "5th Hour":
                setIntHour(5);
                break;
            case "6th Hour":
                setIntHour(6);
                break;
            case "7th Hour":
                setIntHour(7);
                break;
            case "8th Hour":
                setIntHour(8);
                break;
        }
    },[latestHour])

    const getShiftHours = async () => {
        try {

            const response = await axios.post('http://4.193.94.82:5000/get/getShiftHours', {
                shiftID: "A",
            });
            setShiftHours(response.data.ShiftHours)
        }
        catch (error) {
            console.error("Failed to shift pieces");
        }
    }

    const getDailyTarget = async () => {
        try {
            const username = window.location.pathname.split('/').pop();
            const response = await axios.post('http://4.193.94.82:5000/get/getDailyTarget',{
                username:username
            });
            setDaillytarget(response.data.dailyTarget)

        }
        catch (error) {
            console.error("Failed to dailyTarget");
        }
    }

    const calculateDeviation = ( shiftHours, dailyTarget , intHour , pieceCount) => {

        console.log("data in deviation",shiftHours, dailyTarget , intHour , pieceCount)
            let hourlyTarget = parseInt(dailyTarget) / shiftHours
            let alreadyDone = parseInt(pieceCount)/ intHour
            let deviation = hourlyTarget - alreadyDone
            setDeviation(parseInt(deviation));
            setRequiredRate(hourlyTarget)

            

    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center gap-2 ">
            <h3 className="mb-0">{deviation || 'null'}</h3>
            <p className="mb-0">Deviation</p>
        </div>
    )
}

export default Deviation;
