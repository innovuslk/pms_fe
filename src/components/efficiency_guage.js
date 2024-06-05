import React from 'react';
import ApexCharts from 'react-apexcharts';
import { useState, useEffect } from 'react';
import { I18nextProvider, useTranslation } from "react-i18next";
import axios from 'axios';

const RadialBarChart = ({ pieceCount, dailyTarget }) => {

    const { t } = useTranslation();

    const [intHour, setIntHour] = useState();
    const [efficiency, setEfficiency] = useState();
    const [shiftHours, setShiftHours] = useState();
    const [latestHour, setLatestHour] = useState('');

    useEffect(() => {
        let efficiency = calculateEfficiency()

        setEfficiency(efficiency)

        const intervalId = setInterval(calculateEfficiency, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [pieceCount, latestHour])

    useEffect(() => {
        getShiftHours();

        const intervalId = setInterval(getShiftHours, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [shiftHours]);

    useEffect(() => {
        // Fetch latest piece count on component mount
        fetchLatestPieceCount();

        const intervalId = setInterval(fetchLatestPieceCount, 5000);

        return () => clearInterval(intervalId);
    }, [latestHour]);

    useEffect(() => {
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
    }, [latestHour, pieceCount])

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

    const fetchLatestPieceCount = async () => {
        const username = window.location.pathname.split('/').pop();

        try {

            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/set/getPieceCount`, {
                username: username,
            });

            setLatestHour(response.data.latestHour);
        } catch (error) {
            console.error('Error fetching latest Piece count data:', error);
        }
    };

    const calculateEfficiency = () => {
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
            <h1 className='text-danger'>{efficiency || '0'}%</h1>
        </div>

    );
};

export default RadialBarChart;
