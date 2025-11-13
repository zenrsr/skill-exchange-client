import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navigation from './components/Navigation.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Matches from './pages/Matches.jsx';
import Messages from './pages/Messages.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';
import Sessions from './pages/Sessions.jsx';
import ProtectedRoute from './router/ProtectedRoute.jsx';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navigation />}
      <main className={isAuthenticated ? 'app-shell' : 'app-shell app-shell--auth'}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/my-sessions" element={<Sessions />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
          />
        </Routes>
      </main>
      <ToastContainer position="top-right" closeOnClick pauseOnHover={false} />
    </>
  );
};

export default App;
