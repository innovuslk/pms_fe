import React, { useState, useEffect } from 'react';
import '../assets/css/adminHome.css';
import axios from 'axios';
import RadialBarChart from '../components/efficiency_guage';

function SupervisorDashboard() {

    const [linesData, setLinesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [plantsData, setPlantsData] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [selectedLine, setSelectedLine] = useState(null);

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

    const getLinesOfSupervisors = async (plantName) => {
        const username = window.location.pathname.split('/').pop();

        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getSvLineNo`, {
                username: username,
                plantName: plantName
            });
            const lineNos = response.data.lineNos;
            const newLinesData = lineNos.map((lineNo) => ({
                lineNo: lineNo,
                smv: null,
                totalPieceCount: null,
                latestHour: null
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
            const usernames = response.data.usernames;
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
                                        {linesData[index] &&
                                            <div className="col">
                                                <div className="card rounded-4 cursor-pointer" onClick={() => setSelectedLine(linesData[index].lineNo)}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                            <div className="d-flex flex-column align-items-center justify-content-center gap-1 mx-auto">
                                                                <div style={{ width: '13rem' }}>
                                                                    <RadialBarChart Smv={linesData[index].smv} pieceCount={linesData[index].totalPieceCount} latestHour={linesData[index].latestHour} />
                                                                </div>
                                                            </div>
                                                            <div className="align-items-center justify-content-center gap-2">
                                                                <p className="mb-0 w-auto text-bg-dark cursor-pointer" onClick={() => setSelectedLine(linesData[index].lineNo)}>LineNo - {linesData[index].lineNo}</p>
                                                                <p className="mb-0 w-auto text-bg-dark">PieceCount - {linesData[index].totalPieceCount}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {linesData[index + 1] &&
                                            <div className="col">
                                                <div className="card rounded-4 cursor-pointer" onClick={() => setSelectedLine(linesData[index + 1].lineNo)}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                            <div className="d-flex flex-column align-items-center justify-content-center gap-1 mx-auto">
                                                                <div style={{ width: '13rem' }}>
                                                                    <RadialBarChart Smv={linesData[index + 1].smv} pieceCount={linesData[index + 1].totalPieceCount} latestHour={linesData[index + 1].latestHour} />
                                                                </div>
                                                            </div>
                                                            <div className="align-items-center justify-content-center gap-2">
                                                                <p className="mb-0 w-auto text-bg-dark cursor-pointer" onClick={() => setSelectedLine(linesData[index + 1].lineNo)}>LineNo - {linesData[index + 1].lineNo}</p>
                                                                <p className="mb-0 w-auto text-bg-dark">PieceCount - {linesData[index + 1].totalPieceCount}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
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
                                                <div key={index} className="text-center cursor-pointer" onClick={() => setSelectedPlant(plantName)}>
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
                        <div className="row">
                            <div className="col-10">
                            <button className='btn btn-close' onClick={() => setSelectedLine(null)}></button>
                                <div className="card rounded-4">
                                    <div className="card-body">
                                        <h5>Users of Line {selectedLine}</h5>
                                        {users.map((user, index) => (
                                            <div key={index}>{user}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    ) }
                </>
            )}
        </div>
    )
}

export default SupervisorDashboard;
