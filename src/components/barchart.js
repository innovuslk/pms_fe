import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

function BarChart({ canvasId, data }) {
    useEffect(() => {
        const canvas = document.getElementById(canvasId);

        if (!canvas) {
            console.error(`Canvas element with id ${canvasId} not found.`);
            return;
        }

        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                maintainAspectRatio: false,
                barPercentage: 0.4,
                categoryPercentage: 0.5,
                plugins: {
                    legend: {
                        position: 'bottom',
                        display: true,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                    x: {
                        grid: {
                            display: true,
                            drawBorder: true,
                            drawOnChartArea: true,
                            drawTicks: true,
                            color: function(context) {
                                // Add vertical lines conditionally based on label format
                                if (context.tick && context.tick.label === '') {
                                    return 'black'; // Line color for the placeholder
                                }
                                return 'rgba(0,0,0,0)'; // No line
                            }
                        }
                    }
                },
                animation: {
                    duration: 0, // turn off the animation
                },
            },
        });

        // Customize the bar colors with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(232,44,87,1)'); // Start color
        gradient.addColorStop(1, 'rgb(246,147,49)'); // End color

        // Apply gradient to the first dataset (Google)
        // chart.data.datasets[0].backgroundColor = gradient;

        // Clean up function
        return () => {
            chart.destroy();
        };
    }, [canvasId, data]);

    return <canvas id={canvasId} width="100%" height="200"></canvas>;
}

export default BarChart;
