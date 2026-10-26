import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import PengaduanWarga from './pages/warga/PengaduanWarga';
import PengaduanPengurus from './pages/pengurus/PengaduanPengurus';

// Import Halaman Auth & Landing
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Import Halaman Warga
import DashboardWarga from './pages/warga/Dashboard';
import FormPembaruan from './pages/warga/FormPembaruan';

// Import Halaman Pengurus
import DashboardPengurus from './pages/pengurus/Dashboard';
import VerifikasiData from './pages/pengurus/VerifikasiData';
import DaftarWarga from './pages/pengurus/DaftarWarga';

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
  
      <Routes>
        {/* Rute Bebas (Tanpa Sidebar/Navbar) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute Warga (Dibungkus Layout) */}
        <Route path="/dashboard" element={<Layout><DashboardWarga /></Layout>} />
        <Route path="/pembaruan" element={<Layout><FormPembaruan /></Layout>} />
        
        {/* PERBAIKAN: Menambahkan <Layout> sebagai pembungkus */}
        <Route path="/pengaduan" element={<Layout><PengaduanWarga /></Layout>} />
        
        {/* Rute Pengurus (Dibungkus Layout) */}
        <Route path="/pengurus/dashboard" element={<Layout><DashboardPengurus /></Layout>} />
        <Route path="/pengurus/verifikasi" element={<Layout><VerifikasiData /></Layout>} />
        <Route path="/pengurus/warga" element={<Layout><DaftarWarga /></Layout>} />
        <Route path="/pengurus/pengaduan" element={<Layout><PengaduanPengurus /></Layout>} />
      </Routes>
    </Router>
  );
}