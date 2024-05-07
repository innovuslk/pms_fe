import React, { useState,useEffect } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const CallSupervisor = () => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const intervalId = setInterval(() => {
            getPhoneNumber();
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    const handleSMSClick = async () => {
        try {
            await getPhoneNumber();
            const userId = window.location.pathname.split('/').pop();
            const supervisorId = 'supervisor456';
            const roomId = `chat_${userId}_${supervisorId}`;
            await sendSMS(phoneNumber,roomId);

            const chatWindow = window.open(`/chat-room/${roomId}`, '_blank');
        } catch (error) {
            console.error("Failed to start chat", error);
        }
    };

    const getPhoneNumber = async () => {
        try {
            const username = window.location.pathname.split('/').pop();
            const decodedUsername = atob(username)
            setUsername(decodedUsername)
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/send/sendSMS`, {
                username: username,
            });
            setPhoneNumber(response.data.phoneNumber);
        } catch (error) {
            console.error("Failed to get the phoneNumber", error);
        }
    };

    const sendSMS = async (phoneNumber,roomId) => {
        console.log('function reached')
        try{
            const response = await axios.post(`https://app.notify.lk/api/v1/send?user_id=26971&api_key=PnNPpRVZy30MjraI7z13&sender_id=NotifyDEMO&to=${phoneNumber}&message=${username} need assistance and use this link to chat with the operator - http://${process.env.REACT_APP_HOST_IP2}/chat-room/${roomId}`);
            console.log(response)
        }

        catch (error){
            console.error(error);
        }
    }

    const showModalWithMessage = (message) => {
        setModalMessage(message);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <div className="row">
                <button type="button" className="btn ripple btn-danger col mb-4" style={{ height: "3.5rem", fontWeight: "600" }}
                    onClick={handleSMSClick}
                >{t("Call Supervisor")}</button>
            </div>
            {showModal &&
                <div className="modal-backdrop show"></div>
            }
            {showModal &&
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-warning">Alert</h5>
                                <button type="button" className="close" aria-label="Close" onClick={closeModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">{modalMessage}</div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger w-auto" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default CallSupervisor;

