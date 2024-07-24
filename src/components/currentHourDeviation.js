import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from '../i18n';

function CurrentDeviation({ shift, shiftHours, latestHour, pieceCount, currentHourOutput, sendDataToParent, operator }) {

    const { t } = useTranslation();

    const [shiftID, setShiftID] = useState('');
    const [dailyTarget, setDaillytarget] = useState();
    const [intHour, setIntHour] = useState()
    const [Deviation, setDeviation] = useState();
    const [requiredRate, setRequiredRate] = useState(0);
    const [actualRequiredRate, setActualRequiredRate] = useState();
    const [pieceCountForHour, setPieceCountForHour] = useState()
    const [nextHourTarget, setNextHourTarget] = useState()
    const [currentHourlyRate, setcurrentHourlyRate] = useState();
    const [HourlyTarget, setHourlyTarget] = useState();

    useEffect(() => {
        setShiftID(shift);
    }, [shift]);

    useEffect(() => {
        const intervalId = setInterval(sendDataToParent(requiredRate, dailyTarget, actualRequiredRate, nextHourTarget, currentHourlyRate, HourlyTarget), 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, [requiredRate, dailyTarget, actualRequiredRate, nextHourTarget, currentHourlyRate, HourlyTarget, Deviation, pieceCount, currentHourOutput, latestHour])


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
    }, [dailyTarget,pieceCount]);

    useEffect(() => {
        calculateDeviation(shiftHours, dailyTarget, intHour, pieceCount);

    }, [shift, shiftHours, dailyTarget, intHour, pieceCount, latestHour, currentHourOutput, currentHourlyRate])

    useEffect(() => {
        switch (latestHour) {
            case "1":
                setIntHour(1);
                break;
            case "2":
                setIntHour(2);
                break;
            case "3":
                setIntHour(3);
                break;
            case "4":
                setIntHour(4);
                break;
            case "5":
                setIntHour(5);
                break;
            case "6":
                setIntHour(6);
                break;
            case "7":
                setIntHour(7);
                break;
            case "8":
                setIntHour(8);
                break;
            case "9":
                setIntHour(8.5);
                break;
            case "10":
                setIntHour(10);
                break;
        }
    }, [latestHour])



    const getDailyTarget = async () => {
        try {
            const username = window.location.pathname.split('/').pop().replace('&admin=true', '');
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getDailyTarget`, {
                username: username
            });
            setDaillytarget(response.data.dailyTarget)

        }
        catch (error) {
            console.error("Failed to dailyTarget");
        }
    }

    const getBarChartData = async () => {

        try {
            const username = window.location.pathname.split('/').pop().replace('&admin=true', '');
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getDataForBarChart`, {
                operatorType: operator,
                shift:shift,
                username: username
            });
            setPieceCountForHour(response)

        } catch (error) {
            // console.error("Failed to get barchart data", error);
        }
    }

    const calculateDeviation = (shiftHours, dailyTarget, intHour, pieceCount) => {

        let hourlyTarget = parseInt(dailyTarget) / shiftHours
        let alreadyDone = pieceCountForHour && pieceCountForHour.data.totalPieceCountByHour[latestHour]
        let deviation = alreadyDone - hourlyTarget;
        let nextHourTarget = (dailyTarget - pieceCount) / (shiftHours - intHour);
        let currentHourlyRate = pieceCount / intHour;
        let newDeviation = hourlyTarget - currentHourOutput
        setcurrentHourlyRate(parseInt(currentHourlyRate))
        setHourlyTarget(hourlyTarget.toFixed(2))
        setNextHourTarget(parseInt(nextHourTarget))
        setDeviation(newDeviation);
        setRequiredRate(hourlyTarget)
        setActualRequiredRate(alreadyDone + deviation)

        // console.log("deviation values", alreadyDone, deviation,latestHour, operator,shift)
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center ">
            <h3 className="mb-0">{isNaN(Deviation) ? HourlyTarget : (Deviation < 0 ? 0 : parseInt(Deviation))}</h3>
            <p className="mb-0" style={{ fontSize: '0.7rem', padding: '0px' }}>{t("Deviation")}</p>
        </div>
    )
}

export default CurrentDeviation;
