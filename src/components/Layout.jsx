import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Home, FileText, CheckSquare, Users, Menu, X, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isWarga = user.role === 'warga';

  const menuWarga = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Pembaruan Data', path: '/pembaruan', icon: <FileText size={20} /> },
    { name: 'Pengaduan', path: '/pengaduan', icon: <MessageSquare size={20} /> },
  ];

  const menuPengurus = [
    { name: 'Dashboard RT/RW', path: '/pengurus/dashboard', icon: <Home size={20} /> },
    { name: 'Verifikasi Data', path: '/pengurus/verifikasi', icon: <CheckSquare size={20} /> },
    { name: 'Data Warga', path: '/pengurus/warga', icon: <Users size={20} /> },
    { name: 'Pengaduan Warga', path: '/pengurus/pengaduan', icon: <MessageSquare size={20} /> },
  ];

  const menus = isWarga ? menuWarga : menuPengurus;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex text-gray-800">
      
      {/* ================= SIDEBAR MODERN (GRADASI) ================= */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 border-r border-teal-800 transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Area Logo */}
        <div className="p-1 flex items-center gap-5 border-b border-white/10">
          <img src="/pdwklogo.png" alt="Logo PDWK" className="w-90 h-50 object-contain drop-shadow-md" />
          <span className="text-xl font-bold text-white tracking-wider drop-shadow-sm"></span>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menus.map((menu) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link
                key={menu.name}
                to={menu.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                  ? 'bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-md' 
                  : 'text-teal-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {menu.icon}
                {menu.name}
              </Link>
            );
          })}
        </nav>

        {/* ================= PANGGILAN DARURAT ================= */}
        <div className="px-4 pb-4 pt-2 space-y-3 border-t border-white/10 mt-auto">
          
          <a 
            href="tel:112"
            className="flex items-center justify-center gap-3 w-full bg-[#ff3b3b] hover:bg-red-600 text-white px-4 py-2.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <img src="/siren.png" alt="Siren 112" className="w-15 h-15 object-contain" />
            <span className="font-bold text-sm tracking-wide">Panggilan Darurat 112</span>
          </a>

          <a 
            href="tel:113" 
            className="flex items-center justify-center gap-3 w-full bg-white hover:bg-gray-100 text-gray-800 px-4 py-2.5 rounded-xl shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <img src="/damkar.png" alt="Pemadam Kebakaran" className="w-15 h-15 object-contain" />
            <span className="font-semibold text-sm">Pemadam Kebakaran</span>
          </a>
        </div>

        {/* Area Profil & Logout */}
        <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-teal-500 flex items-center justify-center font-bold text-white shadow-md border border-white/20">
              {user.nama?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate drop-shadow-sm">{user.nama}</p>
              <p className="text-xs text-teal-200 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-100 hover:text-white border border-red-500/30 rounded-lg transition-all font-medium"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* ================= KONTEN UTAMA ================= */}
      <main className="flex-1 h-screen overflow-y-auto flex flex-col relative bg-gray-50/50">
        
        {/* ================= HEADER KHUSUS MOBILE ================= */}
        {/* Warna Background Hijau-Teal, Tombol di Kiri, Logo di Kanan */}
        <header className="md:hidden flex items-center justify-between px-5 py-4 sticky top-0 bg-teal-900 shadow-md z-40 border-b border-teal-800">
          
          {/* Tombol Sidebar di Sebelah Kiri */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white shadow-sm border border-white/10 transition-all active:scale-95 flex items-center justify-center shrink-0 z-50 relative"
          >
            {isMobileMenuOpen ? <X size={26} strokeWidth={2.5} /> : <Menu size={26} strokeWidth={2.5} />}
          </button>

        </header>

        {/* ================= AREA HALAMAN ================= */}
        <div className="p-6 md:p-10 flex-1">
          {children}
        </div>

      </main>
      
      {/* Overlay Hitam saat menu mobile terbuka */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}