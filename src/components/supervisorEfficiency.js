import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from "react-i18next";

const SupervisorEfficiency = ({ pieceCount, dailyTarget, latestHour }) => {
    const { t } = useTranslation();
    const [pieceCountData, setPieceCount] = useState(pieceCount);
    const [dailyTargetData, setDailyTarget] = useState(dailyTarget);
    const [latestHourData, setLatestHour] = useState(latestHour);
    const [intHour, setIntHour] = useState(0);
    const [efficiency, setEfficiency] = useState(null);
    const [shiftHours, setShiftHours] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setPieceCount(pieceCount);
        setDailyTarget(dailyTarget);
        setLatestHour(latestHour);
        // console.log(pieceCount, dailyTarget, latestHour)
    }, [pieceCount, dailyTarget, latestHour]);

    useEffect(() => {
        if (latestHourData) {
            const hour = parseInt(latestHourData, 10);
            setIntHour(hour - 0.5);
        }
    }, [latestHourData]);

    useEffect(() => {
        const fetchShiftHours = async () => {
            try {
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getShiftHours`, {
                    shiftID: "A",
                });
                setShiftHours(response.data.ShiftHours);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch shift hours", error);
                setLoading(false);
            }
        };

        fetchShiftHours();
    }, []);

    useEffect(() => {
        if (!shiftHours || !intHour) return;

        const calculatedEfficiency = calculateEfficiency();
        setEfficiency(calculatedEfficiency);

        const intervalId = setInterval(() => {
            const calculatedEfficiency = calculateEfficiency();
            setEfficiency(calculatedEfficiency);
        }, 10000);

        return () => clearInterval(intervalId);
    }, [pieceCountData, dailyTargetData, intHour, shiftHours]);

    const calculateEfficiency = () => {
        const targetHourlyRate = dailyTargetData / shiftHours;
        const currentHourlyRate = pieceCountData / intHour;
        const efficiency = (currentHourlyRate / targetHourlyRate) * 135;

        return Math.round(efficiency);
    };

    return (
        <div className='d-flex align-content-center justify-content-center'>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <h1 className='text-danger'>{efficiency !== null ? efficiency : 'N/A'}%</h1>
            )}
        </div>
    );
};

export default SupervisorEfficiency;
