import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../assets/css/adminHome.css';
import axios from 'axios';
import BarChart from '../components/barchart';
import '../assets/css/myDashboard.css';

function History() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
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

    const getGradientFillStyle = () => {
        const ctx = document.createElement('canvas').getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);

        gradient.addColorStop(0, 'rgba(232,44,87,1)');  // Gradient start color
        gradient.addColorStop(1, 'rgb(246,147,49)');   // Gradient end color

        return gradient;
    };

    const fetchPieceCountData = async () => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getHistory`, {
                startDate,
                endDate
            });
            const data = response.data;
            const labels = data.map(entry => new Date(entry.date).toLocaleDateString());
            const pieceCounts = data.map(entry => entry.pieceCount);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Piece Count',
                        data: pieceCounts,
                        backgroundColor: getGradientFillStyle(),
                        tension: 0,
                        borderColor: ['#02c27a'],
                        borderWidth: 0
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching piece count data:', error);
        }
    };

    return (
        <div className="content">
            <div className="row mt-5">
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4 d-flex align-items-end">
                    <button onClick={fetchPieceCountData} className="btn btn-primary w-auto">Get Data</button>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col">
                    <div className="card-body p-xxl-3" style={{ padding: '5px' }}>
                        <div className="chart-container1 rounded-2 p-3" style={{backgroundColor: '#252B3B'}}>
                            <BarChart canvasId="chart2-facebook" data={chartData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;
