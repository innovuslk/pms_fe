import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from '../i18n';

function Deviation({ shift, shiftHours, latestHour, pieceCount, sendDataToParent, operator }) {

    const { t } = useTranslation();

    const [shiftID, setShiftID] = useState('');
    const [dailyTarget, setDaillytarget] = useState();
    const [intHour, setIntHour] = useState()
    const [deviation, setDeviation] = useState();
    const [requiredRate, setRequiredRate] = useState(0);
    const [actualRequiredRate, setActualRequiredRate] = useState();
    const [pieceCountForHour, setPieceCountForHour] = useState()
    const [nextHourTarget, setNextHourTarget] = useState()
    const [currentHourlyRate, setcurrentHourlyRate] = useState();

    useEffect(() => {
        setShiftID(shift);
    }, [shift]);

    useEffect(() => {
        // console.log("Sending to parent:", {
        //     requiredRate,
        //     dailyTarget,
        //     actualRequiredRate,
        //     nextHourTarget,
        //     currentHourlyRate,
        //     deviation,
        //     shift,
        //     shiftHours,
        //     latestHour
        // });
        sendDataToParent(requiredRate, dailyTarget, actualRequiredRate, nextHourTarget, currentHourlyRate, deviation)
    }, [requiredRate, actualRequiredRate, currentHourlyRate, deviation])

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
        calculateDeviation(shiftHours, dailyTarget, intHour, pieceCount);

    }, [shift, shiftHours, dailyTarget, intHour, pieceCount])

    useEffect(() => {
        // console.log(latestHour)
        switch (latestHour) {
            case "1":
                setIntHour(0.5);
                break;
            case "2":
                setIntHour(1.5);
                break;
            case "3":
                setIntHour(2.5);
                break;
            case "4":
                setIntHour(3.5);
                break;
            case "5":
                setIntHour(4.5);
                break;
            case "6":
                setIntHour(5.5);
                break;
            case "7":
                setIntHour(6.5);
                break;
            case "8":
                setIntHour(7);
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


    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center gap-2 ">
            <h3 className="mb-0">{deviation < 0 ? '0' : deviation || '0'}</h3>
            <p className="mb-0" style={{ fontSize: '0.7rem', padding: '0px' }}>{t("Deviation")}</p>
        </div>
    )
}

export default Deviation;
