import { Link } from 'react-router-dom';
import { Home, Users, FileText, CheckSquare, FileSpreadsheet, Settings, MessageSquare } from 'lucide-react';

export default function Sidebar({ role }) {
  // Menu khusus untuk peran Warga
  const menuWarga = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { name: 'Profil Keluarga', icon: <Users size={20} />, path: '/profil' },
    { name: 'Pembaruan Data', icon: <FileText size={20} />, path: '/pembaruan' },
    // { name: 'Riwayat', icon: <CheckSquare size={20} />, path: '/riwayat' },
    { name: 'Pengaduan', icon: <MessageSquare size={20} />, path: '/pengaduan' },
  ];

  // Menu khusus untuk peran Pengurus RW/RT
  const menuPengurus = [
    { name: 'Dashboard RW/RT', icon: <Home size={20} />, path: '/pengurus/dashboard' },
    { name: 'Daftar Warga', icon: <Users size={20} />, path: '/pengurus/warga' },
    { name: 'Verifikasi Data', icon: <CheckSquare size={20} />, path: '/pengurus/verifikasi' },
    { name: 'Laporan & Ekspor', icon: <FileSpreadsheet size={20} />, path: '/pengurus/laporan' },
    { name: 'Pengaturan', icon: <Settings size={20} />, path: '/pengurus/pengaturan' },
  ];

  const menuAktif = role === 'warga' ? menuWarga : menuPengurus;

  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 pt-16 z-10">
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
          Menu {role === 'warga' ? 'Warga' : 'Pengurus'}
        </div>
        {menuAktif.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}