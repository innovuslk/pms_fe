import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

function Register() {
    const [PN, setPN] = useState('');
    const [userId, setUserID] = useState('');
    const [Username, setUsername] = useState('');
    const [Firstname, setFirstname] = useState('');
    const [Lastname, setLastname] = useState('');
    const [Password, setPassword] = useState('');
    const [UserLevel, setUserLevel] = useState('');
    const [EPF, setEPF] = useState('');
    const [plantName,setPlantName] = useState('');
    const [message, setMessage] = useState('');

    // const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();

        axios.post(`http://${process.env.REACT_APP_HOST_IP}/register`, {
            PN: PN,
            username: Username,
            firstName: Firstname,
            lastName: Lastname,
            password: Password,
            userlevel: UserLevel,
            EPF: EPF,
            plantName:plantName
        })
        .then(res => {
            console.log(res);
            if (res.status === 200) {
                setMessage("User Register Successful");
                resetForm(); // Reset form fields
                setTimeout(() => {
                    setMessage(''); // Clear message after 5 seconds
                }, 5000);
            } else {
                setMessage("Error Occurred");
                setTimeout(() => {
                    setMessage('');
                }, 5000);
            }
        })
        .catch(err => {
            console.log(err);
            setMessage('Error Occurred (404)');
            setTimeout(() => {
                setMessage('');
            }, 5000);
        });
    }

    const handleReset = () => {
        resetForm();
    };

    const resetForm = () => {

        setUserID('');
        setPN('');
        setUsername('');
        setLastname('');
        setPassword('');
        setUserLevel('');
        setEPF('');
        setPlantName('');
        // Clear input field values
        const inputFields = document.querySelectorAll('input');
        inputFields.forEach(input => {
            input.value = '';
        });
    };

    return (
        <html lang="en" data-bs-theme="dark">
            <body>
                <div className='container-fluid'>
                    <div>
                        <div className="col-6 col-xl-6 col-md-8 mx-auto my-3">
                            <div className="card">
                                <div className="card-body p-4">
                                    <h5 className="mb-4">User Register</h5>


                                    <form className="row g-3" onSubmit={handleSubmit}>
                                        <div className="col-md-12">
                                            <label for="input25" className="form-label">PN</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    pin
                                                </span></span>
                                                <input type="number" className="form-control" id="input25" placeholder="PN" validate={{ required: true }} onChange={e => setPN(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input27" className="form-label">Username</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    person
                                                </span></span>
                                                <input type="text" className="form-control" id="input27" placeholder="Username" validate={{ required: true }} onChange={e => setUsername(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input28" className="form-label">First Name</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    person_edit
                                                </span></span>
                                                <input type="text" className="form-control" id="input28" placeholder="First Name" validate={{ required: true }} onChange={e => setFirstname(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input29" className="form-label">Last Name</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    person_edit
                                                </span></span>
                                                <input type="text" className="form-control" id="input29" placeholder="Last Name" validate={{ required: true }} onChange={e => setLastname(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input29" className="form-label">Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    key
                                                </span></span>
                                                <input type="password" className="form-control" id="input29" placeholder="Password" validate={{ required: true }} onChange={e => setPassword(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor="input31" className="form-label">User Level ID</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span className="material-symbols-outlined">recent_actors</span></span>
                                                <select className="form-control" id="input31" value={UserLevel} onChange={e => setUserLevel(e.target.value)}>
                                                    <option value="">Select User Level</option>
                                                    <option value="1">Admin</option>
                                                    <option value="3">Operator</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label for="input32" className="form-label">EPF</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><span class="material-symbols-outlined">
                                                    person_celebrate
                                                </span></span>
                                                <input type="text" className="form-control" id="input32" placeholder="EPF" validate={{ required: true }} onChange={e => setEPF(e.target.value)} />
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
                                        {message && (
                                            <div className="alert alert-success" role="alert">
                                                {message}
                                            </div>
                                        )}

                                        <div className="col-md-12">
                                            <div className="d-md-flex d-grid align-items-center gap-3">
                                                <button type="submit" className="btn btn-primary px-4 w-auto">Submit</button>
                                                <button type="button" className="btn btn-light px-4 w-auto" onClick={handleReset}>Reset</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}

export default Register;
