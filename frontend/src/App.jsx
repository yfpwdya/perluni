import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Sensus from './pages/Sensus';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Publications from './pages/Publications';
import PublicationDetail from './pages/PublicationDetail';
import AdminFeedback from './pages/AdminFeedback';
import AdminDashboard from './pages/AdminDashboard';
import AdminArticles from './pages/AdminArticles';
import AdminUsers from './pages/AdminUsers';
import AdminRoute from './components/AdminRoute';

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
            <Route path="/publikasi" element={<Publications />} />
            <Route path="/publikasi/:id" element={<PublicationDetail />} />
            <Route
              path="/admin"
              element={(
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              )}
            />
            <Route
              path="/admin/feedback"
              element={(
                <AdminRoute>
                  <AdminFeedback />
                </AdminRoute>
              )}
            />
            <Route
              path="/admin/publikasi"
              element={(
                <AdminRoute>
                  <AdminArticles />
                </AdminRoute>
              )}
            />
            <Route
              path="/admin/users"
              element={(
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              )}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
