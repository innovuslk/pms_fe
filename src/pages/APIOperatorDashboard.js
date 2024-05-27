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
import '../assets/css/myDashboard.css';
import AvgCycle from '../components/avgCycle';
import { useNavigate } from 'react-router-dom'
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from '../i18n';
import CallSupervisor from '../components/callSupervisor';


function OperatorDashboard() {

    const { t } = useTranslation();

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [Username, setUsername] = useState();
    const [shift, setShift] = useState();
    const [pieceCountInfo, setPieceCountInfo] = useState();
    const [latestHour, setLatestHour] = useState('');
    const [requiredRate, setRequiredRate] = useState(0);
    const [Smv, setSmv] = useState(0);
    const [downtimeClicked, setDowntimeClicked] = useState(false);
    const [machineClicked, setMachineClicked] = useState(false);
    const [finalTimerValue, setFinalTimerValue] = useState();
    const [timerInterval, setTimerInterval] = useState();
    const [downtimeStartTime, setDowntimeStartTime] = useState(null);
    const [downtimeEndTime, setDowntimeEndTime] = useState(null);
    const [GSDPieceRate, setGSDPieceRate] = useState()
    const [dailyTarget, setDaillytarget] = useState();
    const [language, setLanguage] = useState();
    // const [ connection , setConnection] = useState(navigator.onLine ? "online" : "offline"); 

    const [timer, setTimer] = useState(0);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setTimeout(() => {
                navigate(`/`);
            });
            return;
        }

        axios.get(`http://${process.env.REACT_APP_HOST_IP}/verifyToken`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.status == 200) {
                    console.log("Verification Successful")
                }
            })
            .catch(error => {
                setTimeout(() => {
                    navigate('/');
                    console.log(error)
                });
            });
    }, []);

    useEffect(() => {
        let intervalId;

        if (downtimeClicked || machineClicked) {
            // Start the timer when downtimeClicked is true
            intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);

            setTimerInterval(intervalId);
        } else {

            clearInterval(intervalId);
            // Use the callback version to get the current state value
            setTimer((prevTimer) => {
                setFinalTimerValue(prevTimer);
                setTimer(0);
                setTimerInterval(null);
            });
        }


        return () => clearInterval(intervalId);
    }, [downtimeClicked, machineClicked]);

    useEffect(() => {
        // Fetch latest piece count on component mount
        fetchLatestPieceCount();

        const intervalId = setInterval(fetchLatestPieceCount, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        // Fetch latest piece count on component mount
        let gsd = calculateGSDPieceRate(Smv);

        setGSDPieceRate(gsd)

        const intervalId = setInterval(calculateGSDPieceRate, 10000);

        return () => clearInterval(intervalId);
    }, [Smv]);

    useEffect(() => {
        getShift();

        const intervalId = setInterval(getShift, 5000);

        return () => clearInterval(intervalId);
    }, [shift]);

    useEffect(() => {
        getBarChartData();

        const intervalId = setInterval(getBarChartData, 10000);

        return () => clearInterval(intervalId);
    }, [requiredRate, shift, pieceCountInfo]);

    useEffect(() => {
        getSmv();

        const intervalId = setInterval(getSmv, 20000);

        return () => clearInterval(intervalId);
    }, []);

    const handleStopTimerClick = async () => {
        setDowntimeClicked(false);
        setMachineClicked(false);

        const downtimeEndTime = new Date();

        downtimeEndTime.setTime(downtimeEndTime.getTime() + (5.5 * 60 * 60 * 1000));

        try {
            const username = window.location.pathname.split('/').pop();
            setUsername(username);
            await axios.post(`http://${process.env.REACT_APP_HOST_IP}/update/updateEndTime`, {
                username: username,
                type: machineClicked ? 'Machine' : 'Material',
                endTime: downtimeEndTime.toISOString().slice(0, 19).replace('T', ' '),
            });

        } catch (error) {
            console.error("Failed to send downTime", error);
        }
        // Clear the interval to stop the timer
        clearInterval(timerInterval);
        // Set the final timer value
        setFinalTimerValue(timer);
        // Reset the timer value to 0
        setTimer(0);
    };


    const handleDowntimeClick = async (type) => {
        switch (type) {
            case 'Material':
                setDowntimeClicked(true);
                setDowntimeStartTime(new Date());
                break;
            case 'Machine':
                setMachineClicked(true);
                setDowntimeStartTime(new Date());
                break;
            default:
                break;
        }

        if (type === 'Material' || type === 'Machine') {
            try {
                downtimeStartTime.setTime(downtimeStartTime.getTime() + (5.5 * 60 * 60 * 1000));
                const username = window.location.pathname.split('/').pop();
                setUsername(username);
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/send/downTime`, {
                    username: username,
                    type: type,
                    downTime: timer,
                    startTime: downtimeStartTime.toISOString().slice(0, 19).replace('T', ' '),
                });
                console.log(response);

                // Handle response if needed
            } catch (error) {
                console.error("Failed to send downTime", error);
                // Handle error (e.g., display an error message)
            }
        }
    };


    const [pieceCountData, setPieceCountData] = useState({
        labels: ["06.00", "06.20", "07.20", "08.20", "09.40", "10.40", "11.00", "12.00", "13.00", "14.00"],
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
    }, [requiredRate, shift]);

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

    const receiveDataFromChild = (requiredRate, dailyTarget) => {
        setRequiredRate(requiredRate);
        setDaillytarget(dailyTarget)
    };


    const handleAddPieceCountClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const [pieceCounts, setPieceCounts] = useState({
        "06:00": 0,
        "06:20": 0,
        "07:20": 0,
        "08:20": 0,
        "09:40": 0,
        "10:40": 0,
        "11:00": 0,
        "12:00": 0,
        "13:00": 0,
        "14:00": 0
    });
    
    const fetchLatestPieceCount = async () => {
        const now = new Date();
        let start, end;

        const username = window.location.pathname.split('/').pop();
    
        // Define the time slots
        const timeSlots = [
            { start: "06:00", end: "06:20", label: "1st Hour" },
            { start: "06:20", end: "07:20", label: "2nd Hour" },
            { start: "07:20", end: "08:20", label: "3rd Hour" },
            { start: "08:20", end: "09:40", label: "4th Hour" },
            { start: "09:40", end: "10:40", label: "5th Hour" },
            { start: "10:40", end: "11:00", label: "6th Hour" },
            { start: "11:00", end: "12:00", label: "7th Hour" },
            { start: "12:00", end: "13:00", label: "8th Hour" },
            { start: "13:00", end: "14:00", label: "9th Hour" }
        ];
    
        // Find the current time slot
        const currentSlot = timeSlots.find(slot => {
            const slotStart = new Date(now.toDateString() + " " + slot.start);
            const slotEnd = new Date(now.toDateString() + " " + slot.end);
            return now >= slotStart && now <= slotEnd;
        });
    
        if (currentSlot) {
            start = new Date(now.toDateString() + " " + currentSlot.start);
            end = new Date(now.toDateString() + " " + currentSlot.end);
        } else {
            // If no current slot found, default to the first slot
            start = new Date(now.toDateString() + " " + timeSlots[0].start);
            end = new Date(now.toDateString() + " " + timeSlots[0].end);
        }
    
        const startFormatted = start.toISOString().slice(0, 19).replace('T', ' ');
        const endFormatted = end.toISOString().slice(0, 19).replace('T', ' ');
    
        try {
            const response = await axios.post(`https://utech-iiot.lk/enmonqa/public/api/MachineData_mas/bulk`, {
                start: "2024-05-20 10:20:47",
                end: "2024-05-20 10:21:47"
            });
            console.log(response)
    
            const hour = currentSlot ? currentSlot.label : "1st Hour";
            const newPieceCounts = { ...pieceCounts, [hour]: response.data['first pullout'][0].data_set.shooter_Count };
            setPieceCounts(newPieceCounts);
    
            // Send request to update pieceCount in the database
            await axios.post(`http://${process.env.REACT_APP_HOST_IP}/set/setPieceCount`, {
                username: username,
                pieceCount: response.data['first pullout'][0].data_set.shooter_Count,
                shift: shift,
                hour: hour
            });
    
        } catch (error) {
            console.error('Error fetching latest Piece count data:', error);
        }
    };


    const getShift = async () => {
        try {
            const username = window.location.pathname.split('/').pop();
            setUsername(username);
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getShift`, {
                username: username,
            });

            setShift(response.data.Shift)

        }
        catch (error) {
            console.error("Failed to shift pieces");
        }
    }

    const getBarChartData = async () => {

        try {
            const username = window.location.pathname.split('/').pop();
            setUsername(username);
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getDataForBarChart`, {
                operatorType: 'operator',
                username: Username
            });
            console.log(username)
            const response2 = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getDataForBarChart`, {
                operatorType: 'LineEnd',
                username: Username
            });

            let labels = [];
            if (shift === 'A') {
                labels = ["06.00", "06.20", "07.20", "08.20", "09.40", "10.40", "11.00", "12.00", "13.00", "14.00"];
            } else if (shift === 'B') {
                labels = ["14.00", "14.20", "15.20", "16.20", "18.20", "18.40", "19.40", "20.40", "21.40", "22.40"];
            }

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
                        backgroundColor: getGradientFillStyle(),
                        tension: 0,
                        borderColor: ['#02c27a'],
                        borderWidth: 0,
                        order: 2
                    },
                    {
                        label: 'Line End Piece Count',
                        data: [],
                        backgroundColor: getGradientFillStyle2(),
                        tension: 0,
                        borderColor: ['#02c27a'],
                        borderWidth: 0,
                        order: 2
                    },
                    {
                        label: 'Required Rate',
                        data: [requiredRate, requiredRate, requiredRate, requiredRate, requiredRate, requiredRate, requiredRate, requiredRate, requiredRate, requiredRate],
                        backgroundColor: '#ff7588',
                        tension: 0,
                        borderColor: ['#ff7588'],
                        borderWidth: 1,
                        type: 'line',
                        order: 1
                    }
                ]
            };

            // Accessing the totalPieceCountByHour object from the response
            const totalPieceCountByHour = response.data.totalPieceCountByHour;

            Object.keys(totalPieceCountByHour).forEach(hour => {
                const pieceCountForHour = totalPieceCountByHour[hour];
                newData.datasets[0].data.push(pieceCountForHour);
            });

            const totalLineEndPieceCountByHour = response2.data.totalPieceCountByHour;

            Object.keys(totalLineEndPieceCountByHour).forEach(hour => {
                const pieceCountForHour = totalLineEndPieceCountByHour[hour];
                newData.datasets[1].data.push(pieceCountForHour);
            });


            // Setting the new data to the state
            setPieceCountData(newData);

        } catch (error) {
            console.error("Failed to get barchart data", error);
        }
    };

    const getSmv = async () => {
        try {
            const username = window.location.pathname.split('/').pop();
            setUsername(username);
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getsmv`, {
                username: username,
            });

            setSmv(response.data.smv)

        }
        catch (error) {
            console.error("Failed to shift pieces");
        }
    }

    const calculateGSDPieceRate = (smv) => {

        let GSDPieceRate = 60 / smv;
        let answer = GSDPieceRate / 7.5
        return Math.round(answer);
    }


    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
    }

    // Helper function to pad single-digit numbers with leading zeros
    function pad(value) {
        return value < 10 ? `0${value}` : value;
    }

    const getLanguage = (lng) => {
        setLanguage(lng)
    }

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language])


    const handleClickMaterial = async () => {
        await handleDowntimeClick('Material');
    };

    const handleClickMachine = async () => {
        await handleDowntimeClick('Machine');
    };

    return (
        <html lang="en" data-bs-theme="dark">
            <body>
                <Navbar sendLanguage={getLanguage} />
                <I18nextProvider i18n={i18n}>
                    <div className='container-fluid'>
                        {(downtimeClicked || machineClicked) && <div className="d-flex flex-column align-items-center justify-content-center position-fixed top-50 start-50 translate-middle">
                            <h1 className="mb-0">{formatTime(timer)}</h1>
                            <p className="mb-0 f-20" style={{ fontWeight: '600', color: 'white' }}>DownTime Timer</p>
                            {machineClicked ? <p className="mb-0 f-18 mt-2">Machine DownTime Started</p> : ''}
                            {downtimeClicked ? <p className="mb-0 f-18 mt-2">Material DownTime Started</p> : ''}
                            <button
                                type="button"
                                className="btn btn-danger w-auto mt-4 align-items-center justify-content-center"
                                style={{ height: "3rem", fontWeight: "600" }}
                                onClick={handleStopTimerClick}
                            >
                                <div className='d-flex'>
                                    <span className="material-symbols-outlined">close</span> Stop
                                </div>
                            </button>
                        </div>}
                        <div className='row mx-1 mt-3'>
                            <div style={{ height: '100dvh' }} className={downtimeClicked || machineClicked ? 'downtime-blur col-3 col-md-4' : 'col-3 col-md-4 '}>
                                <div className='row' >
                                    <div className="col" style={{ marginBottom: '-0.7rem' }}>
                                        <div className="card rounded-4">
                                            <div className="card-body align-items-center justify-content-center">
                                                <div className="d-flex align-items-center justify-content-around flex-wrap gap-2 ">
                                                    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                        <h3 className="mb-0">{(pieceCountInfo) || '0'}</h3>
                                                        <p className="mb-0">{t("Pieces")}</p>
                                                    </div>
                                                    <div className="vr"></div>
                                                    <Deviation shift={shift} latestHour={latestHour} pieceCount={pieceCountInfo} sendDataToParent={receiveDataFromChild} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col" style={{ marginBottom: '-0.7rem' }}>
                                        <div className="card rounded-4 h-80">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                                    <div className="d-flex flex-column align-items-center justify-content-center gap-1 mx-auto">
                                                        <div style={{ width: '13rem' }}>
                                                            <RadialBarChart Smv={Smv} pieceCount={pieceCountInfo} latestHour={latestHour} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col" style={{ marginBottom: '-0.7rem' }}>
                                        <div className="card rounded-4">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-around flex-wrap gap-2">
                                                    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                        <h3 className="mb-0">10</h3>
                                                        <p className="mb-0">{t("Best Cycle")}</p>
                                                    </div>
                                                    <div className="vr"></div>
                                                    <AvgCycle latestHour={latestHour} pieceCount={pieceCountInfo} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col" style={{ marginBottom: '-0.7rem' }}>
                                        <div className="card rounded-4">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-around flex-wrap gap-2">
                                                    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                        <h3 className="mb-0">{GSDPieceRate || '0'}</h3>
                                                        <p className="mb-0">{t("GSD Piece")}</p>
                                                        <p className="mb-0" style={{ marginTop: "-10px" }}>{t("Rate")}</p>
                                                    </div>
                                                    <div className="vr"></div>
                                                    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                        <h3 className="mb-0">{Math.round((dailyTarget / 10) / 7.5) || '0'}</h3>
                                                        <p className="mb-0">{t("Target Piece")}</p>
                                                        <p className="mb-0" style={{ marginTop: "-10px" }}>{t("Rate")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col" style={{ marginBottom: '-0.7rem' }}>
                                        <div className="card rounded-4">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-around flex-wrap gap-2">
                                                    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                        <h3 className="mb-0">10</h3>
                                                        <p className="mb-0">{t("My Best")}</p>
                                                    </div>
                                                    <div className="vr"></div>
                                                    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                        <h3 className="mb-0">10</h3>
                                                        <p className="mb-0">{t("MAS Best")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={downtimeClicked || machineClicked ? 'downtime-blur col-6 mx-4' : 'col-6 mx-2'}>
                                <div className='row' style={{ marginBottom: '-0.7rem' }}>
                                    <div className="card border-primary border-bottom rounded-4">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center justify-content-around ">
                                                <div className="d-flex flex-column align-items-center justify-content-center">
                                                    <h4 className="mb-0 fw-bold">{requiredRate || '0'}</h4>
                                                    <div className="d-flex align-items-center justify-content-center gap-1 text-success mt-1">
                                                        <span className="material-symbols-outlined">
                                                            trending_up
                                                        </span>
                                                        <p className="mb-0 fs-6">{t("Required Rate")}</p>
                                                    </div>
                                                </div>
                                                <div className="vr"></div>
                                                <LineEndPieceCount />
                                                <div className="vr"></div>
                                                <DailyTarget />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*<div className='row'>
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
    </div>*/}
                                <div className='row'>
                                    <div className="card">
                                        <div className="card-header py-1">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <h5 className="mb-0">{t("Hourly Output")}</h5>

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

                            <div className='col mx-2 my-5'>
                                {/*<div className="row">
                                <button type="button" style={{ height: "3.5rem", fontWeight: "600", fontSize: "0.9rem" }} onClick={handleAddPieceCountClick}
                                    className={downtimeClicked ? 'downtime-blur btn ripple btn-primary col mb-4' : 'btn ripple btn-primary col mb-4'}>
                                    {t("Add Piece Count")}
                                </button>
</div>*/}
                                <div className="row">
                                    <h2
                                        className='d-flex align-content-center justify-content-center mb-4'
                                        style={{ color: 'white', fontWeight: "500", fontSize: "1rem" }}
                                    >
                                        {t("DownTime")}
                                    </h2>
                                </div>
                                <div className="row">
                                    <button type="button" className={`btn btn-warning col mb-4 ${machineClicked ? 'downtime-button-active downtime-unblured-content btn btn-danger' : ''}`} style={{ height: "3rem", color: 'black', fontWeight: "600" }}
                                        onClick={handleClickMachine}>
                                        {t('Machine')}
                                    </button>
                                </div>
                                <div className="row">
                                    <button type="button" className={`btn btn-warning col mb-4 ${downtimeClicked ? 'downtime-button-active downtime-unblured-content btn btn-danger' : ''}`} style={{ height: "3rem", color: 'black', fontWeight: "600" }}
                                        onClick={handleClickMaterial}>
                                        {t("Material")}
                                    </button>
                                </div>
                                <CallSupervisor />
                                <div className="row">
                                    <button type="button" className="btn ripple btn-danger col mb-4" style={{ height: "3rem", fontWeight: "600" }}>{t("Man")}</button>
                                </div>
                                <div className="row">
                                    <button type="button" className="btn ripple btn-danger col mb-4" style={{ height: "3rem", fontWeight: "600" }}>{t("Machine")}</button>
                                </div>

                            </div>
                        </div>
                    </div>
                    {showModal && <div className="modal-backdrop show"></div>}
                    <Modal showModal={showModal} handleCloseModal={handleCloseModal} />
                </I18nextProvider>
            </body>
        </html>
    )
}

export default OperatorDashboard;
