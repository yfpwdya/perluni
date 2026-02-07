import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Sensus from './pages/Sensus';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login page without layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Main page with layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Sensus />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
