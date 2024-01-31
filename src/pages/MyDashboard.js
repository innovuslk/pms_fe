import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from '../components/navbar';
import BarChart from '../components/barchart';
import RadialBarChart from '../components/efficiency_guage';
import Modal from '../components/Modals/pieceCountModal';
import axios from 'axios';
import Deviation from '../components/Deviation';
import LineEndPieceCount from '../components/LineEndPieceCount';
import DailyTarget from '../components/DailyTarget';


function MyDashboard() {

    const [showModal, setShowModal] = useState(false);
    const [dashboardPieceCount, setDashboardPieceCount] = useState(0);
    const [username, setUsername] = useState();
    const [shift, setShift] = useState();
    const [pieceCountInfo, setPieceCountInfo] = useState();
    const [latestHour, setLatestHour] = useState('');
    const [requiredRate, setRequiredRate] = useState(0);
    const [svm, setSvm] = useState(0);

    useEffect(() => {
        // Fetch latest piece count on component mount
        fetchLatestPieceCount();

        const intervalId = setInterval(fetchLatestPieceCount, 5000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        getShift();

        const intervalId = setInterval(getShift, 5000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        getBarChartData();

        const intervalId = setInterval(getBarChartData, 10000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        getSvm();

        const intervalId = setInterval(getSvm, 20000);

        return () => clearInterval(intervalId);
    }, []);




    const [pieceCountData, setPieceCountData] = useState({
        labels: ["08.20", "08.40", "09.40", "10.40", "12.00", "13.00", "14.00", "15.00", "16.00", "17.00"],
        datasets: [
            {
                label: 'Piece Count',
                data: Array(10).fill(0),
                tension: 0,
                borderColor: ['#02c27a'],
                borderWidth: 0
            },
            {
                label: 'Piece Count',
                data: Array(10).fill(0),
                tension: 0,
                borderColor: ['#02c27a'],
                borderWidth: 0
            }
        ]
    },[requiredRate]);

    const options = {
        scales: {
            x: {
                type: '', 
                position: 'bottom',
                min: 8.2, 
                max: 17.0, // set the maximum value for the x-axis
                stepSize: 1, // set the step size between labels
                callback: function (value, index) {
                    return value % 1 === 0 ? `${value}.40` : ''; // customize label display
                }
            },
            // other scales if needed
        }
    };

    const receiveDataFromChild = (data) => {
        setRequiredRate(data);
    };


    const handleAddPieceCountClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const fetchLatestPieceCount = async () => {
        const username = window.location.pathname.split('/').pop();
        setUsername(username);

        try {
            const response = await axios.post('http://localhost:5000/set/getPieceCount', {
                username: username,
            });

            setPieceCountInfo(response.data.totalPieceCount);
            setLatestHour(response.data.latestHour);
        } catch (error) {
            console.error('Error fetching latest Piece count data:', error);
        }
    };

    const getShift = async () => {
        try {
            const username = window.location.pathname.split('/').pop();
            setUsername(username);
            const response = await axios.post('http://localhost:5000/get/getShift', {
                username: username,
            });
            setShift(response.Shift)

        }
        catch (error) {
            console.error("Failed to shift pieces");
        }
    }

    const getBarChartData = async () => {

        try {
            const response = await axios.post('http://localhost:5000/get/getDataForBarChart',{
                operatorType:'operator'
            });
            const response2 = await axios.post('http://localhost:5000/get/getDataForBarChart',{
                operatorType:'LineEnd'
            });
            const labels = ["08.20", "08.40", "09.40", "10.40", "12.00", "13.00", "14.00", "15.00", "16.00", "17.00"];

            const getGradientFillStyle = () => {
                const ctx = document.createElement('canvas').getContext('2d');
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            
                gradient.addColorStop(0, 'rgba(232,44,87,1)');  // Gradient start color
                gradient.addColorStop(1, 'rgb(246,147,49)');   // Gradient end color
                
                return gradient;
            };

            const getGradientFillStyle2 = () => {
                const ctx = document.createElement('canvas').getContext('2d');
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            
                gradient.addColorStop(0, 'rgba(103,59,183,1)');  // Gradient start color
                gradient.addColorStop(1, 'rgb(35,148,242)');   // Gradient end color
                
                return gradient;
            };
            
            const newData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Piece Count',
                        data: [],
                        backgroundColor:getGradientFillStyle(),
                        tension: 0,
                        borderColor: ['#02c27a'],
                        borderWidth: 0,
                        order:2
                    },
                    {
                        label: 'Line End Piece Count',
                        data: [],
                        backgroundColor:getGradientFillStyle2(),
                        tension: 0,
                        borderColor: ['#02c27a'],
                        borderWidth: 0,
                        order:2
                    },
                    {
                        label: 'Required Rate',
                        data: [requiredRate,requiredRate,requiredRate,requiredRate,requiredRate,requiredRate,requiredRate,requiredRate,requiredRate,requiredRate],
                        backgroundColor:'#ff7588',
                        tension: 0,
                        borderColor: ['#ff7588'],
                        borderWidth: 1,
                        type:'line',
                        order:1
                    }
                ]
            };
    
            // Accessing the totalPieceCountByHour object from the response
            const totalPieceCountByHour = response.data.totalPieceCountByHour;

            Object.keys(totalPieceCountByHour).forEach(hour => {
                const pieceCountForHour = totalPieceCountByHour[hour];
                console.log(`${hour}: ${pieceCountForHour}`);
                newData.datasets[0].data.push(pieceCountForHour);
            });

            const totalLineEndPieceCountByHour = response2.data.totalPieceCountByHour;

            Object.keys(totalLineEndPieceCountByHour).forEach(hour => {
                const pieceCountForHour = totalLineEndPieceCountByHour[hour];
                console.log(`${hour}: ${pieceCountForHour}`);
                newData.datasets[1].data.push(pieceCountForHour);
            });
    
    
            // Setting the new data to the state
            setPieceCountData(newData);

        } catch (error) {
            console.error("Failed to get barchart data", error);
        }
    };

    const getSvm = async () => {
        try {
            const username = window.location.pathname.split('/').pop();
            setUsername(username);
            const response = await axios.post('http://localhost:5000/get/getSvm', {
                username: username,
            });

            console.log("svm response",response)
            setSvm(response.data.Svm)

        }
        catch (error) {
            console.error("Failed to shift pieces");
        }
    }






    return (
        <html lang="en" data-bs-theme="dark">
            <body>
                <Navbar />
                <div className='container-fluid'>

                    <div className='row mx-2 mt-3'>
                        <div className='col-3 col-md-4' style={{ height: '100dvh' }}>
                            <div className='row'>
                                <div className="col">
                                    <div className="card rounded-4">
                                        <div className="card-body align-items-center justify-content-center">
                                            <div className="d-flex align-items-center justify-content-around flex-wrap gap-2 p-1">
                                                <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                    <h3 className="mb-0">{(pieceCountInfo) || '0'}</h3>
                                                    <p className="mb-0">Pieces</p>
                                                </div>
                                                <div className="vr"></div>
                                                <Deviation shift={shift} latestHour={latestHour} pieceCount={pieceCountInfo} sendDataToParent={receiveDataFromChild} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col">
                                    <div className="card rounded-4 h-80">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                                <div className="d-flex flex-column align-items-center justify-content-center gap-1 mx-auto">
                                                    <div style={{ width: '13rem' }}>
                                                        <RadialBarChart svm = {svm} pieceCount={pieceCountInfo} latestHour = {latestHour}/>
                                                    </div>
                                                    <h3 className="mb-0 gap-1">20</h3>
                                                    <p>Deviation</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col">
                                    <div className="card rounded-4">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center justify-content-around flex-wrap gap-2 p-1">
                                                <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                    <h3 className="mb-0">10</h3>
                                                    <p className="mb-0">Best Cycle</p>
                                                </div>
                                                <div className="vr"></div>
                                                <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                    <h3 className="mb-0">10</h3>
                                                    <p className="mb-0">Avg Cycle</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col">
                                    <div className="card rounded-4">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center justify-content-around flex-wrap gap-2 p-1">
                                                <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                    <h3 className="mb-0">10</h3>
                                                    <p className="mb-0">GSD Piece Rate</p>
                                                </div>
                                                <div className="vr"></div>
                                                <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                    <h3 className="mb-0">10</h3>
                                                    <p className="mb-0">Target Piece Rate</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col">
                                    <div className="card rounded-4">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center justify-content-around flex-wrap gap-2 p-1">
                                                <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                    <h3 className="mb-0">10</h3>
                                                    <p className="mb-0">My Best</p>
                                                </div>
                                                <div className="vr"></div>
                                                <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                    <h3 className="mb-0">10</h3>
                                                    <p className="mb-0">MAS Best</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-6 mx-4'>
                            <div className='row'>
                                <div className="card border-primary border-bottom rounded-4">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-around mt-2">
                                            <div className="d-flex flex-column align-items-center justify-content-center">
                                                <h4 className="mb-0 fw-bold">{requiredRate || '0'}</h4>
                                                <div className="d-flex align-items-center justify-content-center gap-1 text-success mt-1">
                                                    <span className="material-symbols-outlined">
                                                        trending_up
                                                    </span>
                                                    <p className="mb-0 fs-6">Required Rate</p>
                                                </div>
                                            </div>
                                            <div className="vr"></div>
                                            <LineEndPieceCount />
                                            <div className="vr"></div>
                                            <DailyTarget/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="card border-primary border-bottom rounded-4 bg-success">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between mt-3">
                                            <div className="">
                                                <h4 className="mb-0 fw-bold">Status</h4>
                                                <div className="d-flex align-items-center justify-content-start gap-1 text-dark mt-3">
                                                    <span className="material-symbols-outlined">
                                                        thumb_up
                                                    </span>
                                                    <p className="mb-0 fs-6">OK</p>
                                                </div>
                                            </div>
                                            <div id="chart1"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="card">
                                    <div className="card-header py-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h5 className="mb-0">Hourly Output</h5>

                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="chart-container1">
                                            <BarChart canvasId="chart2-facebook" data={pieceCountData} shift={shift} options={options} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col'>
                            <div className="row">
                                <button type="button" className="btn btn-warning col mb-4" style={{ height: "3rem", color: 'black', fontWeight: "600" }}>Downtime</button>
                            </div>
                            <div className="row">
                                <button type="button" className="btn btn-warning col mb-4" style={{ height: "3rem", color: 'black', fontWeight: "600" }}>Machine</button>
                            </div>
                            <div className="row">
                                <button type="button" className="btn btn-warning col mb-4" style={{ height: "3rem", color: 'black', fontWeight: "600" }}>Material</button>
                            </div>
                            <div className="row">
                                <button type="button" className="btn ripple btn-danger col mb-4" style={{ height: "3.5rem", fontWeight: "600" }}>Call Supervisor</button>
                            </div>
                            <div className="row">
                                <button type="button" className="btn ripple btn-danger col mb-4" style={{ height: "3rem", fontWeight: "600" }}>Man</button>
                            </div>
                            <div className="row">
                                <button type="button" className="btn ripple btn-danger col mb-4" style={{ height: "3rem", fontWeight: "600" }}>Machine</button>
                            </div>
                            <div className="row">
                                <button type="button" className="btn ripple btn-primary col mb-4" style={{ height: "3.5rem", fontWeight: "600", fontSize: "0.9rem" }} onClick={handleAddPieceCountClick}>Add Piece Count</button>
                            </div>
                        </div>
                    </div>
                </div>
                {showModal && <div className="modal-backdrop show"></div>}
                <Modal showModal={showModal} handleCloseModal={handleCloseModal} />
            </body>
        </html>
    )
}

export default MyDashboard;