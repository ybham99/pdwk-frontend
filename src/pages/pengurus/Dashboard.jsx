import { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, AlertCircle, XCircle, RefreshCw, BarChart2, Megaphone, Send, Edit, Trash2, Check, Loader2 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import toast from 'react-hot-toast';

export default function DashboardPengurus() {
  // ================= STATE STATISTIK =================
  const [stats, setStats] = useState({
    total_kk: 0, sudah_mengisi: 0, menunggu: 0, belum_mengisi: 0, perlu_diperbaiki: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // ================= STATE PENGUMUMAN =================
  const [pengumuman, setPengumuman] = useState([]);
  const [loadingPengumuman, setLoadingPengumuman] = useState(true);
  const [formData, setFormData] = useState('');
  const [editData, setEditData] = useState({ id: null, text: '' });
  const [submitting, setSubmitting] = useState(false);

  // ================= FETCH DATA STATISTIK =================
  const fetchStatistik = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('http://localhost:5000/api/statistik');
      const rawData = await res.json();
      const data = Array.isArray(rawData) ? rawData[0] : rawData;

      if (data) {
        setStats({
          total_kk: Number(data.total_kk || data.totalKK || 0),
          sudah_mengisi: Number(data.sudah_mengisi || data.disetujui || 0),
          menunggu: Number(data.menunggu || data.menunggu_verifikasi || 0),
          belum_mengisi: Number(data.belum_mengisi || data.belumMengisi || 0),
          perlu_diperbaiki: Number(data.perlu_diperbaiki || data.perluDiperbaiki || 0)
        });
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Gagal mengambil data statistik:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // ================= FETCH PENGUMUMAN =================
  const fetchPengumuman = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/pengumuman');
      const data = await res.json();
      setPengumuman(data);
    } catch (error) {
      console.error('Gagal memuat pengumuman:', error);
    } finally {
      setLoadingPengumuman(false);
    }
  };

  useEffect(() => {
    fetchStatistik();
    fetchPengumuman(); // Panggil pengumuman saat pertama kali muat

    const intervalId = setInterval(() => {
      fetchStatistik(); // Hanya statistik yang di-refresh tiap 10 detik
    }, 10000); 

    return () => clearInterval(intervalId); 
  }, []);

  // ================= FUNGSI PENGUMUMAN =================
  const handleKirimPengumuman = async (e) => {
    e.preventDefault();
    if (!formData.trim()) return;
    
    setSubmitting(true);
    const toastId = toast.loading('Mengirim pengumuman...');
    try {
      const res = await fetch('http://localhost:5000/api/pengumuman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isi_pengumuman: formData })
      });
      if (res.ok) {
        toast.success('Pengumuman berhasil disebarkan!', { id: toastId });
        setFormData('');
        fetchPengumuman();
      }
    } catch (error) {
      toast.error('Gagal mengirim.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPengumuman = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading('Memperbarui pengumuman...');
    try {
      const res = await fetch(`http://localhost:5000/api/pengumuman/${editData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isi_pengumuman: editData.text })
      });
      if (res.ok) {
        toast.success('Pengumuman diperbarui!', { id: toastId });
        setEditData({ id: null, text: '' });
        fetchPengumuman();
      }
    } catch (error) {
      toast.error('Gagal memperbarui.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleHapusPengumuman = async (id) => {
    if (!window.confirm('Hapus pengumuman ini?')) return;
    const toastId = toast.loading('Menghapus...');
    try {
      const res = await fetch(`http://localhost:5000/api/pengumuman/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Pengumuman dihapus!', { id: toastId });
        fetchPengumuman();
      }
    } catch (error) {
      toast.error('Gagal menghapus.', { id: toastId });
    }
  };

  const formatTanggal = (isoString) => {
    return new Date(isoString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const timeString = lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const getSafeNumber = (val) => isNaN(Number(val)) ? 0 : Number(val);

  const chartData = [
    { name: 'Disetujui', jumlah: getSafeNumber(stats.sudah_mengisi), color: '#10B981' }, 
    { name: 'Menunggu', jumlah: getSafeNumber(stats.menunggu), color: '#F59E0B' },      
    { name: 'Perbaikan', jumlah: getSafeNumber(stats.perlu_diperbaiki), color: '#EF4444' }, 
    { name: 'Belum Diisi', jumlah: getSafeNumber(stats.belum_mengisi), color: '#6B7280' }   
  ];

  const totalDataPie = chartData.reduce((acc, curr) => acc + curr.jumlah, 0);

  return (
    <div className="space-y-6 pb-10 animate-fade-in-up">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Pengurus RW/RT</h1>
          <p className="text-gray-600 mt-1">Pantau progres pendataan warga di wilayah Anda secara real-time.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
          <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
          <span>Update Terakhir: <strong>{timeString}</strong></span>
        </div>
      </div>

      {/* ================= KARTU STATISTIK ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800">{stats.total_kk}</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Total KK</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800">{stats.sudah_mengisi}</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Sudah Disetujui</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800">{stats.menunggu}</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Menunggu Verifikasi</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
            <AlertCircle size={20} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800">{stats.belum_mengisi}</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Belum Mengisi</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <XCircle size={20} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800">{stats.perlu_diperbaiki}</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Perlu Diperbaiki</p>
          </div>
        </div>
      </div>

      {/* ================= DIAGRAM STATISTIK ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Diagram Batang */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Perbandingan Status Pendataan</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} allowDecimals={false} />
                <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="jumlah" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Diagram Donat */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Proporsi Pendataan Warga</h2>
          <div className="h-[300px] w-full flex items-center justify-center relative">
            {totalDataPie > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="jumlah" stroke="none">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center pointer-events-none pb-6">
                  <span className="text-3xl font-bold text-gray-800">{totalDataPie}</span>
                  <span className="text-xs text-gray-500 font-medium">Total Data</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <BarChart2 size={48} className="mb-3 opacity-30" />
                <p>Belum ada data warga untuk ditampilkan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= PAPAN PENGUMUMAN (FITUR BARU) ================= */}
      <div className="border-t border-gray-200 pt-8 mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Megaphone size={24} className="text-teal-600" /> Papan Pengumuman Warga
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Buat Pengumuman */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
              <h3 className="font-bold text-gray-800 mb-3">Buat Pengumuman Baru</h3>
              <form onSubmit={handleKirimPengumuman} className="flex flex-col gap-3">
                <textarea 
                  value={formData} onChange={(e) => setFormData(e.target.value)} required rows="4" disabled={submitting}
                  placeholder="Ketik informasi, undangan, atau pemberitahuan untuk warga di sini..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                ></textarea>
                <button type="submit" disabled={submitting} className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} Sebarkan ke Warga
                </button>
              </form>
            </div>
          </div>

          {/* Daftar Riwayat Pengumuman */}
          <div className="lg:col-span-2 space-y-4">
            {loadingPengumuman ? (
              <div className="flex items-center justify-center py-10 gap-2 text-gray-500"><Loader2 className="animate-spin" /> Memuat pengumuman...</div>
            ) : pengumuman.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500">
                Belum ada pengumuman yang disebarkan.
              </div>
            ) : (
              pengumuman.map(item => (
                <div key={item.id_pengumuman} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3 transition-all hover:shadow-md">
                  {editData.id === item.id_pengumuman ? (
                    // Mode Edit
                    <form onSubmit={handleEditPengumuman} className="flex flex-col gap-2">
                      <textarea value={editData.text} onChange={(e) => setEditData({...editData, text: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none" rows="3" required></textarea>
                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setEditData({id: null, text: ''})} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors">Batal</button>
                        <button type="submit" disabled={submitting} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors">
                          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16}/>} Simpan
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Mode Lihat
                    <>
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed flex-1">{item.isi_pengumuman}</p>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => setEditData({id: item.id_pengumuman, text: item.isi_pengumuman})} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleHapusPengumuman(item.id_pengumuman)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs mt-2 pt-3 border-t border-gray-100">
                        <span className="text-gray-400 font-medium">{formatTanggal(item.tanggal_dibuat)}</span>
                        
                        {/* Rekap Reaksi Emote */}
                        <div className="flex gap-3 text-gray-500 font-medium">
                          <span className="flex items-center gap-1">👍 {item.jempol}</span> 
                          <span className="flex items-center gap-1">❤️ {item.hati}</span> 
                          <span className="flex items-center gap-1">😂 {item.ketawa}</span> 
                          <span className="flex items-center gap-1">😢 {item.sedih}</span> 
                          <span className="flex items-center gap-1">😡 {item.marah}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}