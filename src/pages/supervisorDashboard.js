import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import '../assets/css/adminHome.css';
import axios from 'axios';
import RadialBarChart from '../components/efficiency_guage';

function SupervisorDashboard() {

    const [lineNo1, setLineNo1] = useState();
    const [lineNo2, setLineNo2] = useState();
    const [lineNo3, setLineNo3] = useState();
    const [lineNo4, setLineNo4] = useState();
    const [Smv1, setSmv1] = useState();
    const [pieceCountInfo1, setPieceCountInfo1] = useState();
    const [latestHour1, setLatestHour1] = useState();
    const [Smv2, setSmv2] = useState();
    const [pieceCountInfo2, setPieceCountInfo2] = useState();
    const [latestHour2, setLatestHour2] = useState();
    const [Smv3, setSmv3] = useState();
    const [pieceCountInfo3, setPieceCountInfo3] = useState();
    const [latestHour3, setLatestHour3] = useState();
    const [Smv4, setSmv4] = useState();
    const [pieceCountInfo4, setPieceCountInfo4] = useState();
    const [latestHour4, setLatestHour4] = useState();

    useEffect(() => {
        // Fetch latest piece count on component mount
        getLinesOfSupervisors();

        const intervalId = setInterval(getLinesOfSupervisors, 100000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (lineNo1) {
            getSmv1();
            fetchLatestPieceCount1();
        }

        if (lineNo2) {
            getSmv2();
            fetchLatestPieceCount2();
        }

        if (lineNo3) {
            getSmv3();
            fetchLatestPieceCount3();
        }

        if (lineNo4) {
            getSmv4();
            fetchLatestPieceCount4();
        }

        const intervalId = setInterval(() => {
            if (lineNo1) {
                getSmv1();
                fetchLatestPieceCount1();
            }

            if (lineNo2) {
                getSmv2();
                fetchLatestPieceCount2();
            }

            if (lineNo3) {
                getSmv3();
                fetchLatestPieceCount3();
            }

            if (lineNo4) {
                getSmv4();
                fetchLatestPieceCount4();
            }
        }, 10000);

        return () => clearInterval(intervalId);
    }, [lineNo1, lineNo2, lineNo3, lineNo4]);


    const getSmv1 = async () => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getsmvByLine`, {
                lineNo: lineNo1
            });

            setSmv1(response.data.smv)
            console.log(Smv1)

        }
        catch (error) {
            console.error("Failed to shift pieces");
        }
    }

    const getSmv2 = async () => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getsmvByLine`, {
                lineNo: lineNo2
            });

            setSmv2(response.data.smv)
            console.log(Smv2)

        }
        catch (error) {
            console.error("Failed to shift pieces");
        }
    }

    const getSmv3 = async () => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getsmvByLine`, {
                lineNo: lineNo3
            });

            setSmv3(response.data.smv)

        }
        catch (error) {
            console.error("Failed to shift pieces");
        }
    }

    const getSmv4 = async () => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getsmvByLine`, {
                lineNo: lineNo4
            });

            setSmv4(response.data.smv)

        }
        catch (error) {
            console.error("Failed to shift pieces");
        }
    }

    const fetchLatestPieceCount1 = async () => {

        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getPieceCountByLine`, {
                lineNo: lineNo1
            });

            setPieceCountInfo1(response.data.totalPieceCount);
            setLatestHour1(response.data.latestHour);
        } catch (error) {
            console.error('Error fetching latest Piece count data:', error);
        }
    };

    const fetchLatestPieceCount2 = async () => {

        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getPieceCountByLine`, {
                lineNo: lineNo2
            });

            setPieceCountInfo2(response.data.totalPieceCount);
            setLatestHour2(response.data.latestHour);
        } catch (error) {
            console.error('Error fetching latest Piece count data:', error);
        }
    };

    const fetchLatestPieceCount3 = async () => {

        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getPieceCountByLine`, {
                lineNo: lineNo3
            });

            setPieceCountInfo3(response.data.totalPieceCount);
            setLatestHour3(response.data.latestHour);
        } catch (error) {
            console.error('Error fetching latest Piece count data:', error);
        }
    };

    const fetchLatestPieceCount4 = async () => {

        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getPieceCountByLine`, {
                lineNo: lineNo4
            });

            setPieceCountInfo4(response.data.totalPieceCount);
            setLatestHour4(response.data.latestHour);
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
            setLineNo1(response.data.lineNos[0])
            setLineNo2(response.data.lineNos[1])
            setLineNo3(response.data.lineNos[2])
            setLineNo4(response.data.lineNos[3])

        } catch (error) {
            console.error('Error fetching latest Piece count data:', error);
        }
    };

    return (
        <div className="content">
            <div className='row'>
                <div className="col">
                    <div className="card rounded-4">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between flex-wrap">
                                <div className="d-flex flex-column align-items-center justify-content-center gap-1 mx-auto">
                                    <div style={{ width: '13rem' }}>
                                        <RadialBarChart Smv={Smv1} pieceCount={pieceCountInfo1} latestHour={latestHour1} />
                                    </div>
                                </div>
                                <div className="align-items-center justify-content-center gap-2">
                                    <p className="mb-0 w-auto text-bg-dark">LineNo - {lineNo1 && lineNo1}</p>
                                    <p className="mb-0 w-auto text-bg-dark">PieceCount - {pieceCountInfo1 && pieceCountInfo1}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card rounded-4">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between flex-wrap">
                                <div className="d-flex flex-column align-items-center justify-content-center mx-auto">
                                    <div style={{ width: '13rem' }}>
                                        <RadialBarChart Smv={Smv2} pieceCount={pieceCountInfo2} latestHour={latestHour2} />
                                    </div>

                                </div>
                                <div className="align-items-center justify-content-center gap-2">
                                    <p className="mb-0 w-auto text-bg-dark">LineNo - {lineNo2 && lineNo2}</p>
                                    <p className="mb-0 w-auto text-bg-dark">PieceCount - {pieceCountInfo2 && pieceCountInfo2}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                {lineNo3 && <div className="col">
                    <div className="card rounded-4 h-80">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                <div className="d-flex flex-column align-items-center justify-content-center gap-1 mx-auto">
                                    <div style={{ width: '13rem' }}>
                                        <RadialBarChart Smv={Smv3} pieceCount={pieceCountInfo3} latestHour={latestHour3} />
                                    </div>
                                </div>
                                <div className="align-items-center justify-content-center gap-2">
                                    <p className="mb-0 w-auto text-bg-dark">LineNo - {lineNo3 && lineNo3}</p>
                                    <p className="mb-0 w-auto text-bg-dark">PieceCount - {pieceCountInfo3 && pieceCountInfo3}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                {lineNo4 && <div className="col">
                    <div className="card rounded-4 h-80">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                <div className="d-flex flex-column align-items-center justify-content-center gap-1 mx-auto">
                                    <div style={{ width: '13rem' }}>
                                        <RadialBarChart Smv={Smv4} pieceCount={pieceCountInfo4} latestHour={latestHour4} />
                                    </div>
                                </div>
                                <div className="align-items-center justify-content-center gap-2">
                                    <p className="mb-0 w-auto text-bg-dark">LineNo - {lineNo4 && lineNo4}</p>
                                    <p className="mb-0 w-auto text-bg-dark">PieceCount - {pieceCountInfo4 && pieceCountInfo4}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>
        </div>
    )
}

export default SupervisorDashboard;