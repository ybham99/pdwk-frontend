import { UserCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast'; // Import toast

export default function Navbar({ role }) {
  const navigate = useNavigate();
  const [identitas, setIdentitas] = useState('Pengguna');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setIdentitas(user.identitas);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    
    // Tambahkan notifikasi sukses saat logout
    toast.success('Berhasil keluar dari sistem.');
    
    navigate('/login');
  };

  return (
    <nav className="h-16 bg-white border-b border-gray-200 fixed top-0 w-full flex items-center justify-between px-6 z-20">
      <div className="font-bold text-lg text-blue-600">
        Pendataan Warga
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UserCircle size={24} className="text-gray-400" />
          <div className="flex flex-col hidden sm:block">
            <span className="font-medium text-gray-800">{identitas}</span>
            <span className="text-xs capitalize text-gray-500">{role}</span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Keluar"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}