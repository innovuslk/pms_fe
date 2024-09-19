// App.js
import './App.css';
import MyDashboard from './pages/MyDashboard';
import Login from './pages/login';
import Register from './pages/UserReg';
import AdminHome from './pages/AdminHome';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import './assets/scss/theme.scss'
import TopOperatorsTable from './pages/TopOperators';
import ChatApp from './pages/chatRoom';
import OperatorDashboard from './pages/APIOperatorDashboard';
import OperatorInfo2 from './pages/operatorInfo2';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/user-info/:username" element={<MyDashboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/:username" element={<AdminHome />} />
                <Route path="/topUsers" element={<TopOperatorsTable />} />
                <Route path="/chat-room/:roomId" element={<ChatApp />} />
                <Route path="/operator/:username" element={<OperatorDashboard />} />
                <Route path="/admin/operatorInfo2" element={<OperatorInfo2 />} />
            </Routes>
        </Router>
    );
}

export default App;
