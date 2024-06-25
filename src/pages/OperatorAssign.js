import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../assets/css/adminHome.css';

const OperatorAssign = () => {
    const [PDate, setDate] = useState('');
    const [Sbu, setSbu] = useState('');
    const [SalesOrder, setSalesOrder] = useState('');
    const [LineItem, setLineItem] = useState('');
    const [LineNo, setLineNo] = useState('');
    const [PlantName, setPlantName] = useState('');
    const [DailyTarget, setDailytarget] = useState('');
    const [style, setStyle] = useState('');
    const [shift, setShift] = useState('');
    const [message, setMessage] = useState('');
    const [operatorAssigns, setOperatorAssigns] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [supervisors, setSupervisors] = useState();
    const [plantUsers, setPlantUsers] = useState();
    const [userId, setUserID] = useState();
    const [supervisor, setSupervisor] = useState();
    const [operation, setOperation] = useState('');
    const [Smv, setSmv] = useState('');

    useEffect(() => {
        fetchOperatorAssigns();
    }, []);

    const fetchOperatorAssigns = async () => {
        try {
            const response = await axios.get(`http://${process.env.REACT_APP_HOST_IP}/insert/operatorAssigns`);
            setOperatorAssigns(response.data);
        } catch (error) {
            console.error('Error fetching daily plans:', error);
        }
    };

    const handleSubmitOperator = async (e) => {
        e.preventDefault();
        const OperatorAssign = { PDate ,Sbu ,LineNo ,PlantName ,userId ,shift ,operation ,supervisor ,Smv };

        try {
            if (editMode) {
                await axios.put(`http://${process.env.REACT_APP_HOST_IP}/insert/updateDailyPlan/${currentId}`, OperatorAssign);
                setMessage('Daily Plan updated successfully');
            } else {
                await axios.post(`http://${process.env.REACT_APP_HOST_IP}/insert/insertOperator`, OperatorAssign).then(res => {
                    if (res.status === 200) {
                        setMessage("Operator Assigned Successful");
                        setDate('');
                        setUserID('');
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
    
                });
            }
            fetchOperatorAssigns();
            handleReset();
        } catch (error) {
            console.error('Error entering/updating daily plan:', error);
            setMessage('Error entering/updating Daily Plan.');
        }
    };

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


    const handleEdit = () => {
        fetchOperatorAssigns();
        setEditMode(true);

    };

    const handleClose = () => {
        setEditMode(false);

    };

    const deletePlan = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this plan?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://${process.env.REACT_APP_HOST_IP}/insert/deleteOperatorAssign/${id}`);
                setOperatorAssigns(operatorAssigns.filter(plan => plan.id !== id));
            } catch (error) {
                console.error('Error deleting plan:', error);
            }
        }
    };

    const handleReset = () => {
        setDate('');
        setSbu('');
        setSalesOrder('');
        setLineItem('');
        setLineNo('');
        setPlantName('');
        setDailytarget('');
        setStyle('');
        setShift('');
        setEditMode(false);
        setCurrentId(null);
        setSelectedPlan(null);
        setMessage('');
    };

    // const handleUpdate = async () => {
    //     const updatedPlan = { Date, Sbu, SalesOrder, LineItem, LineNo, PlantName, DailyTarget, style, shift };
    //     try {
    //         await axios.put(`http://${process.env.REACT_APP_HOST_IP}/insert/updateDailyPlan/${currentId}`, updatedPlan);
    //         setMessage('Daily Plan updated successfully');
    //         fetchOperatorAssigns();
    //         handleReset();
    //     } catch (error) {
    //         console.error('Error updating daily plan:', error);
    //         setMessage('Error updating Daily Plan.');
    //     }
    // };

    const filteredPlans = operatorAssigns.filter(plan =>
        plan.plantName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { timeZone: 'Asia/Colombo' }); 
    };

    return (
        <div>
            {!editMode ?
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
                                        <label for="input26" className="form-label">Supervisor(only for operators)</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><span className="material-symbols-outlined">
                                                crisis_alert
                                            </span></span>
                                            <select className="form-select" id="input32" onChange={e => setSupervisor(e.target.value)}>
                                                <option value="">Select Supervisor</option>
                                                {supervisors && supervisors.map(user => (
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
                                            <input type="number" step="0.01" className="form-control" id="input31" placeholder="Smv(in minutes)" validate={{ required: true }} onChange={e => setSmv(e.target.value)} />
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
                                            <button type="button" className="btn btn-info px-4 w-auto" onClick={handleEdit}>Edit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div> : <div className='d-none'></div>}

            {editMode && (
                <div className='content'>
                    <div className="input-group w-25 mx-auto">
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Search by plant name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text">
                                <span className="material-symbols-outlined">
                                    search
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className='mx-0 w-auto' style={{marginTop:'-3rem'}}>
                        <button className='btn btn-danger w-auto radius-30 px-2 w-auto' onClick={handleClose}>Close</button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col" className="text-center">Date</th>
                                    <th scope="col" className="text-center">Sbu</th>
                                    <th scope="col" className="text-center">Line No</th>
                                    <th scope="col" className="text-center">Plant Name</th>
                                    <th scope="col" className="text-center">UserID</th>
                                    <th scope="col" className="text-center">Shift</th>
                                    <th scope="col" className="text-center">Operation</th>
                                    <th scope="col" className="text-center">Supervisor</th>
                                    <th scope="col" className="text-center">Smv</th>
                                    <th scope="col" className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPlans.map((plan, index) => (
                                    <tr key={index} className="text-center">
                                        <td>{formatDate(plan.date)}</td>
                                        <td>{plan.sbu}</td>
                                        <td>{plan.lineNo}</td>
                                        <td>{plan.plantName}</td>
                                        <td>{plan.userid}</td>
                                        <td>{plan.Shift}</td>
                                        <td>{plan.operation}</td>
                                        <td>{plan.supervisor}</td>
                                        <td>{plan.smv}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => deletePlan(plan.id)}
                                            >
                                                <span className="material-symbols-outlined">
                                                    delete_forever
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OperatorAssign;