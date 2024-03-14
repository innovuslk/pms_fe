import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { I18nextProvider, useTranslation } from "react-i18next";


function CallSupervisor() {
    const { t } = useTranslation();

    const handleSMSClick = async () => {
        try {
            const username = window.location.pathname.split('/').pop();
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/send/sendSMS`, {
                username: username,
            });
            response.status === 200 ? alert(t('Alert Sent To Your Supervisor')) : alert(t('SMS Failed,Try again later'));
        }
        catch (error) {
            console.error("Failed to shift pieces");
        }
    }


    return (
        <div className="row">
            <button type="button" className="btn ripple btn-danger col mb-4" style={{ height: "3.5rem", fontWeight: "600" }}
                onClick={handleSMSClick}
            >{t("Call Supervisor")}</button>
        </div>
    )

}


export default CallSupervisor;
