import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../assets/css/adminHome.css';

const DailyPlan = () => {
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
    const [dailyPlans, setDailyPlans] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        fetchDailyPlans();
    }, []);

    const fetchDailyPlans = async () => {
        try {
            const response = await axios.get(`http://${process.env.REACT_APP_HOST_IP}/insert/dailyPlans`);
            setDailyPlans(response.data);
        } catch (error) {
            console.error('Error fetching daily plans:', error);
        }
    };

    const handleSubmitDailyPlan = async (e) => {
        e.preventDefault();
        const dailyPlan = { PDate, Sbu, SalesOrder, LineItem, LineNo, PlantName, DailyTarget, style, shift };

        try {
            if (editMode) {
                await axios.put(`http://${process.env.REACT_APP_HOST_IP}/insert/updateDailyPlan/${currentId}`, dailyPlan);
                setMessage('Daily Plan updated successfully');
            } else {
                await axios.post(`http://${process.env.REACT_APP_HOST_IP}/insert/insertDailyPlan`, dailyPlan);
                setMessage('Daily Plan entered successfully');
            }
            fetchDailyPlans();
            handleReset();
        } catch (error) {
            console.error('Error entering/updating daily plan:', error);
            setMessage('Error entering/updating Daily Plan.');
        }
    };

    const handleEdit = () => {
        fetchDailyPlans();
        setEditMode(true);

    };

    const handleClose = () => {
        setEditMode(false);

    };

    const deletePlan = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this plan?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://${process.env.REACT_APP_HOST_IP}/insert/deleteDailyPlan/${id}`);
                setDailyPlans(dailyPlans.filter(plan => plan.id !== id));
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

    const handleUpdate = async () => {
        const updatedPlan = { Date, Sbu, SalesOrder, LineItem, LineNo, PlantName, DailyTarget, style, shift };
        try {
            await axios.put(`http://${process.env.REACT_APP_HOST_IP}/insert/updateDailyPlan/${currentId}`, updatedPlan);
            setMessage('Daily Plan updated successfully');
            fetchDailyPlans();
            handleReset();
        } catch (error) {
            console.error('Error updating daily plan:', error);
            setMessage('Error updating Daily Plan.');
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const filteredPlans = dailyPlans.filter(plan =>
        plan.plantName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredPlans.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(filteredPlans.length / rowsPerPage);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { timeZone: 'Asia/Colombo' }); 
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                        <button onClick={() => handlePageChange(i)} className="page-link">
                            {i}
                        </button>
                    </li>
                );
            }
        } else {
            const firstPages = [1, 2, 3];
            const lastPages = [totalPages - 2, totalPages - 1, totalPages];
            const middlePages = [];

            if (currentPage > 3 && currentPage < totalPages - 2) {
                middlePages.push(currentPage - 1, currentPage, currentPage + 1);
            }

            const renderPages = (pages) => {
                return pages.map((page) => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button onClick={() => handlePageChange(page)} className="page-link">
                            {page}
                        </button>
                    </li>
                ));
            };

            pageNumbers.push(...renderPages(firstPages));

            if (currentPage > 4) {
                pageNumbers.push(
                    <li key="ellipsis1" className="page-item disabled">
                        <span className="page-link">...</span>
                    </li>
                );
            }

            pageNumbers.push(...renderPages(middlePages));

            if (currentPage < totalPages - 3) {
                pageNumbers.push(
                    <li key="ellipsis2" className="page-item disabled">
                        <span className="page-link">...</span>
                    </li>
                );
            }

            pageNumbers.push(...renderPages(lastPages));
        }

        return pageNumbers;
    };


    return (
        <div>
            {!editMode ?
                <div className="content"><div>
                    <div className="col-6 col-xl-6 col-md-8 mx-auto z-index-1">
                        <div className="card">
                            <div className="card-body p-4">
                                <h5 className="mb-4">Daily Plan</h5>
                                <form className="row g-3" onSubmit={handleSubmitDailyPlan}>
                                    <div className="col-md-12">
                                        <label htmlFor="input26" className="form-label">Date</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><span className="material-symbols-outlined">
                                                badge
                                            </span></span>
                                            <input type="date" className="form-control" id="input26" required onChange={e => setDate(e.target.value)} value={PDate} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label htmlFor="input27" className="form-label">Sbu</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><span className="material-symbols-outlined">
                                                person
                                            </span></span>
                                            <input type="text" className="form-control" id="input27" placeholder="Sbu" required onChange={e => setSbu(e.target.value)} value={Sbu} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label htmlFor="input28" className="form-label">Sales Order</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><span className="material-symbols-outlined">
                                                real_estate_agent
                                            </span></span>
                                            <input type="text" className="form-control" id="input28" placeholder="Sales Order" required onChange={e => setSalesOrder(e.target.value)} value={SalesOrder} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label htmlFor="input29" className="form-label">Line Item</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><span className="material-symbols-outlined">
                                                view_timeline
                                            </span></span>
                                            <input type="text" className="form-control" id="input29" placeholder="Line Item" required onChange={e => setLineItem(e.target.value)} value={LineItem} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label htmlFor="input30" className="form-label">Line No</label>
                                        <div class Name="input30" className="input-group">
                                            <span className="input-group-text"><span className="material-symbols-outlined">
                                                key
                                            </span></span>
                                            <input type="text" className="form-control" id="input30" placeholder="Line No" required onChange={e => setLineNo(e.target.value)} value={LineNo} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label htmlFor="input31" className="form-label">Style</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><span className="material-symbols-outlined">
                                                key
                                            </span></span>
                                            <input type="text" className="form-control" id="input31" placeholder="Style" required onChange={e => setStyle(e.target.value)} value={style} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label htmlFor="input32" className="form-label">Plant Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><span className="material-symbols-outlined">
                                                recent_actors
                                            </span></span>
                                            <select className="form-select" id="input32" required onChange={e => setPlantName(e.target.value)} value={PlantName}>
                                                <option value="">Select Plant</option>
                                                <option value="UPLP">UPLP</option>
                                                <option value="LC">LC</option>
                                                <option value="ExcelTech">ExcelTech</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label htmlFor="input33" className="form-label">Daily Target</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><span className="material-symbols-outlined">
                                                crisis_alert
                                            </span></span>
                                            <input type="number" className="form-control" id="input33" placeholder="Daily Target" required onChange={e => setDailytarget(e.target.value)} value={DailyTarget} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label htmlFor="input34" className="form-label">Shift</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><span className="material-symbols-outlined">
                                                shift
                                            </span></span>
                                            <input type="text" className="form-control" id="input34" placeholder="Shift" required onChange={e => setShift(e.target.value)} value={shift} />
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
                                    <th scope="col" className="text-center">Sales Order</th>
                                    <th scope="col" className="text-center">Line Item</th>
                                    <th scope="col" className="text-center">Plant Name</th>
                                    <th scope="col" className="text-center">Daily Target</th>
                                    <th scope="col" className="text-center">Style</th>
                                    <th scope="col" className="text-center">Shift</th>
                                    <th scope="col" className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.map((plan, index) => (
                                    <tr key={index} className="text-center">
                                        <td>{formatDate(plan.date)}</td>
                                        <td>{plan.sbu}</td>
                                        <td>{plan.salesOrder}</td>
                                        <td>{plan.lineItem}</td>
                                        <td>{plan.plantName}</td>
                                        <td>{plan.dailyTarget}</td>
                                        <td>{plan.style}</td>
                                        <td>{plan.shift}</td>
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
                    <div className="d-flex justify-content-center">
                        <nav>
                            <ul className="pagination" style={{ overflowX: 'auto', width: '100%', maxWidth: '500px' }}>
                                {[...Array(totalPages).keys()].map(number => (
                                    <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                        <button onClick={() => handlePageChange(number + 1)} className="page-link">
                                            {number + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyPlan;