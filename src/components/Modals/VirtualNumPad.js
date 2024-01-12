// VirtualNumPad.js
import React from 'react';
import '../../assets/css/VirtualNumpad.css';

const VirtualNumPad = ({ onKeyPress, onDelete, onOk }) => {
    const handleKeyPress = (value) => {
        onKeyPress(value);
    };

    return (
        <div className="virtual-num-pad mx-5">
            <div className="row">
                <div className="col">
                    <button className="btn btn-light w-100" onClick={() => handleKeyPress('1')}>1</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-light w-100" onClick={() => handleKeyPress('2')}>2</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-light w-100" onClick={() => handleKeyPress('3')}>3</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-light w-100" onClick={() => handleKeyPress('4')}>4</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-light w-100" onClick={() => handleKeyPress('5')}>5</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-light w-100" onClick={() => handleKeyPress('6')}>6</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-light w-100" onClick={() => handleKeyPress('7')}>7</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-light w-100" onClick={() => handleKeyPress('8')}>8</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-light w-100" onClick={() => handleKeyPress('9')}>9</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-danger w-100" onClick={() => onDelete()}>Delete</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-light w-100" onClick={() => handleKeyPress('0')}>0</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-success w-100" onClick={() => onOk()}>OK</button>
                </div>
            </div>
        </div>
    );
};

export default VirtualNumPad;
