import React from 'react';
import ApexCharts from 'react-apexcharts';
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import axios from 'axios';

const PlannedRadialBarChart = ({ Smv, dailyTarget, latestHour }) => {
    const { t } = useTranslation();

    const [intHour, setIntHour] = useState();
    const [efficiency, setEfficiency] = useState(0);
    const [username, setUsername] = useState();
    const [plannedEfficiency, setPlannedEfficiency] = useState(0);

    useEffect(() => {
        const fetchPlannedEfficiency = async () => {
            try {
                const username = window.location.pathname.split('/').pop().replace('&admin=true', '');
                setUsername(username);
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getPlannedTarget`, {
                    username: username,
                });
                setPlannedEfficiency(response.data.dailyTarget);
            } catch (error) {
                console.error("Failed to get planned efficiency");
            }
        };

        // calculateEfficiency();
        fetchPlannedEfficiency();

        const intervalId = setInterval(() => {
            // calculateEfficiency();
            fetchPlannedEfficiency();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [Smv, dailyTarget]);

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

    // const options = {
    //     chart: {
    //         type: 'radialBar',
    //     },
    //     series: [efficiency],
    //     colors: ['#20E647'],
    //     plotOptions: {
    //         radialBar: {
    //             hollow: {
    //                 margin: 0,
    //                 size: '70%',
    //                 background: '#293450',
    //             },
    //             track: {
    //                 dropShadow: {
    //                     enabled: true,
    //                     top: 2,
    //                     left: 0,
    //                     blur: 4,
    //                     opacity: 0.15,
    //                 },
    //             },
    //             dataLabels: {
    //                 name: {
    //                     offsetY: -10,
    //                     color: '#fff',
    //                     fontSize: '13px',
    //                 },
    //                 value: {
    //                     color: '#fff',
    //                     fontSize: '30px',
    //                     show: true,
    //                 },
    //             },
    //         },
    //     },
    //     fill: {
    //         type: 'gradient',
    //         gradient: {
    //             shade: 'dark',
    //             type: 'vertical',
    //             gradientToColors: ['#87D4F9'],
    //             stops: [0, 100],
    //         },
    //     },
    //     stroke: {
    //         lineCap: 'round',
    //     },
    //     labels: [t("Efficiency")],
    // };

    return (
        <div className='d-flex align-content-center justify-content-center'>
            <h1 className='text-warning'>{plannedEfficiency && plannedEfficiency}%</h1>
        </div>

    )
};

export default PlannedRadialBarChart;
