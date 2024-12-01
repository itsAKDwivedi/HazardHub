import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginRegister from './pages/LoginRegister/LoginRegister';
import ActiveProjects from './pages/ActiveProjects/ActiveProjects';
import HomePage from "./pages/HomePage/HomePage";
import Hospital from './pages/Hospital/Hospital';
import InitiateProject from "./pages/InitiateProject/InitiateProject";
import ProjectDashboard from './pages/ProjectDashboard/ProjectDashboard';
import Notifications from './pages/Notifications/Notifications';
import Notices from './pages/Notices/Notices';
import { NotificationsProvider } from './context/NotificationsContext';
import PrivateRoute from './components/PrivateRoute';
import Concerns from './pages/Concerns/Concerns'

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <NotificationsProvider>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/hospital" element={<Hospital />} />
                        <Route path="/login" element={<LoginRegister />} />
                        <Route path="/active-projects" element={<PrivateRoute><ActiveProjects/></PrivateRoute>} />
                        <Route path="/initiate-project" element={<PrivateRoute><InitiateProject /></PrivateRoute>   } />
                        <Route path="/project-dashboard/:projectId" element={<PrivateRoute><ProjectDashboard /></PrivateRoute>   } />
                        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                        <Route path="/notices/:projectId" element={<PrivateRoute><Notices /></PrivateRoute>} />
                        <Route path="/concerns/:projectId" element={<PrivateRoute><Concerns /></PrivateRoute>} />
                        <Route path="*" element={<h1>Stay in your Limits Please</h1>} /> {/* Fallback route */}
                    </Routes>
                </NotificationsProvider>
            </Router>
        </AuthProvider>
    );
};

export default App;
