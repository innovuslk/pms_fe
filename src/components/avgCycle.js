import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useTranslation } from "react-i18next";

function AvgCycle({ latestHour, currentHourOutput, onUpdateBestCycle }) {

    const { t } = useTranslation();

    const [avgCycle, setAvgCycle] = useState();
    const [bestCycle, setBestCycle] = useState(Infinity); // Initialize to a large value
    const [intHour, setIntHour] = useState();

    useEffect(() => {
        let avgCycle = calculateAvgCycle(intHour, currentHourOutput);

        setAvgCycle(avgCycle);

        // Update best cycle time if avgCycle is lower
        if (avgCycle < bestCycle) {
            setBestCycle(avgCycle);
            onUpdateBestCycle(avgCycle);
        }

        const intervalId = setInterval(() => {
            let avgCycle = calculateAvgCycle(intHour, currentHourOutput);

            setAvgCycle(avgCycle);

            // Update best cycle time if avgCycle is lower
            if (avgCycle < bestCycle) {
                setBestCycle(avgCycle);
                onUpdateBestCycle(avgCycle);
            }
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [intHour, currentHourOutput, bestCycle, onUpdateBestCycle]);

    useEffect(() => {
        switch (latestHour) {
            case "1":
                setIntHour(20);
                break;
            case "2":
                setIntHour(60);
                break;
            case "3":
                setIntHour(60);
                break;
            case "4":
                setIntHour(60);
                break;
            case "5":
                setIntHour(60);
                break;
            case "6":
                setIntHour(60);
                break;
            case "7":
                setIntHour(60);
                break;
            case "8":
                setIntHour(60);
                break;
            case "9":
                setIntHour(8.5);
                break;
            case "10":
                setIntHour(10);
                break;
            default:
                setIntHour(60);
                break;
        }
    }, [latestHour]);

    const calculateAvgCycle = (intHour, currentHourOutput) => {
        let avgCycle = (currentHourOutput / intHour);
        return avgCycle.toFixed(2);
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center gap-2">
            <h3 className="mb-0">{avgCycle || '0'}</h3>
            <p className="mb-0" style={{ fontSize: '0.7rem', padding: '0px' }}>{t("Avg Cycle Time")}</p>
        </div>
    );
}

export default AvgCycle;
