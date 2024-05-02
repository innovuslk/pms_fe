import React, { useState, useEffect } from 'react';
import '../assets/css/adminHome.css';
import axios from 'axios';
import RadialBarChart from '../components/efficiency_guage';

function SupervisorDashboard() {

    const [linesData, setLinesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLinesOfSupervisors();
        const intervalId = setInterval(getLinesOfSupervisors, 10000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (!loading) {
            linesData.forEach((line) => {
                if (line.lineNo) {
                    getSmv(line.lineNo);
                    fetchLatestPieceCount(line.lineNo);
                }
            });

            const intervalId = setInterval(() => {
                linesData.forEach((line) => {
                    if (line.lineNo) {
                        getSmv(line.lineNo);
                        fetchLatestPieceCount(line.lineNo);
                    }
                });
            }, 10000);

            return () => clearInterval(intervalId);
        }
    }, [loading, linesData]);

    const getSmv = async (lineNo) => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getsmvByLine`, {
                lineNo: lineNo
            });

            const updatedLinesData = linesData.map((line) =>
                line.lineNo === lineNo ? { ...line, smv: response.data.smv } : line
            );
            setLinesData(updatedLinesData);
            console.log(linesData)
        } catch (error) {
            console.error("Failed to shift pieces");
        }
    }

    const fetchLatestPieceCount = async (lineNo) => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getPieceCountByLine`, {
                lineNo: lineNo
            });
            const updatedLinesData = linesData.map((line) =>
                line.lineNo === lineNo
                    ? {
                        ...line,
                        totalPieceCount: response.data.totalPieceCount,
                        latestHour: response.data.latestHour
                    }
                    : line
            );
            setLinesData(updatedLinesData);
            console.log(updatedLinesData)
        } catch (error) {
            console.error('Error fetching latest Piece count data:', error);
        }
    };

    const getLinesOfSupervisors = async () => {
        const username = window.location.pathname.split('/').pop();

        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getSvLineNo`, {
                username: username,
            });
            const lineNos = response.data.lineNos;
            const newLinesData = lineNos.map((lineNo) => ({
                lineNo: lineNo,
                smv: null,
                totalPieceCount: null,
                latestHour: null
            }));
            setLinesData(newLinesData);
            setLoading(false); // Set loading to false when data is fetched
        } catch (error) {
            console.error('Error fetching latest Piece count data:', error);
        }
    };

    return (
        <div className="content">
            {loading ? (
                <p>Loading...</p>
            ) : (
                linesData.map((line, index) => (
                    index % 2 === 0 && 
                    <div key={index} className="row">
                        {linesData[index] && 
                            <div className="col">
                                <div className="card rounded-4">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                            <div className="d-flex flex-column align-items-center justify-content-center gap-1 mx-auto">
                                                <div style={{ width: '13rem' }}>
                                                    <RadialBarChart Smv={linesData[index].smv} pieceCount={linesData[index].totalPieceCount} latestHour={linesData[index].latestHour} />
                                                </div>
                                            </div>
                                            <div className="align-items-center justify-content-center gap-2">
                                                <p className="mb-0 w-auto text-bg-dark">LineNo - {linesData[index].lineNo}</p>
                                                <p className="mb-0 w-auto text-bg-dark">PieceCount - {linesData[index].totalPieceCount}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {linesData[index + 1] && 
                            <div className="col">
                                <div className="card rounded-4">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                            <div className="d-flex flex-column align-items-center justify-content-center gap-1 mx-auto">
                                                <div style={{ width: '13rem' }}>
                                                    <RadialBarChart Smv={linesData[index + 1].smv} pieceCount={linesData[index + 1].totalPieceCount} latestHour={linesData[index + 1].latestHour} />
                                                </div>
                                            </div>
                                            <div className="align-items-center justify-content-center gap-2">
                                                <p className="mb-0 w-auto text-bg-dark">LineNo - {linesData[index + 1].lineNo}</p>
                                                <p className="mb-0 w-auto text-bg-dark">PieceCount - {linesData[index + 1].totalPieceCount}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                ))
            )}
        </div>
    )
}

export default SupervisorDashboard;
