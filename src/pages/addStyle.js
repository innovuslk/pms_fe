import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../assets/css/adminHome.css';
import axios from 'axios';

function AddStyle() {
    const [Base, setBase] = useState('');
    const [StyleNo, setStyleNo] = useState('');
    const [Size, setSize] = useState('');
    const [StitchCount, setStitchCount] = useState('');
    const [message, setMessage] = useState('');
    const [Operation, setOperation] = useState('');
    // const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        axios.post(`http://${process.env.REACT_APP_HOST_IP}/insert/insertStyleData`, {
            Base: Base,
            StyleNo: StyleNo,
            Size: Size,
            StitchCount: StitchCount,
            Operation: Operation
        })
            .then(res => {
                // console.log(res);
                if (res.status === 200) {
                    setMessage("Style Added Successful");
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
                // console.log(err);
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

        setBase('');
        setStyleNo('');
        setSize('');
        setStitchCount('');
        // Clear input field values
        const inputFields = document.querySelectorAll('input');
        inputFields.forEach(input => {
            input.value = '';
        });
    };

    return (

        <div className='content'>
            <div>
                <div className="col-6 col-xl-6 col-md-8 mx-auto my-3">
                    <div className="card">
                        <div className="card-body p-4">
                            <h5 className="mb-4">Add Style</h5>


                            <form className="row g-3" onSubmit={handleSubmit}>
                                <div className="col-md-12">
                                    <label for="input25" className="form-label">Base Style</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><span class="material-symbols-outlined">
                                            pin
                                        </span></span>
                                        <input type="text" className="form-control" id="input25" placeholder="Base Style" validate={{ required: true }} onChange={e => setBase(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <label for="input27" className="form-label">Style Number</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><span class="material-symbols-outlined">
                                            person
                                        </span></span>
                                        <input type="text" className="form-control" id="input27" placeholder="Style Number" validate={{ required: true }} onChange={e => setStyleNo(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <label for="input28" className="form-label">Size</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><span class="material-symbols-outlined">
                                            person_edit
                                        </span></span>
                                        <input type="text" className="form-control" id="input28" placeholder="Size" validate={{ required: true }} onChange={e => setSize(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <label for="input29" className="form-label">Stitch Count</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><span class="material-symbols-outlined">
                                            pin
                                        </span></span>
                                        <input type="number" className="form-control" id="input29" placeholder="Stitch Count" validate={{ required: true }} onChange={e => setStitchCount(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="input32" className="form-label">Operation</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><span className="material-symbols-outlined">
                                            recent_actors
                                        </span></span>
                                        <select className="form-select" id="input32" required onChange={e => setOperation(e.target.value)} value={Operation}>
                                            <option value="">Select operation</option>
                                            <option value="Pullout 1">Pullout 1</option>
                                            <option value="Pullout 2">Pullout 2</option>
                                            <option value="LineEnd">LineEnd</option>
                                            <option value="operator">Operator</option>
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
                                        <button type="button" className="btn btn-secondary px-4 w-auto" onClick={handleReset}>Reset</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddStyle;
