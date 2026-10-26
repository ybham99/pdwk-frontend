import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Reply, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PengaduanPengurus() {
  const [daftarPengaduan, setDaftarPengaduan] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Pop-up Balasan
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyData, setReplyData] = useState({ id: null, nama: '', judul: '', status: 'Diproses', tanggapan: '' });

  // State untuk menyimpan ID kartu yang akan diberi animasi menghilang
  const [vanishingId, setVanishingId] = useState(null);

  const fetchPengaduan = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pengaduan');
      const data = await response.json();
      setDaftarPengaduan(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengaduan();
  }, []);

  const openReplyModal = (item) => {
    setReplyData({
      id: item.id_pengaduan,
      nama: item.nama_warga,
      judul: item.judul,
      status: item.status !== 'Menunggu' ? item.status : 'Diproses',
      tanggapan: item.tanggapan_pengurus || ''
    });
    setModalOpen(true);
  };

  const handleKirimBalasan = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading('Mengirim tanggapan...');

    try {
      const response = await fetch(`http://localhost:5000/api/pengaduan/${replyData.id}/tanggapan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: replyData.status,
          tanggapan_pengurus: replyData.tanggapan
        }),
      });

      if (response.ok) {
        toast.success('Tanggapan berhasil dikirim!', { id: toastId });
        setModalOpen(false);

        // LOGIKA EFEK MENGHILANG
        if (replyData.status === 'Selesai') {
          // 1. Ubah status lokal sementara agar label berubah jadi "Selesai" berwarna hijau
          setDaftarPengaduan(prev => 
            prev.map(item => item.id_pengaduan === replyData.id ? { ...item, status: 'Selesai' } : item)
          );
          
          // 2. Picu animasi pada kartu tersebut
          setVanishingId(replyData.id);
          
          // 3. Tunggu animasi selesai (700ms), lalu refresh data bersih dari server
          setTimeout(() => {
            setVanishingId(null);
            fetchPengaduan(); 
          }, 700);
        } else {
          // Jika status bukan selesai, langsung refresh seperti biasa
          fetchPengaduan();
        }

      } else {
        toast.error('Gagal mengirim tanggapan.', { id: toastId });
      }
    } catch (error) {
      toast.error('Terjadi kesalahan server.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'Selesai': return <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-md"><CheckCircle size={14} /> Selesai</span>;
      case 'Diproses': return <span className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md"><AlertCircle size={14} /> Diproses</span>;
      default: return <span className="flex items-center gap-1 text-xs font-bold text-yellow-700 bg-yellow-100 px-2.5 py-1 rounded-md"><Clock size={14} /> Menunggu</span>;
    }
  };

  const formatTanggal = (isoString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(isoString).toLocaleDateString('id-ID', options);
  };

  if (loading) return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin" /> Memuat data...</div>;

  // FILTER: Sembunyikan semua pengaduan yang 'Selesai', KECUALI jika kartu tersebut sedang dalam proses animasi menghilang
  const pengaduanAktif = daftarPengaduan.filter(
    item => item.status !== 'Selesai' || item.id_pengaduan === vanishingId
  );

  return (
    <div className="space-y-6 pb-10 relative">
      
      {/* INJEKSI CSS ANIMASI MENGHILANG */}
      <style>{`
        @keyframes popAndVanish {
          0% { transform: scale(1); opacity: 1; }
          20% { transform: scale(1.05); opacity: 1; background-color: #f0fdf4; border-color: #10b981; }
          100% { transform: scale(0.5) translateY(20px); opacity: 0; filter: blur(4px); }
        }
        .animate-pop-vanish {
          animation: popAndVanish 0.7s cubic-bezier(0.2, 1, 0.3, 1) forwards;
          pointer-events: none;
        }
      `}</style>

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Daftar Pengaduan Aktif</h1>
        <p className="text-gray-600 mt-1">Pantau dan berikan tanggapan untuk keluhan yang belum terselesaikan.</p>
      </div>

      {/* POP-UP MODAL BALASAN */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-teal-900 px-6 py-4 flex justify-between items-center text-white">
              <h2 className="text-lg font-bold flex items-center gap-2"><Reply size={20} /> Balas Pengaduan</h2>
              <button onClick={() => setModalOpen(false)} className="text-teal-200 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleKirimBalasan} className="p-6 space-y-4">
              <div className="bg-teal-50 p-3 rounded-lg border border-teal-100 mb-4">
                <p className="text-xs text-teal-600 font-bold uppercase">Pelapor: {replyData.nama}</p>
                <p className="text-sm font-semibold text-teal-900 mt-1">{replyData.judul}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status Penanganan</label>
                <select 
                  value={replyData.status} 
                  onChange={(e) => setReplyData({...replyData, status: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="Menunggu">Menunggu</option>
                  <option value="Diproses">Sedang Diproses</option>
                  <option value="Selesai">Selesai (Tutup Laporan)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggapan Pengurus</label>
                <textarea 
                  value={replyData.tanggapan} 
                  onChange={(e) => setReplyData({...replyData, tanggapan: e.target.value})}
                  required 
                  rows="4" 
                  placeholder="Tuliskan balasan atau update penanganan di sini..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Batal</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Kirim Balasan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DAFTAR PENGADUAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pengaduanAktif.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
            Hebat! Tidak ada keluhan warga yang tertunda saat ini.
          </div>
        ) : (
          pengaduanAktif.map((item) => (
            <div 
              key={item.id_pengaduan} 
              // Tambahkan class animasi 'animate-pop-vanish' jika ID-nya cocok
              className={`bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden transition-all hover:shadow-md 
                ${item.id_pengaduan === vanishingId ? 'animate-pop-vanish z-10' : ''}
              `}
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">{item.kategori}</div>
                  {renderStatus(item.status)}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.judul}</h3>
                <p className="text-xs text-teal-600 font-semibold mb-3">Dari: {item.nama_warga}</p>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{item.deskripsi}</p>
                <div className="text-xs text-gray-400 mt-4 font-medium flex items-center gap-1">
                  <Clock size={12} /> {formatTanggal(item.tanggal_dibuat)}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
                <button 
                  onClick={() => openReplyModal(item)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors
                    ${item.tanggapan_pengurus 
                      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100' 
                      : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                >
                  {item.tanggapan_pengurus ? 'Edit Balasan' : 'Beri Tanggapan'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}