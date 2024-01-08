// App.js
import './App.css';
import GetUserInfo from './pages/getUserInfo';
import Login from './pages/login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './assets/scss/theme.scss'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/user-info/:username" element={<GetUserInfo />} />
            </Routes>
        </Router>
    );
}

export default App;
