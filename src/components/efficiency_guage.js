import React from 'react';
import ApexCharts from 'react-apexcharts';

const RadialBarChart = () => {
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
            series={[67]}
            type="radialBar"
        />
    );
};

export default RadialBarChart;
