import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import '../assets/css/adminHome.css';
import axios from 'axios';
import Clock from 'react-live-clock';
import Register from './UserReg';
import Downtime from './downTime';

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
    const [Smv, setSmv] = useState('');
    const [operatorInfo, setOperatorInfo] = useState(null);
    const [username, setUsername] = useState();
    const [plantUsers, setPlantUsers] = useState();
    const [iconClicked, setIconClicked] = useState(false);

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
                console.log("user info : ", operatorInfo)
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
                console.log("user info : ", plantUsers)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getUserNames();

    }, [PlantName]);

    const handleSideBarClick = (type) => {
        setSideBarType(type)
    }
    const handleReset = () => {
        resetForm();
    };

    const resetForm = () => {
        setDate('');
        setID('');
        setSbu('');
        setLineItem('')
        setLineNo('');
        setPlantName('')

        // Clear input field values
        const inputFields = document.querySelectorAll('input');
        inputFields.forEach(input => {
            input.value = '';
        });
    };

    async function handleSubmitDailyPlan(event) {
        event.preventDefault();

        await axios.post(`http://${process.env.REACT_APP_HOST_IP}/insert/insertDailyPlan`, {
            Date: Date,
            Sbu: Sbu,
            SalesOrder: SalesOrder,
            LineItem: LineItem,
            LineNo: LineNo,
            PlantName: PlantName,
            DailyTarget: parseInt(Dailytarget),
        })
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    setMessage("Daily Plan Added Successful");
                    setDate('');
                    setID('');
                    setSbu('');
                    setLineItem('')
                    setLineNo('');
                    setPlantName('')

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
        navigate(`/`);
    };

    const handleClick = () => {
        setIconClicked(prevState => !prevState);
    }

    return (
        <div className="admin-home-container">
            <input type="checkbox" id="check" />
            <nav className="navbar navbar-expand-lg navbar-dark position-fixed w-100 top-0 end-0 z-2" style={{ backgroundColor: "#195858" }}>
                <div className="container-fluid">
                    <a className="navbar-brand mx-2 bg-primary rounded" href="#">Softmatter</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent2" aria-controls="navbarSupportedContent2" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent2">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2 align-items-center">
                            <li className="nav-item">
                                <a className="nav-link font-weight-bold bg-info rounded-5 text-dark">Dashboard</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link">Components</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link">Tables</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" >Forms</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" ><Clock format={'HH:mm:ss'} ticking={true} timezone={'Asia/Colombo'} /></a>
                            </li>
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

            <div className="sidebar">
                <a className='d-flex align-items-center' onClick={() => handleSideBarClick('Dashboard')}><span class="material-symbols-outlined mx-1">
                    home
                </span>Dashboard
                </a>
                <a className='d-flex align-items-center' onClick={() => handleSideBarClick('DailyPlan')}><span class="material-symbols-outlined mx-1" >
                    assignment
                </span>Daily Plan Form
                </a>
                <a className='d-flex align-items-center' onClick={() => handleSideBarClick('operator')}><span class="material-symbols-outlined mx-1">
                    person_pin_circle
                </span>Operator Assign
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
                <a className='d-flex align-items-center'><span class="material-symbols-outlined mx-1">
                    settings
                </span>Settings
                </a>
            </div>

            {sideBarType === 'Dashboard' ?
                <div className="content">
                    <div className="welcome-message">
                        <h1>Welcome to Softmatter PMS</h1>
                        <p>Thank you for using our application!. Here.</p>
                        <p>Feel free to explore the different sections of the application, including the Dashboard, Components, Tables, Forms, and more.</p>
                        <p>Have a great day!</p>
                    </div>

                </div> : ''}

            {sideBarType === 'DailyPlan' ?
                <div className="content">
                    <div>
                        <div className="col-6 col-xl-6 col-md-8 mx-auto z-index-1">
                            <div className="card">
                                <div className="card-body p-4">
                                    <h5 className="mb-4">Daily Plan</h5>

                                    <form className="row g-3" onSubmit={handleSubmitDailyPlan}>
                                        <div className="col-md-12">
                                            <label for="input26" className="form-label">Date</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    badge
                                                </span></span>
                                                <input type="date" className="form-control" id="input26" validate={{ required: true }} onChange={e => setDate(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input27" className="form-label">Sbu</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    person
                                                </span></span>
                                                <input type="text" className="form-control" id="input27" placeholder="Sbu" validate={{ required: true }} onChange={e => setSbu(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input28" className="form-label">Sales Order</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    <span class="material-symbols-outlined">
                                                        real_estate_agent
                                                    </span>
                                                </span></span>
                                                <input type="text" className="form-control" id="input28" placeholder="Sales Order" validate={{ required: true }} onChange={e => setSalesOrder(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input29" className="form-label">Line Item</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    view_timeline
                                                </span></span>
                                                <input type="text" className="form-control" id="input29" placeholder="Line Item" validate={{ required: true }} onChange={e => setLineItem(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input29" className="form-label">Line No</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    key
                                                </span></span>
                                                <input type="text" className="form-control" id="input29" placeholder="Line No" validate={{ required: true }} onChange={e => setLineNo(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input31" className="form-label">Plant Name</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    recent_actors
                                                </span></span>
                                                <select className="form-select" id="input32" onChange={e => setPlantName(e.target.value)}>
                                                    <option value="">Select Plant</option>
                                                    <option value="UPLP">UPLP</option>
                                                    <option value="LC">LC</option>
                                                    <option value="ExcelTech">ExcelTech</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input32" className="form-label">Daily Target</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    crisis_alert
                                                </span></span>
                                                <input type="number" className="form-control" id="input32" placeholder="Daily Target" validate={{ required: true }} onChange={e => setDailytarget(e.target.value)} />
                                            </div>
                                        </div>
                                        {message && (
                                            <div className="alert alert-success" role="alert">
                                                {message}
                                            </div>
                                        )}

                                        <div className="col-md-12">
                                            <div className="d-md-flex d-grid align-items-center gap-3">
                                                <button type="submit" className="btn btn-primary px-4 w-auto">Submit</button>
                                                <button type="button" className="btn btn-secondary px-4 w-auto" onClick={handleReset}>Reset</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div> : ''}

            {sideBarType === 'operator' ?
                <div className="content">
                    <div>
                        <div className="col-6 col-xl-6 col-md-8 mx-auto z-index-1">
                            <div className="card">
                                <div className="card-body p-4">
                                    <h5 className="mb-4">Operator Daily Assignment</h5>

                                    <form className="row g-3" onSubmit={handleSubmitOperator}>
                                        <div className="col-md-12">
                                            <label for="input26" className="form-label">Date</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    badge
                                                </span></span>
                                                <input type="date" className="form-control" id="input26" validate={{ required: true }} onChange={e => setDate(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input27" className="form-label">Sbu</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    person
                                                </span></span>
                                                <input type="text" className="form-control" id="input27" placeholder="Sbu" validate={{ required: true }} onChange={e => setSbu(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input29" className="form-label">Line No</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    key
                                                </span></span>
                                                <input type="text" className="form-control" id="input29" placeholder="Line No" validate={{ required: true }} onChange={e => setLineNo(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input31" className="form-label">Plant Name</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span className="material-symbols-outlined">
                                                    crisis_alert
                                                </span></span>
                                                <select className="form-select" id="input32" onChange={e => setPlantName(e.target.value)}>
                                                    <option value="">Select Plant</option>
                                                    <option value="UPLP">UPLP</option>
                                                    <option value="LC">LC</option>
                                                    <option value="ExcelTech">ExcelTech</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input26" className="form-label">UserName</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span className="material-symbols-outlined">
                                                    crisis_alert
                                                </span></span>
                                                <select className="form-select" id="input32" onChange={e => setUserID(e.target.value)}>
                                                    <option value="">Select User</option>
                                                    {plantUsers && plantUsers.map(user => (
                                                        <option key={user.userid} value={user.userid}>{user.username}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input31" className="form-label">Shift</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    recent_actors
                                                </span></span>
                                                <input type="text" className="form-control" id="input31" placeholder="Shift" validate={{ required: true }} onChange={e => setShift(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input32" className="form-label">Operation</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span className="material-symbols-outlined">
                                                    crisis_alert
                                                </span></span>
                                                <select className="form-select" id="input32" onChange={e => setOperation(e.target.value)}>
                                                    <option value="">Select Operation</option>
                                                    <option value="LineEnd">LineEnd</option>
                                                    <option value="Operator">operator</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input31" className="form-label">Smv</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    nest_clock_farsight_analog
                                                </span></span>
                                                <input type="number" className="form-control" id="input31" placeholder="Smv(in minutes)" validate={{ required: true }} onChange={e => setSmv(e.target.value)} />
                                            </div>
                                        </div>
                                        {message && (
                                            <div className="alert alert-success" role="alert">
                                                {message}
                                            </div>
                                        )}

                                        <div className="col-md-12">
                                            <div className="d-md-flex d-grid align-items-center gap-3">
                                                <button type="submit" className="btn btn-primary px-4 w-auto">Submit</button>
                                                <button type="button" className="btn btn-secondary px-4 w-auto">Reset</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div> : ''}
            {sideBarType === 'register' ? <Register /> : ''}
            {sideBarType === 'downtime' ? <Downtime /> : ''}
        </div>
    );
}

export default AdminHome;