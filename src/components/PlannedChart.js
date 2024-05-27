import React from 'react';
import ApexCharts from 'react-apexcharts';
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import axios from 'axios';

const PlannedRadialBarChart = ({ Smv, pieceCount, latestHour, shift }) => {
    const { t } = useTranslation();

    const [intHour, setIntHour] = useState();
    const [efficiency, setEfficiency] = useState(0);
    const [shiftHours, setShiftHours] = useState(0);

    useEffect(() => {
        const calculateEfficiency = () => {
            if (shiftHours > 0) {
                let targetRatePerHour = 60 * Smv;
                let pieceCountRate = pieceCount / shiftHours;

                let difference = targetRatePerHour - parseInt(pieceCountRate);

                let efficiency;
                if (Math.round(difference) <= 0) {
                    efficiency = 100;
                } else {
                    efficiency = 100 - Math.round((difference / targetRatePerHour) * 100);
                }

                // console.log(efficiency);
                setEfficiency(efficiency);
            }
        };

        const fetchShiftHours = async () => {
            try {
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getShiftHours`, {
                    shiftID: shift,
                });
                setShiftHours(response.data.ShiftHours);
            } catch (error) {
                console.error("Failed to get shift hours");
            }
        };

        calculateEfficiency();
        fetchShiftHours();

        const intervalId = setInterval(() => {
            calculateEfficiency();
            fetchShiftHours();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [Smv, pieceCount, shift, shiftHours]);

    useEffect(() => {
        const hourMapping = {
            "1st Hour": 1,
            "2nd Hour": 2,
            "3rd Hour": 3,
            "4th Hour": 4,
            "5th Hour": 5,
            "6th Hour": 6,
            "7th Hour": 7,
            "8th Hour": 8
        };
        setIntHour(hourMapping[latestHour] || 0);
    }, [latestHour]);

    const options = {
        chart: {
            type: 'radialBar',
        },
        series: [efficiency],
        colors: ['#20E647'],
        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 0,
                    size: '70%',
                    background: '#293450',
                },
                track: {
                    dropShadow: {
                        enabled: true,
                        top: 2,
                        left: 0,
                        blur: 4,
                        opacity: 0.15,
                    },
                },
                dataLabels: {
                    name: {
                        offsetY: -10,
                        color: '#fff',
                        fontSize: '13px',
                    },
                    value: {
                        color: '#fff',
                        fontSize: '30px',
                        show: true,
                    },
                },
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'vertical',
                gradientToColors: ['#87D4F9'],
                stops: [0, 100],
            },
        },
        stroke: {
            lineCap: 'round',
        },
        labels: [t("Efficiency")],
    };

    return (
        <ApexCharts
            options={options}
            series={[efficiency || 0]}
            type="radialBar"
        />
    );
};

export default PlannedRadialBarChart;
