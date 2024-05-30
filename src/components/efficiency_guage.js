import React from 'react';
import ApexCharts from 'react-apexcharts';
import { useState, useEffect } from 'react';
import { I18nextProvider, useTranslation } from "react-i18next";
import axios from 'axios';

const RadialBarChart = ({ Smv, pieceCount, latestHour, dailyTarget }) => {

    const { t } = useTranslation();

    const [intHour, setIntHour] = useState();
    const [efficiency, setEfficiency] = useState();
    const [shiftHours, setShiftHours] = useState();

    useEffect(() => {
        let efficiency = calculateEfficiency(pieceCount, intHour, dailyTarget , shiftHours)

        setEfficiency(efficiency)

        const intervalId = setInterval(calculateEfficiency, 10000);

        return () => {
            clearInterval(intervalId);
        };
    })

    useEffect(() => {
        getShiftHours();

        const intervalId = setInterval(getShiftHours, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [shiftHours]);

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
    }, [latestHour])

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

    const calculateEfficiency = (pieceCount, intHour, dailyTarget , shiftHours) => {
        // Calculate the target hourly rate
        let targetHourlyRate = dailyTarget / shiftHours;
    
        // Calculate the current hourly rate
        let currentHourlyRate = pieceCount / intHour;
    
        // Calculate efficiency
        let efficiency = (currentHourlyRate / targetHourlyRate) * 135;
    
        return Math.round(efficiency);
    }

    // const options = {
    //     chart: {
    //         // height: 'auto',
    //         // width:'5rem',
    //         type: 'radialBar',
    //     },
    //     series: [67],
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
            <h1 className='text-danger'>{efficiency || '0'}</h1>
        </div>

    );
};

export default RadialBarChart;
