import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Row, Col, Input, Button, Container, Label, FormGroup } from "reactstrap";
import { Link } from 'react-router-dom';

import logodark from "../assets/images/logo-dark.png";

function Login() {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();

        axios.post('http://localhost:5000/login', {
            username: Username,
            password: Password,
        })
            .then(res => {
                console.log(res);
                if(res.status === 200){
                    const username = Username;

                    // Redirect to another page with the extracted username
                    navigate(`/user-info/${username}`);
                }
                else{
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
