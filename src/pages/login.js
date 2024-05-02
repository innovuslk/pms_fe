import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Row, Col, Button, Container, Label, FormGroup } from "reactstrap";
import { Link } from 'react-router-dom';

import logodark from "../assets/images/logo-dark.png";

function Login() {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [verifiedToken, setVerifiedToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get(`http://${process.env.REACT_APP_HOST_IP}/verifyToken`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.status === 200) {
                    console.log("Verification Successful")
                    setVerifiedToken(token)
                }
            })
            .catch(error => {
                setTimeout(() => {
                    console.log(error)
                });
            });

        const storedUsername = localStorage.getItem('username');
        const userLevel = parseInt(localStorage.getItem('userLevel'));
        if (verifiedToken && userLevel === 3) {
            const encodedUsername = btoa(storedUsername);
            navigate(`/user-info/${encodedUsername}`);
            console.log(token,userLevel)
        }
        else if(verifiedToken && (userLevel === 1 || userLevel === 2)) {
            console.log(userLevel)
            const encodedUsername = btoa(storedUsername);
            navigate(`/admin/${encodedUsername}`);
        }
        else {
            console.log('errrrrrrrrr')
            console.log(token,userLevel,storedUsername)
        }
    }, []);

    function handleSubmit(event) {
        event.preventDefault();

        if (!navigator.onLine) {
            setErrorMessage("You have no internet connection");
            return;
        }

        axios.post(`http://${process.env.REACT_APP_HOST_IP}/login`, {
            username: Username,
            password: Password,
        })
            .then(res => {
                console.log(res);
                const token = res.data.token;
                localStorage.setItem('token', token);
                localStorage.setItem('username', Username);
                localStorage.setItem('userLevel', res.data.userLevel) ;// Store the token in local storage

                if (res.status === 200 && (res.data.userLevel === 3)) {
                    const encodedUsername = btoa(Username);
                    navigate(`/user-info/${encodedUsername}`);
                }
                else if (res.status === 200 && (res.data.userLevel === 1 || res.data.userLevel === 2)) {
                    const encodedUsername = btoa(Username);
                    navigate(`/admin/${encodedUsername}`);
                }
                else if (res.status === 200 && (res.data.userLevel === 4)) {
                    const encodedUsername = btoa(Username);
                    navigate(`/operator/${encodedUsername}`);
                    console.log(res.data.userLevel)
                }
                else {
                    setErrorMessage("Invalid Username or Password");
                    setTimeout(() => {
                        setErrorMessage('');
                    }, 5000);
                }
            })
            .catch(err => {
                console.log(err);
                setErrorMessage('Invalid Username or Password');
                setTimeout(() => {
                    setErrorMessage('');
                }, 5000);
            });
    }


    return (
        <React.Fragment>
            <div>
                <Container fluid className="p-0 justify-content-center">
                    <Row className="g-0 justify-content-center align-items-center min-vh-100">
                        <Col lg={4}>
                            <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                                <div className="w-100">
                                    <Row className="justify-content-center border border-info rounded-3">
                                        <Col lg={9}>
                                            <div>
                                                <div className="text-center">
                                                    <div>
                                                        <Link to="/" className="logo">
                                                            <img src={logodark} alt="" height="40" className=" mx-auto" />
                                                        </Link>
                                                    </div>

                                                    <h4 className="font-size-18 mt-4">Welcome Back !</h4>
                                                    <p className="text-muted">Sign in to continue to Softmatter.</p>
                                                </div>

                                                {errorMessage && (
                                                    <div className="alert alert-danger" role="alert">
                                                        {errorMessage}
                                                    </div>
                                                )}

                                                <div className="p-2 mt-5">
                                                    <form className="form-horizontal" onSubmit={handleSubmit}>

                                                        <FormGroup className="auth-form-group-custom mb-4">
                                                            <i className="ri-user-2-line auti-custom-input-icon"></i>
                                                            <label htmlFor="username">Username</label>
                                                            <input name="username" type="text" className="form-control" id="username" validate={{ required: true }} placeholder="Enter username" onChange={e => setUsername(e.target.value)} />
                                                        </FormGroup>

                                                        <FormGroup className="auth-form-group-custom mb-4">
                                                            <i className="ri-lock-2-line auti-custom-input-icon"></i>
                                                            <Label htmlFor="userpassword">Password</Label>
                                                            <input name="password" type="password" className="form-control" id="userpassword" placeholder="Enter password" onChange={e => setPassword(e.target.value)} />
                                                        </FormGroup>

                                                        <div className="form-check">
                                                            <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                            <label className="form-check-label" htmlFor="customControlInline">Remember me</label>
                                                        </div>

                                                        <div className="mt-4 text-center">
                                                            <Button color="primary" className="w-md waves-effect waves-light" type="submit">Log In</Button>
                                                        </div>
                                                        {/*<div className="mt-4 text-center">
                                                            <h7 className = 'text-decoration-underline'><a onClick={handleRegister}>Register</a></h7>
                                                </div>*/}
                                                        <p></p>
                                                    </form>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Login;
