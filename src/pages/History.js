import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../assets/css/adminHome.css';
import axios from 'axios';
import BarChart from '../components/barchart';
import '../assets/css/myDashboard.css';

function History() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortBy, setSortBy] = useState('date'); // Default sorting option
    const [lineNumbers, setLineNumbers] = useState([]);
    const [selectedLineNumber, setSelectedLineNumber] = useState('');
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Piece Count',
                data: Array(10).fill(0),
                tension: 0,
                borderColor: ['#02c27a'],
                borderWidth: 0
            }
        ]
    });

    useEffect(() => {
        if (sortBy === 'lineNo') {
            fetchLineNumbers();
        }
    }, [sortBy]);

    const fetchLineNumbers = async () => {
        try {
            const response = await axios.get(`http://${process.env.REACT_APP_HOST_IP}/get/getLineNumbers`);
            setLineNumbers(response.data);
            console.log(lineNumbers)
        } catch (error) {
            console.error('Error fetching line numbers:', error);
        }
    };

    const getGradientFillStyle = (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);

        gradient.addColorStop(0, 'rgba(232,44,87,1)');  // Gradient start color
        gradient.addColorStop(1, 'rgb(246,147,49)');   // Gradient end color

        return gradient;
    };

    const fetchPieceCountData = async () => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getHistory`, {
                startDate,
                endDate,
                sortBy,
                lineNo: selectedLineNumber
            });
            const data = response.data;

            console.log(data);

            let labels = [];
            let datasets = {};
            let lastDate = null;

            data.forEach(entry => {
                const currentDate = new Date(entry.date).toLocaleDateString();

                // Check if the date has changed
                // if (lastDate && lastDate !== currentDate) {
                //     // Insert a placeholder for the vertical line or extra space
                //     labels.push('');
                //     Object.keys(datasets).forEach(operation => {
                //         datasets[operation].data.push(null);  // null or 0 can be used for spacing
                //     });
                // }

                if (!labels.includes(currentDate)) {
                    labels.push(currentDate);
                }

                if (!datasets[entry.operation]) {
                    const ctx = document.createElement('canvas').getContext('2d');
                    datasets[entry.operation] = {
                        label: entry.operation,
                        data: [],
                        backgroundColor: getGradientFillStyle(ctx),
                        tension: 0,
                        borderColor: getRandomColor(),
                        borderWidth: 0
                    };
                }

                datasets[entry.operation].data.push(entry.pieceCount);
                lastDate = currentDate;
            });

            setChartData({
                labels: labels,
                datasets: Object.values(datasets),
            });
        } catch (error) {
            console.error('Error fetching piece count data:', error);
        }
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <div className="content">
            <div className="row mt-5">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="sortBy">Sort By</label>
                        <select
                            id="sortBy"
                            className="form-control"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date">Date</option>
                            <option value="operation">Operation</option>
                            <option value="plantName">Plant Name</option>
                            <option value="lineNo">Line Number</option>
                        </select>
                    </div>
                </div>
                {sortBy === 'lineNo' && (
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="lineNo">Line Number</label>
                            <select
                                id="lineNo"
                                className="form-control"
                                value={selectedLineNumber}
                                onChange={(e) => setSelectedLineNumber(e.target.value)}
                            >
                                {lineNumbers.map((lineNo) => (
                                    <option key={lineNo} value={lineNo}>
                                        {lineNo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
                <div className="col-md-2 d-flex align-items-end">
                    <button onClick={fetchPieceCountData} className="btn btn-primary w-auto">Get Data</button>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col">
                    <div className="card-body p-xxl-3" style={{ padding: '5px' }}>
                        <div className="chart-container1 rounded-2 p-3" style={{ backgroundColor: '#252B3B' }}>
                            <BarChart canvasId="chart2-facebook" data={chartData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;