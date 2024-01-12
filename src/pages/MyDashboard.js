import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from '../components/navbar';
import BarChart from '../components/barchart';
import RadialBarChart from '../components/efficiency_guage';
import Modal from '../components/Modals/pieceCountModal';
import axios from 'axios';


function MyDashboard() {

    const [showModal, setShowModal] = useState(false);
    const [dashboardPieceCount, setDashboardPieceCount] = useState('');


    const handleAddPieceCountClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePieceCountUpdate = (newPieceCount) => {
        setDashboardPieceCount((prevPieceCount) => {
            const parsedPrevPieceCount = parseInt(prevPieceCount, 10) || 0;
            const parsedNewPieceCount = parseInt(newPieceCount, 10) || 0;
            const updatedPieceCount = parsedPrevPieceCount + parsedNewPieceCount;
            return updatedPieceCount;
        });
    };

    const facebookData = {
        labels: ["08.00", "09.00", "10.00", "11.00", "12.00", "13.00", "14.00"],
        datasets: [
            {
                label: 'Piece Count',
                data: [12, 30, 16, 23, 8, 14, 11],
                backgroundColor: ['#0d6efd'],
                tension: 0,
                borderColor: ['#02c27a'],
                borderWidth: 0
            }
        ]
    };

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
                                                    <h3 className="mb-0">{(dashboardPieceCount && dashboardPieceCount) || '0'}</h3>
                                                    <p className="mb-0">Pieces</p>
                                                </div>
                                                <div className="vr"></div>
                                                <div className="d-flex flex-column align-items-center justify-content-center gap-2 ">
                                                    <h3 className="mb-0">20</h3>
                                                    <p className="mb-0">Deviation</p>
                                                </div>
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
                                                        <RadialBarChart />
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
                                        <div className="d-flex align-items-center justify-content-between mt-3">
                                            <div className="">
                                                <h4 className="mb-0 fw-bold">20</h4>
                                                <div className="d-flex align-items-center justify-content-start gap-1 text-success mt-3">
                                                    <span className="material-symbols-outlined">
                                                        trending_up
                                                    </span>
                                                    <p className="mb-0 fs-6">Required Rate</p>
                                                </div>
                                            </div>
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
                                        <div classNameName="chart-container1">
                                            <BarChart canvasId="chart2-facebook" data={facebookData} />
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
                <Modal showModal={showModal} handleCloseModal={handleCloseModal} onPieceCountUpdate={handlePieceCountUpdate} />
            </body>
        </html>
    )
}

export default MyDashboard;