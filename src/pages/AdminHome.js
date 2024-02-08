import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../assets/css/adminHome.css';
import axios from 'axios';

function AdminHome() {

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
    const [svm, setSvm] = useState('');


    const handleSideBarClick = (type) => {
        console.log(type)
        setSideBarType(type)
    }

    function handleSubmit(event) {
        event.preventDefault();

        axios.post('http://localhost:5000/register', {
            ID: ID,
            Date: Date,
            Sbu: Sbu,
            SalesOrder: SalesOrder,
            LineItem: LineItem,
            LineNo: LineNo,
            PlantName: PlantName,
            Dailytarget: Dailytarget
        })
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    setMessage("User Register Successful");
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

    return (
        <div className="admin-home-container">
            <input type="checkbox" id="check" />
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark position-fixed w-100 top-0 end-0 z-2">
                <div className="container-fluid">
                    <a className="navbar-brand mx-2 bg-primary rounded" href="#">Softmatter</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent2" aria-controls="navbarSupportedContent2" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent2">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2 align-items-center">
                            <li className="nav-item">
                                <a className="nav-link">Dashboard</a>
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
                                <a className="nav-link">About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" >Settings</a>
                            </li>
                        </ul>
                        <form className="d-flex">
                            <button className="btn btn-light radius-30 px-2" type="submit">
                                <span class="material-symbols-outlined">
                                    account_circle
                                </span>
                            </button>
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

                                    <form className="row g-3" onSubmit={handleSubmit}>
                                        <div className="col-md-12">
                                            <label for="input25" className="form-label">ID</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    pin
                                                </span></span>
                                                <input type="number" className="form-control" id="input25" placeholder="ID" validate={{ required: true }} onChange={e => setID(e.target.value)} />
                                            </div>
                                        </div>
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
                                                <input type="number" className="form-control" id="input29" placeholder="Line No" validate={{ required: true }} onChange={e => setLineNo(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input31" className="form-label">Plant Name</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    recent_actors
                                                </span></span>
                                                <input type="number" className="form-control" id="input31" placeholder="Plant Name" validate={{ required: true }} onChange={e => setPlantName(e.target.value)} />
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
                                                <button type="button" className="btn btn-light px-4 w-auto">Reset</button>
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

                                    <form className="row g-3" onSubmit={handleSubmit}>
                                        <div className="col-md-12">
                                            <label for="input25" className="form-label">ID</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    pin
                                                </span></span>
                                                <input type="number" className="form-control" id="input25" placeholder="ID" validate={{ required: true }} onChange={e => setID(e.target.value)} />
                                            </div>
                                        </div>
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
                                                <input type="number" className="form-control" id="input29" placeholder="Line No" validate={{ required: true }} onChange={e => setLineNo(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input31" className="form-label">Plant Name</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    recent_actors
                                                </span></span>
                                                <input type="number" className="form-control" id="input31" placeholder="Plant Name" validate={{ required: true }} onChange={e => setPlantName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input26" className="form-label">User ID</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    badge
                                                </span></span>
                                                <input type="number" className="form-control" id="input26" placeholder="User ID" validate={{ required: true }} onChange={e => setUserID(e.target.value)} />
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
                                                    <option value="Operator">Operator</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                        <label for="input31" className="form-label">Svm</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><span class="material-symbols-outlined">
                                            nest_clock_farsight_analog
                                            </span></span>
                                            <input type="number" className="form-control" id="input31" placeholder="Svm(in minutes)" validate={{ required: true }} onChange={e => setSvm(e.target.value)} />
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
                                                <button type="button" className="btn btn-light px-4 w-auto">Reset</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div> : ''}
        </div>
    );
}

export default AdminHome;