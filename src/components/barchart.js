// BarChart.js
import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

function BarChart({ canvasId, data }) {
    useEffect(() => {
        const ctx = document.getElementById(canvasId).getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                maintainAspectRatio: false,
                barPercentage: 0.6,
                categoryPercentage: 0.5,
                plugins: {
                    legend: {
                        position: 'bottom',
                        display: true,
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                            min: 8,
                            max: 16,
                            stepSize: 1,
                        },
                        title: {
                            display: true,
                            text: 'Hours',
                        },
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        // Customize the bar colors with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(232,44,87,1)');  // Start color
        gradient.addColorStop(1, 'rgb(246,147,49)');  // End color

        // Apply gradient to the first dataset (Google)
        chart.data.datasets[0].backgroundColor = gradient;

        // Clean up function
        return () => {
            chart.destroy();
        };
    }, [canvasId, data]);

    return (
        <canvas id={canvasId} width="400" height="200"></canvas>
    );
}

export default BarChart;
