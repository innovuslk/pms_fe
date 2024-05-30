import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from '../i18n';

function Deviation({ shift, latestHour , pieceCount, sendDataToParent  }) {

    const { t } = useTranslation();

    const [shiftHours, setShiftHours] = useState();
    const [shiftID, setShiftID] = useState('');
    const [dailyTarget, setDaillytarget] = useState();
    const [intHour, setIntHour] = useState()
    const [deviation,setDeviation] = useState();
    const [requiredRate, setRequiredRate] = useState(0);
    const [actualRequiredRate, setActualRequiredRate] = useState();
    const[pieceCountForHour, setPieceCountForHour] = useState()
    const[nextHourTarget, setNextHourTarget] = useState()
    const [currentHourlyRate, setcurrentHourlyRate] = useState();

    useEffect(() => {
        setShiftID(shift);
    }, [shift]);

    useEffect(() => {
        sendDataToParent(requiredRate,dailyTarget,actualRequiredRate,nextHourTarget, currentHourlyRate, deviation)
    },[requiredRate,actualRequiredRate ,currentHourlyRate, deviation])

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
        getBarChartData();

        const intervalId = setInterval(getBarChartData, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [dailyTarget]);

    useEffect(() => {
        calculateDeviation(shiftHours,dailyTarget,intHour,pieceCount);

    },[shift, shiftHours, dailyTarget, intHour, pieceCount])

    useEffect(() => {
        // console.log(latestHour)
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

            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getShiftHours`, {
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
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getDailyTarget`,{
                username:username
            });
            setDaillytarget(response.data.dailyTarget)

        }
        catch (error) {
            console.error("Failed to dailyTarget");
        }
    }

    const getBarChartData = async () => {

        try {
            const username = window.location.pathname.split('/').pop();
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getDataForBarChart`, {
                operatorType: 'operator',
                username: username
            });
            setPieceCountForHour(response)

        } catch (error) {
            console.error("Failed to get barchart data", error);
        }
        }

    const calculateDeviation = ( shiftHours, dailyTarget , intHour , pieceCount) => {

        // console.log("deviation values",shiftHours, dailyTarget ,intHour ,pieceCount )

            let hourlyTarget = parseInt(dailyTarget) / shiftHours
            let alreadyDone = pieceCountForHour && pieceCountForHour.data.totalPieceCountByHour[latestHour]
            let deviation = alreadyDone - hourlyTarget;
            let nextHourTarget = (dailyTarget - pieceCount) / (shiftHours - intHour);
            let currentHourlyRate = pieceCount / intHour;
            let newDeviation = dailyTarget - pieceCount
            setcurrentHourlyRate(currentHourlyRate)
            setNextHourTarget(parseInt(nextHourTarget))
            setDeviation(newDeviation);
            setRequiredRate(hourlyTarget)
            setActualRequiredRate(alreadyDone + deviation)
            // console.log("requsdifjdisajf",nextHourTarget)

    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center gap-2 ">
            <h3 className="mb-0">{deviation || 'null'}</h3>
            <p className="mb-0">{t("Deviation")}</p>
        </div>
    )
}

export default Deviation;
