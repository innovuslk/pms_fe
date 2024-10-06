import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import 'bootstrap/dist/css/bootstrap.min.css';
import './../assets/css/guage.css'

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
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '200px' }}>
            {loading ? (
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) : (
                <div className="gauge-container text-center">
                    <div className="gauge" style={{ '--efficiency': efficiency }}>
                        <div className="gauge-inner">
                            <span className="gauge-label">
                                {efficiency !== null ? `${efficiency}%` : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupervisorEfficiency;
