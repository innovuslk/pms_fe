import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import i18n from '../i18n';

function CurrentDeviation({ shift, latestHour, pieceCount, currentHourOutput, sendDataToParent }) {
    const { t } = useTranslation();

    const [shiftHours, setShiftHours] = useState(0);
    const [shiftID, setShiftID] = useState('');
    const [dailyTarget, setDaillytarget] = useState(0);
    const [intHour, setIntHour] = useState(0);
    const [Deviation, setDeviation] = useState(0);
    const [requiredRate, setRequiredRate] = useState(0);
    const [actualRequiredRate, setActualRequiredRate] = useState(0);
    const [pieceCountForHour, setPieceCountForHour] = useState({ data: { totalPieceCountByHour: {} } });
    const [nextHourTarget, setNextHourTarget] = useState(0);
    const [currentHourlyRate, setcurrentHourlyRate] = useState(0);
    const [HourlyTarget, setHourlyTarget] = useState(0);

    useEffect(() => {
        setShiftID(shift);
    }, [shift]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            sendDataToParent(requiredRate, dailyTarget, actualRequiredRate, nextHourTarget, currentHourlyRate, HourlyTarget);
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [requiredRate, dailyTarget, actualRequiredRate, nextHourTarget, currentHourlyRate, HourlyTarget]);

    useEffect(() => {
        const fetchData = async () => {
            await getShiftHours();
            await getDailyTarget();
            await getBarChartData();
        };

        fetchData();

        const intervalId = setInterval(fetchData, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        calculateDeviation(shiftHours, dailyTarget, intHour, pieceCount);
    }, [shiftHours, dailyTarget, intHour, pieceCount, latestHour]);

    useEffect(() => {
        const hourMap = {
            "1": 1,
            "2": 2,
            "3": 3,
            "4": 4,
            "5": 5,
            "6": 6,
            "7": 7,
            "8": 8,
            "9": 8.5,
            "10": 10
        };
        setIntHour(hourMap[latestHour] || 0);
    }, [latestHour]);

    const getShiftHours = async () => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getShiftHours`, {
                shiftID: shiftID,
            });
            setShiftHours(response.data.ShiftHours || 0);
        } catch (error) {
            console.error("Failed to shift pieces");
        }
    }

    const getDailyTarget = async () => {
        try {
            const username = window.location.pathname.split('/').pop();
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getDailyTarget`, {
                username: username
            });
            setDaillytarget(response.data.dailyTarget || 0);
        } catch (error) {
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
            setPieceCountForHour(response || { data: { totalPieceCountByHour: {} } });
        } catch (error) {
            console.error("Failed to get barchart data", error);
        }
    }

    const calculateDeviation = (shiftHours, dailyTarget, intHour, pieceCount) => {


        const hourlyTarget = parseInt(dailyTarget) / shiftHours;
        const alreadyDone = pieceCountForHour?.data?.totalPieceCountByHour[latestHour] || 0;
        const deviation = alreadyDone - hourlyTarget;
        const nextHourTarget = (dailyTarget - pieceCount) / (shiftHours - intHour);
        const currentHourlyRate = pieceCount / intHour;
        const newDeviation = hourlyTarget - currentHourOutput;


        setDeviation(newDeviation);
        setcurrentHourlyRate(parseInt(currentHourlyRate));
        setHourlyTarget(hourlyTarget);
        setNextHourTarget(parseInt(nextHourTarget));
        setRequiredRate(hourlyTarget);
        setActualRequiredRate(alreadyDone + deviation);

        console.log("deviation values", shiftHours, dailyTarget, intHour, pieceCount);
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center ">
            <h3 className="mb-0">{Deviation < 0 || isNaN(Deviation) ? dailyTarget : parseInt(Deviation)}</h3>
            <p className="mb-0" style={{ fontSize: '0.7rem', padding: '0px' }}>{t("Deviation")}</p>
        </div>
    )
}

export default CurrentDeviation;
