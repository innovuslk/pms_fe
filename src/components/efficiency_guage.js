import React from 'react';
import ApexCharts from 'react-apexcharts';
import { useState, useEffect } from 'react';

const RadialBarChart = ({ Smv, pieceCount, latestHour }) => {

    const [intHour, setIntHour] = useState();
    const [efficiency, setEfficiency] = useState();

    useEffect(() => {
        let efficiency = calculateEfficiency(Smv, pieceCount, intHour)

        setEfficiency(efficiency)

        const intervalId = setInterval(calculateEfficiency, 10000);

        return () => {
            clearInterval(intervalId);
        };
    })

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

    const calculateEfficiency = (Smv, pieceCount, intHour) => {

        let targetRatePerHour = 60 / Smv;
        let pieceCountRate = pieceCount / intHour;

        let difference = targetRatePerHour - pieceCountRate;

        let efficiency;

        if (Math.round(difference) <= 0) {
            efficiency = 100;
        } else {
            efficiency = 100 - Math.round((difference / targetRatePerHour) * 100);
        }

        return efficiency;

    }

    const options = {
        chart: {
            // height: 'auto',
            // width:'5rem',
            type: 'radialBar',
        },
        series: [67],
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
        labels: ['Efficiency'],
    };

    return (
        <ApexCharts
            options={options}
            series={[efficiency || 0]}
            type="radialBar"
        />
    );
};

export default RadialBarChart;
