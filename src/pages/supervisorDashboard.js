import React, { useState, useEffect } from 'react';
import '../assets/css/adminHome.css';
import axios from 'axios';
import SupervisorEfficiency from '../components/supervisorEfficiency';

function SupervisorDashboard() {

    const [linesData, setLinesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [plantsData, setPlantsData] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [selectedLine, setSelectedLine] = useState(null);
    const [dailyTarget, setDaillytarget] = useState();

    useEffect(() => {
        getPlantsOfSupervisor();
        const intervalId = setInterval(getPlantsOfSupervisor, 10000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (selectedPlant) {
            getLinesOfSupervisors(selectedPlant);
        }
    }, [selectedPlant]);

    useEffect(() => {
        if (selectedLine) {
            getUsersOfLine(selectedLine);
        }
    }, [selectedLine]);

    useEffect(() => {
        getDailyTarget();

        const intervalId = setInterval(getDailyTarget, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [dailyTarget]);

    const getLinesOfSupervisors = async (plantName) => {
        const username = window.location.pathname.split('/').pop();

        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getSvLineNo`, {
                username: username,
                plantName: plantName
            });
            const lineNos = response.data.linePieceCounts;
            const newLinesData = lineNos.map(({ lineNo, pieceCount, latestHour, style, salesOrder }) => ({
                lineNo: lineNo,
                smv: null,
                totalPieceCount: pieceCount,
                latestHour: latestHour,
                style: style,
                salesOrder: salesOrder
            }));

            setLinesData(newLinesData);
        } catch (error) {
            console.error('Error fetching line numbers:', error);
        } finally {
            setLoading(false);
        }
    };

    const getUsersOfLine = async (lineNo) => {
        const username = window.location.pathname.split('/').pop();

        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getSvLineUsers`, {
                username: username,
                lineNo: lineNo
            });
            const usernames = response.data;
            setUsers(usernames);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPlantsOfSupervisor = async () => {
        const username = window.location.pathname.split('/').pop();

        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getSvPlant`, {
                username: username,
            });
            const plantNames = response.data.plantNames;
            setPlantsData(plantNames);
        } catch (error) {
            console.error('Error fetching plant names:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDailyTarget = async () => {
        try {
            const username = window.location.pathname.split('/').pop();
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getSupervisorDailyTarget`, {
                username: username
            });
            setDaillytarget(response.data.dailyTargets);
        } catch (error) {
            console.error("Failed to dailyTarget");
        }
    };

    const encodeCredentials = (username) => {
        const encodedUsername = btoa(username);
        return { encodedUsername };
    };

    return (
        <div className="content">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {selectedPlant ? (
                        <>
                            {(selectedPlant && !selectedLine) && <button className='btn btn-close' onClick={() => setSelectedPlant(null)}></button>}
                            <div className="row">
                                {linesData.map((line, index) => (
                                    index % 2 === 0 &&
                                    <div key={index} className={selectedLine ? 'd-none' : 'row'}>
                                        {linesData[index] && (
                                            <div className="col">
                                                <div className="card rounded-4 cursor-pointer" onClick={() => setSelectedLine(linesData[index].lineNo)}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                            <div className="d-flex flex-column align-items-center justify-content-center gap-1 mx-auto">
                                                                <div style={{ width: '13rem' }}>
                                                                    <h3 className='text-center'>Efficiency</h3>
                                                                    <SupervisorEfficiency pieceCount={linesData[index].totalPieceCount} dailyTarget={dailyTarget.find(target => target.lineNo === linesData[index].lineNo)?.dailyTarget} latestHour={linesData[index].latestHour} />
                                                                </div>
                                                            </div>
                                                            <div className="align-items-center justify-content-center gap-2">
                                                                <p className="mb-0 w-auto text-bg-dark text-warning fw-bolder mb-1 cursor-pointer" onClick={() => setSelectedLine(linesData[index].lineNo)}>LineNo - {linesData[index].lineNo}</p>
                                                                <p className="mb-0 w-auto text-bg-dark mb-1">PieceCount - {linesData[index].totalPieceCount}</p>
                                                                <p className="mb-0 w-auto text-bg-dark mb-1">SalesOrder - {linesData[index].salesOrder}</p>
                                                                <p className="mb-0 w-auto text-bg-dark mb-1">Style - {linesData[index].style}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {linesData[index + 1] && (
                                            <div className="col">
                                                <div className="card rounded-4 cursor-pointer" onClick={() => setSelectedLine(linesData[index + 1].lineNo)}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                            <div className="d-flex flex-column align-items-center justify-content-center gap-1 mx-auto">
                                                                <div style={{ width: '13rem' }}>
                                                                    <h3 className='text-center'>Efficiency</h3>
                                                                    <SupervisorEfficiency pieceCount={linesData[index + 1].totalPieceCount} dailyTarget={dailyTarget} latestHour={linesData[index + 1].latestHour} />
                                                                </div>
                                                            </div>
                                                            <div className="align-items-center justify-content-center gap-2">
                                                                <p className="mb-0 w-auto text-bg-dark cursor-pointer text-warning fw-bolder mb-1" onClick={() => setSelectedLine(linesData[index + 1].lineNo)}>LineNo - {linesData[index + 1].lineNo}</p>
                                                                <p className="mb-0 w-auto text-bg-dark">PieceCount - {linesData[index + 1].totalPieceCount}</p>
                                                                <p className="mb-0 w-auto text-bg-dark mb-1">SalesOrder - {linesData[index + 1].salesOrder}</p>
                                                                <p className="mb-0 w-auto text-bg-dark mb-1">Style - {linesData[index + 1].style}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="row">
                            <div className="col-3">
                                <div className="card rounded-4">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between flex-wrap text-center cursor-pointer">
                                            {plantsData.map((plantName, index) => (
                                                <div key={index} className="card rounded-2 bg-secondary text-center cursor-pointer text-bg-dark p-1" onClick={() => setSelectedPlant(plantName)}>
                                                    Plant - {plantName}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {selectedLine && (
                        <div className="row g-3">
                            <div className="col-10">
                                <button className='btn btn-close mb-3' onClick={() => setSelectedLine(null)}></button>
                                <div className="card rounded-4 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">Operators of Line {selectedLine}</h5>
                                        <hr className='text-secondary'></hr>
                                        {users.map((user, index) => {
                                            const { encodedUsername } = encodeCredentials(user.username);
                                            return (
                                                <div key={index} className="p-2 mb-2 border rounded bg-light">
                                                    <span className='me-3'>{index + 1} - </span>
                                                    <strong className='text-info'>{user.username}</strong> - PieceCount: {user.totalPieceCount}
                                                    ----<a href={`http://${process.env.REACT_APP_HOST_IP2}/user-info/${encodedUsername}&admin=true`} target="_blank"> Dashboard Link
                                                    </a>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default SupervisorDashboard;