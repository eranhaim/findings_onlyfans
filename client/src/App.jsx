import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ProfileForm from './admin/ProfileForm';
import AgeGate from './components/AgeGate';
import './i18n';
import './App.css';

function App() {
  return (
    <>
      <AgeGate />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profiles/new" element={<ProfileForm />} />
          <Route path="/admin/profiles/:id/edit" element={<ProfileForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
