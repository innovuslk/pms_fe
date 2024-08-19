import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import '../assets/css/adminHome.css';
import axios from 'axios';
import Clock from 'react-live-clock';
import Register from './UserReg';
import Downtime from './downTime';
import TopOperatorsTable from './TopOperators';
import bgImage from '../assets/images/megamenu-img.png';
import WeekPlanUpload from '../components/WeekPlanUpload';
import UserManagement from '../components/UserManagement';
import SupervisorDashboard from './supervisorDashboard';
import OperatorInfo from './operatorInfo';
import SupervisorJoin from './supervisorChatRoom';
import Style from '../components/Style';
import AddStyle from './addStyle';
import OperatorWeekPlanUpload from '../components/OperatorWeekUpload';
import DailyPlan from './DailyPlan';
import OperatorAssign from './OperatorAssign';
import History from './History';

function AdminHome() {

    const navigate = useNavigate();

    const [sideBarType, setSideBarType] = useState('Dashboard');
    const [ID, setID] = useState();
    const [Date, setDate] = useState('');
    const [Sbu, setSbu] = useState('');
    const [SalesOrder, setSalesOrder] = useState('');
    const [LineItem, setLineItem] = useState('');
    const [LineNo, setLineNo] = useState('');
    const [PlantName, setPlantName] = useState('');
    const [Dailytarget, setDailytarget] = useState();
    const [message, setMessage] = useState('');
    const [userId, setUserID] = useState();
    const [shift, setShift] = useState('');
    const [operation, setOperation] = useState('');
    const [style, setStyle] = useState('');
    const [Smv, setSmv] = useState('');
    const [operatorInfo, setOperatorInfo] = useState(null);
    const [username, setUsername] = useState();
    const [plantUsers, setPlantUsers] = useState();
    const [iconClicked, setIconClicked] = useState(false);
    const [connection, setConnection] = useState();
    const [supervisor, setSupervisor] = useState();
    const [supervisors, setSupervisors] = useState();
    const [dailyTarget, setDaillytarget] = useState();
    const [shiftHours, setShiftHours] = useState();

    useEffect(() => {
        // Fetch data from your backend when the component mounts
        const checkConnection = () => {
            if (!navigator.onLine) {
                setConnection('offline')
            }
            else {
                setConnection('')
            }
        };

        const intervalId = setInterval(checkConnection, 5000);

        return () => clearInterval(intervalId);

    }, [connection]);

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
        // Fetch data from your backend when the component mounts
        const fetchData = async () => {
            const username = window.location.pathname.split('/').pop();
            setUsername(username);
            try {
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/info/getAdminInfo`, {
                    username: username,
                });

                setOperatorInfo(response.data);
                // console.log("user info : ", operatorInfo)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, []);

    useEffect(() => {
        // Fetch data from your backend when the component mounts
        const getUserNames = async () => {
            try {
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getPlantUsers`, {
                    plantName: PlantName,
                });
                setPlantUsers(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getUserNames();

    }, [PlantName]);

    useEffect(() => {
        getShiftHours();

        const intervalId = setInterval(getShiftHours, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [shiftHours]);

    useEffect(() => {
        getDailyTarget();

        const intervalId = setInterval(getDailyTarget, 60000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        // Fetch data from your backend when the component mounts
        const getSupervisors = async () => {
            try {
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getSupervisors`, {
                });

                setSupervisors(response.data);
                // console.log("user info : ", supervisors)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getSupervisors();

    }, [PlantName]);


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

    const getDailyTarget = async () => {
        try {
            const username = window.location.pathname.split('/').pop();
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getDailyTarget`, {
                username: username
            });
            setDaillytarget(response.data.dailyTarget)

        }
        catch (error) {
            // console.error("Failed to dailyTarget");
        }
    }

    const handleSideBarClick = (type) => {
        setSideBarType(type)
    }
    const handleReset = () => {
        resetForm();
    };

    const resetForm = () => {
        setDate('');
        setSbu('');
        setSalesOrder('');
        setLineItem('');
        setLineNo('');
        setPlantName('');
        setDailytarget('');
        setStyle('');
        setShift('');
        setMessage('');

        // Clear input field values
        const inputFields = document.querySelectorAll('input');
        inputFields.forEach(input => {
            input.value = '';
        });
    };


    function handleSubmitOperator(event) {
        event.preventDefault();

        axios.post(`http://${process.env.REACT_APP_HOST_IP}/insert/insertOperator`, {
            Date: Date,
            Sbu: Sbu,
            LineNo: LineNo,
            PlantName: PlantName,
            userId: userId,
            Shift: shift,
            operation: operation,
            supervisor: supervisor,
            Smv: Smv
        })
            .then(res => {
                if (res.status === 200) {
                    setMessage("Operator Assigned Successful");
                    setDate('');
                    setID('');
                    setSbu('');
                    setLineItem('')
                    setLineNo('');
                    setPlantName('')

                    setTimeout(() => {
                        setMessage('');
                    }, 5000);

                    const inputFields = document.querySelectorAll('input');
                    inputFields.forEach(input => {
                        input.value = '';
                    });

                }
                else {
                    setMessage("Error Occured");
                    setTimeout(() => {
                        setMessage('');
                    }, 5000);
                }

            })
            .catch(err => {
                console.log(err);
                setMessage('Error Occured(404)');
                setTimeout(() => {
                    setMessage('');
                }, 5000);
            });
    }
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userLevel');
        navigate(`/`);
    };

    const handleClick = () => {
        setIconClicked(prevState => !prevState);
    }

    return (
        <div className="admin-home-container">
            <input type="checkbox" id="check" />
            <nav className="navbar navbar-expand-lg navbar-dark position-fixed w-100 top-0 end-0 z-2" style={{ backgroundColor: "#011e29" }}>
                <div className="container-fluid">
                    <a className="navbar-brand mx-2 rounded" href="#">PMS</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent2" aria-controls="navbarSupportedContent2" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent2">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2 align-items-center">
                            <li className="nav-item">
                                <a className="nav-link font-weight-bold rounded-5 mx-2">Dashboard</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" ><Clock format={'HH:mm:ss'} ticking={true} timezone={'Asia/Colombo'} /></a>
                            </li>
                            {connection === 'offline' ? <li className="nav-item me-auto"><a className="nav-link d-flex align-items-center gap-1 text-danger"><span class="material-symbols-outlined text-danger">
                                wifi_off
                            </span> You Have No Internet</a>
                            </li> : ''}
                        </ul>
                        <form className="d-flex justify-content-center align-items-center">
                            <h6 className='p-1 mx-2'>{operatorInfo && operatorInfo.decodedUsername || 'User'}</h6>
                            <button className="btn btn-dark radius-30" type="button" onClick={handleClick}>
                                <span class="material-symbols-outlined">
                                    account_circle
                                </span>
                            </button>
                            {iconClicked && <button className="btn btn-danger h-50 w-auto mx-2" onClick={handleLogout}>Log out</button>}
                        </form>
                    </div>
                </div>
            </nav>

            <div className="sidebar rounded-3">
                <a className='d-flex align-items-center' onClick={() => handleSideBarClick('Dashboard')}><span class="material-symbols-outlined mx-1">
                    home
                </span>Dashboard
                </a>
                <a className='d-flex align-items-center' onClick={() => handleSideBarClick('OperatorInfo')}><span class="material-symbols-outlined mx-1">
                    groups_2
                </span>Operator Info
                </a>
                <a className='d-flex align-items-center' onClick={() => handleSideBarClick('DailyPlan')}><span class="material-symbols-outlined mx-1" >
                    assignment
                </span>Daily Plan Form
                </a>
                <a className='d-flex align-items-center' onClick={() => handleSideBarClick('WeekPlan')}><span class="material-symbols-outlined mx-1" >
                    assignment
                </span>Week Plan Upload
                </a>
                <a className='d-flex align-items-center' onClick={() => handleSideBarClick('operator')}><span class="material-symbols-outlined mx-1">
                    person_pin_circle
                </span>Operator Assign
                </a>
                <a className='d-flex align-items-center' onClick={() => handleSideBarClick('OperatorWeek')}><span class="material-symbols-outlined mx-1">
                    person_pin_circle
                </span>Week Assign
                </a>
                <a className='d-flex align-items-center' onClick={() => handleSideBarClick('style')}><span class="material-symbols-outlined mx-1">
                    styler
                </span>Add Style
                </a>
                <a className='d-flex align-items-center' onClick={() => handleSideBarClick('register')}><span class="material-symbols-outlined mx-1">
                    person_pin_circle
                </span>User Register
                </a>
                <a className='d-flex align-items-center' onClick={() => handleSideBarClick('downtime')}><span class="material-symbols-outlined mx-1">
                    flex_direction
                </span>
                    DownTime Info
                </a>
                <a className='d-flex align-items-center' onClick={() => handleSideBarClick('topusers')}><span class="material-symbols-outlined mx-1">
                    family_star
                </span>
                    Top Users
                </a>
                <a className='d-flex align-items-center' onClick={() => handleSideBarClick('Users')}><span class="material-symbols-outlined mx-1">
                    person_search
                </span>
                    User Management
                </a>
                <a className='d-flex align-items-center' onClick={() => handleSideBarClick('History')}><span class="material-symbols-outlined mx-1">
                history
            </span>
                History
            </a>
                {/*<a className='d-flex align-items-center' onClick={() => handleSideBarClick('Chat')}><span class="material-symbols-outlined mx-1">
                message
                </span>
                Chat
    </a>*/}

            </div>

            {sideBarType === 'Dashboard' ?
                <SupervisorDashboard /> : ''}

            {/*sideBarType === 'Chat' ? 
            <SupervisorJoin/> : ''
    */}

            {sideBarType === 'DailyPlan' ?
                <DailyPlan /> : ''}

            {sideBarType === 'operator' ?
                <OperatorAssign /> : ''}
            {sideBarType === 'register' ? <Register /> : ''}
            {sideBarType === 'downtime' ? <Downtime /> : ''}
            {sideBarType === 'topusers' ? <TopOperatorsTable /> : ''}
            {sideBarType === 'WeekPlan' ? <WeekPlanUpload /> : ''}
            {sideBarType === 'Users' ? <UserManagement /> : ''}
            {sideBarType === 'OperatorInfo' ? <OperatorInfo /> : ''}
            {sideBarType === 'style' ? <AddStyle /> : ''}
            {sideBarType === 'OperatorWeek' ? <OperatorWeekPlanUpload /> : ''}
            {sideBarType === 'History' ? <History /> : ''}
        </div>
    );
}

export default AdminHome;
