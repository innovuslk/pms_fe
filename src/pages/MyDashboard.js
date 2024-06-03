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
import CurrentDeviation from '../components/currentHourDeviation';
import PlannedRadialBarChart from '../components/PlannedChart';
import ApiLineEndData from '../components/apiLineEnd';


function MyDashboard() {

    const { t } = useTranslation();

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [Username, setUsername] = useState();
    const [shift, setShift] = useState();
    const [pieceCountInfo, setPieceCountInfo] = useState();
    const [latestHour, setLatestHour] = useState('');
    const [requiredRate, setRequiredRate] = useState(0);
    const [ActualRequiredRate, setActualRequiredRate] = useState(0);
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
    const [nextHourTarget, setNextHourTarget] = useState()
    const [currentHourlyRate, setcurrentHourlyRate] = useState();
    const [HourlyTarget, setHourlyTarget] = useState();
    const [currentHourOutput, setCurrentHourOutput] = useState();
    const [MyBest, setMyBest] = useState();
    const [MASBest, setMASBest] = useState();
    const [bestCycle, setBestCycle] = useState(Infinity);
    const [intHour, setIntHour] = useState();
    const [deviation, setDeviation] = useState();
    const[requiredHourlyRate, setRequiredHourlyRate] = useState();
    const [operatorInfo, setOperatorInfo] = useState(null);
    const [shiftHours, setShiftHours] = useState();

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

        const intervalId = setInterval(fetchLatestPieceCount, 5000);

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
        getMyBest();

        const intervalId = setInterval(getMyBest, 5000);

        return () => clearInterval(intervalId);
    }, [pieceCountInfo]);

    useEffect(() => {
        getMASBest();

        const intervalId = setInterval(getMASBest, 5000);

        return () => clearInterval(intervalId);
    }, [pieceCountInfo]);

    useEffect(() => {
        getBarChartData();

        const intervalId = setInterval(getBarChartData, 10000);

        return () => clearInterval(intervalId);
    }, [requiredRate, shift, pieceCountInfo]);

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

    useEffect(() => {
        calculateHourlyRequiredRate();

        const intervalId = setInterval(calculateHourlyRequiredRate, 20000);

        return () => clearInterval(intervalId);
    }, [deviation,pieceCountInfo]);

    useEffect(() => {
        switch (latestHour) {
            case "1st Hour":
                setIntHour(0.5);
                break;
            case "2nd Hour":
                setIntHour(1.5);
                break;
            case "3rd Hour":
                setIntHour(2.5);
                break;
            case "4th Hour":
                setIntHour(3.5);
                break;
            case "5th Hour":
                setIntHour(4.5);
                break;
            case "6th Hour":
                setIntHour(5.5);
                break;
            case "7th Hour":
                setIntHour(6.5);
                break;
            case "8th Hour":
                setIntHour(7);
                break;
            default:
                setIntHour(7.3);
                break;
        }
    }, [latestHour]);

    
    useEffect(() => {
        // Fetch data from your backend when the component mounts
        const fetchData = async () => {
            const username = window.location.pathname.split('/').pop();
            setUsername(username);
            try {
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/info/getInfo`, {
                    username: username,
                });
                setOperatorInfo(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, []);
    useEffect(() => {
        getShiftHours();

        const intervalId = setInterval(getShiftHours, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [shiftHours]);

    
    const getShiftHours = async () => {
        try {

            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getShiftHours`, {
                shiftID: "A",
            });
            setShiftHours(response.data.ShiftHours)
        }
        catch (error) {
            console.error("Failed to shift pieces");
        }
    }

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
                // console.log(response);

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

    const receiveDataFromChild = ( requiredRate, dailyTarget, actualRequiredRate, nextHourTarget, currentHourlyRate, HourlyTarget, deviation) => {
        setDaillytarget(dailyTarget)
        setActualRequiredRate(actualRequiredRate);
        setNextHourTarget(nextHourTarget);
        setcurrentHourlyRate(currentHourlyRate)
        setHourlyTarget(HourlyTarget);
        setDeviation(deviation)
        setRequiredRate(requiredRate)
    };



    const calculateHourlyRequiredRate = () =>{
        let deviation = parseInt(dailyTarget - pieceCountInfo);
        let intHourValue = shiftHours - intHour;
    
        // Calculate the hourly required rate
        let hourlyRequiredRate = deviation / intHourValue;
        // Fix to 2 decimal places and convert back to a number
        let answer = parseFloat(hourlyRequiredRate.toFixed(2));
        
        setRequiredHourlyRate(answer)
    }

    const updateBestCycle = (newBestCycle) => {
        setBestCycle(newBestCycle);
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

            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/set/getPieceCount`, {

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

            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getShift`, {

                username: username,
            });

            setShift(response.data.Shift)
            // console.log("shift",shift)

        }
        catch (error) {
            console.error("Failed to shift pieces");
        }
    }

    const getMyBest = async () => {
        try {
            const username = window.location.pathname.split('/').pop();
            setUsername(username);
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getMyBest`, {
                username: username,
            });

            setMyBest(response.data.mybest)

        }
        catch (error) {
            console.error("Failed to shift pieces");
        }
    }

    const getMASBest = async () => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getMASBest`, {
            });
            setMASBest(response.data.masbest)

        }
        catch (error) {
            console.error("Failed to get MASBEST pieces");
        }
    }


    const getBarChartData = async () => {

        try {
            const username = window.location.pathname.split('/').pop();
            setUsername(username);
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getDataForBarChart`, {
                operatorType: operatorInfo.operation,
                username: Username,
                shift: shift
            });
            // console.log(username)
            const response2 = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getDataForBarChart`, {

                operatorType: 'LineEnd',
                username: Username,
                shift: shift
            });

            let labels = [];
            if (shift === 'A') {
                labels = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th","10th"];
            } else if (shift === 'B') {
                labels = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th","10th"];
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
                setCurrentHourOutput(totalPieceCountByHour[latestHour])
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
                            <div style={{ height: '100dvh' }} className={downtimeClicked || machineClicked ? 'downtime-blur col-3 col-md-4' : 'col-3 col-md-5 '}>
                                <div className='row' >
                                    <div className="col" style={{ marginBottom: '-0.7rem' }}>
                                        <div className="card rounded-4">
                                            <div className="card-body align-items-center justify-content-center">
                                                <div className="d-flex align-items-center justify-content-around flex-wrap gap-2 ">
                                                    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                        <h3 className="mb-0">{(pieceCountInfo) || '0'}</h3>
                                                        <p className="mb-0">{t("Total Pieces Out")}</p>
                                                    </div>
                                                    <div className="vr"></div>
                                                    <DailyTarget />
                                                    <div className="vr"></div>
                                                    <Deviation pieceCount={pieceCountInfo} sendDataToParent={receiveDataFromChild} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row' >
                                    <div className="col" style={{ marginBottom: '-0.7rem' }}>
                                        <div className="card rounded-4">
                                            <div className="card-body align-items-center justify-content-center">
                                                <div className="d-flex align-items-center justify-content-around flex-wrap gap-2 ">
                                                    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                        <h3 className="mb-0">{(HourlyTarget ? HourlyTarget.toFixed(2) : 0) || '0'}</h3>
                                                        <p className="mb-0">{t("Hourly Target")}</p>
                                                    </div>
                                                    <div className="vr"></div>
                                                    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                        <h3 className="mb-0">{(currentHourOutput) || '0'}</h3>
                                                        <p className="mb-0">{t("Current Hour Output")}</p>
                                                    </div>
                                                    <div className="vr"></div>
                                                    <CurrentDeviation shift={shift} latestHour={latestHour} pieceCount={pieceCountInfo} currentHourOutput={currentHourOutput} sendDataToParent={receiveDataFromChild} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col" style={{ marginBottom: '-0.7rem' }}>
                                        <div className="card rounded-4 h-80">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-center flex-wrap gap-2">
                                                    <div className="d-flex align-items-center justify-content-between gap-4 ">
                                                        <div style={{ width: '11.5rem' }}>
                                                            <PlannedRadialBarChart Smv={Smv} dailyTarget={dailyTarget} latestHour={latestHour} shift={shift}/>
                                                            <p className="mb-0">{t("Planned Efficiency")}</p>
                                                        </div>
                                                        <div style={{ width: '11.5rem' }}>
                                                            <RadialBarChart Smv={Smv} pieceCount={pieceCountInfo} latestHour={latestHour} dailyTarget={dailyTarget}/>
                                                            <p className="mb-0">{t("Actual Efficiency")}</p>
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
                                                        <h3 className="mb-0">{bestCycle || '0'}</h3>
                                                        <p className="mb-0">{t("Best Cycle Time")}</p>
                                                    </div>
                                                    <div className="vr"></div>
                                                    <AvgCycle latestHour={latestHour} currentHourOutput={currentHourOutput} onUpdateBestCycle={updateBestCycle}/>
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
                                                        <h3 className="mb-0">{MyBest || '0'}</h3>
                                                        <p className="mb-0">{t("My Best")}</p>
                                                    </div>
                                                    <div className="vr"></div>
                                                    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                        <h3 className="mb-0">{MASBest || '0'}</h3>
                                                        <p className="mb-0">{t("MAS Best")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={downtimeClicked || machineClicked ? 'downtime-blur col-6 mx-4' : 'col-5 mx-2'}>
                                <div className='row d-flex' style={{ marginBottom: '-0.7rem' }}>
                                    <div className='col-md-8 col-sm-6 d-flex align-items-center justify-content-center'>
                                        <div className="card border-primary border-bottom rounded-4">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-around">
                                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                                        <h4 className="mb-0 fw-bold">{(requiredHourlyRate ? requiredHourlyRate : '0')}</h4>
                                                        <div className="d-flex align-items-center justify-content-center gap-1 text-success mt-1">
                                                            <p className="mb-0 fs-6">{t("Required Hourly Rate")}</p>
                                                        </div>
                                                    </div>
                                                    <div className="vr"></div>
                                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                                        <h3 className="mb-0">{currentHourlyRate || '0'}</h3>
                                                        <p className="mb-0">{t("Current Hourly Rate")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col col-sm-3 d-flex align-items-center justify-content-around w-auto'>
                                        <div className={`card border-primary border-bottom rounded-4 ${ActualRequiredRate < requiredRate ? 'bg-danger' : 'bg-success'}`}>
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="">
                                                        <h4 className="mb-0 fw-bold">Status</h4>
                                                        <div className="d-flex align-items-center justify-content-start gap-1 text-dark mt-0">
                                                            <span className="material-symbols-outlined">
                                                                {ActualRequiredRate < requiredRate ? 'thumb_down' : 'thumb_up'}
                                                            </span>
                                                            <p className="mb-0 fs-6">{ActualRequiredRate < requiredRate ? 'Behind' : 'OK'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                </div>

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
                                {/*<div className='row'>
                                    <ApiLineEndData />
                                </div>*/}
                                <LineEndPieceCount shift={shift}/>
                            </div>

                            <div className='col mx-2'>
                                <div className="row">
                                    <button type="button" style={{ height: "3.5rem", fontWeight: "600", fontSize: "0.9rem" }} onClick={handleAddPieceCountClick}
                                        className={downtimeClicked ? 'downtime-blur btn ripple btn-primary col mb-4' : 'btn ripple btn-primary col mb-4'}>
                                        {t("Add Piece Count")}
                                    </button>
                                </div>
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

export default MyDashboard;
