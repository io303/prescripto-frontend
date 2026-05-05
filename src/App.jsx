import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'

import Home from './pages/Home'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import MyReports from './pages/MyReports'
import Appointment from './pages/Appointment'
import VideoCall from './pages/VideoCall'
import DiseasePredictor from './pages/DiseasePredictor'
import PrescriptionAnalyzer from './pages/PrescriptionAnalyzer'

import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AllAppointments from './pages/admin/AllAppointments'
import AddDoctor from './pages/admin/AddDoctor'
import DoctorsList from './pages/admin/DoctorsList'

import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorProfile from './pages/doctor/DoctorProfile'
import CreateReport from './pages/doctor/CreateReport'

const Layout = ({ children }) => <><Navbar />{children}<Footer /></>

const App = () => {
  const location = useLocation()
  const hideChatbot = location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/doctor') ||
    location.pathname.startsWith('/video-call')

  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      {!hideChatbot && <Chatbot />}

      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/doctors" element={<Layout><Doctors /></Layout>} />
        <Route path="/doctors/:speciality" element={<Layout><Doctors /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
        <Route path="/my-profile" element={<Layout><MyProfile /></Layout>} />
        <Route path="/my-appointments" element={<Layout><MyAppointments /></Layout>} />
        <Route path="/my-reports" element={<Layout><MyReports /></Layout>} />
        <Route path="/appointment/:docId" element={<Layout><Appointment /></Layout>} />
        <Route path="/video-call/:roomId" element={<VideoCall />} />
        <Route path="/disease-predictor" element={<Layout><DiseasePredictor /></Layout>} />
        <Route path="/prescription-analyzer" element={<Layout><PrescriptionAnalyzer /></Layout>} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/all-appointments" element={<AllAppointments />} />
        <Route path="/admin/add-doctor" element={<AddDoctor />} />
        <Route path="/admin/doctors-list" element={<DoctorsList />} />

        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/doctor/create-report/:appointmentId" element={<CreateReport />} />
      </Routes>
    </div>
  )
}

export default App
