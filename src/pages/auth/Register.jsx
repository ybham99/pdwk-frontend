import { useState } from 'react';
import { UserPlus, Check } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({ 
    nama_lengkap: '', 
    identitas: '', 
    password: '', 
    konfirmasi: '' 
  });
  const [showSuccess, setShowSuccess] = useState(false); // State untuk mengaktifkan animasi transisi
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.konfirmasi) {
      return toast.error('Password dan Konfirmasi Password tidak cocok!');
    }

    const toastId = toast.loading('Sedang mendaftarkan akun...');

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama_lengkap: formData.nama_lengkap,
          identitas: formData.identitas,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.dismiss(toastId); // Hapus pesan loading
        setShowSuccess(true);  // Pemicu render layar transisi ceklis
        
        // Jeda 2.5 detik untuk memutar animasi sebelum navigasi ke login
        setTimeout(() => navigate('/login'), 2500);
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch (error) {
      toast.error('Gagal terhubung ke server.', { id: toastId });
    }
  };

  // ================= LAYAR ANIMASI TRANISISI (CEKLIS) =================
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        {/* CSS Keyframes Internal khusus layar animasi */}
        <style>{`
          @keyframes scaleBounce {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes slideUpFade {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .anim-bounce { animation: scaleBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          .anim-text-1 { animation: slideUpFade 0.6s ease forwards; animation-delay: 0.3s; opacity: 0; }
          .anim-text-2 { animation: slideUpFade 0.6s ease forwards; animation-delay: 0.5s; opacity: 0; }
        `}</style>
        
        <div className="flex flex-col items-center text-center px-4">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 anim-bounce text-white mb-6">
            <Check size={50} strokeWidth={3} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 anim-text-1">Registrasi Berhasil!</h2>
          <p className="text-gray-500 mt-3 font-medium text-lg anim-text-2">Silakan login. Mengalihkan otomatis...</p>
        </div>
      </div>
    );
  }

  // ================= LAYAR FORMULIR (DEFAULT) =================
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Akun Baru</h1>
          <p className="text-gray-500 text-sm mt-2">Lengkapi data untuk membuat akun warga</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Contoh: Budi Santoso"
              value={formData.nama_lengkap}
              onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. Handphone / Email</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Contoh: 08123456789"
              value={formData.identitas}
              onChange={(e) => setFormData({...formData, identitas: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Minimal 6 karakter"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Ulangi password"
              value={formData.konfirmasi}
              onChange={(e) => setFormData({...formData, konfirmasi: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-all mt-2">
            Daftar Sekarang
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Sudah punya akun? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}