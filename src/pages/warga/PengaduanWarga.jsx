import { useState, useEffect } from 'react';
import { Send, Clock, CheckCircle, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PengaduanWarga() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({ judul: '', kategori: 'Keamanan', deskripsi: '' });
  const [daftarPengaduan, setDaftarPengaduan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Ambil data pengaduan dari backend
  const fetchPengaduan = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/pengaduan/warga/${user.id}`);
      const data = await response.json();
      setDaftarPengaduan(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchPengaduan();
  }, [user?.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Kirim data ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading('Mengirim pesan...');

    try {
      const response = await fetch('http://localhost:5000/api/pengaduan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: user.id,
          judul: formData.judul,
          kategori: formData.kategori,
          deskripsi: formData.deskripsi
        }),
      });

      if (response.ok) {
        toast.success('Pesan berhasil dikirim!', { id: toastId });
        setFormData({ judul: '', kategori: 'Keamanan', deskripsi: '' }); // Reset form
        fetchPengaduan(); // Refresh data riwayat
      } else {
        toast.error('Gagal mengirim pesan.', { id: toastId });
      }
    } catch (error) {
      toast.error('Terjadi kesalahan server.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'Selesai': 
        return <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-md"><CheckCircle size={14} /> Selesai</span>;
      case 'Diproses': 
        return <span className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md"><AlertCircle size={14} /> Diproses</span>;
      default: 
        return <span className="flex items-center gap-1 text-xs font-bold text-yellow-700 bg-yellow-100 px-2.5 py-1 rounded-md"><Clock size={14} /> Menunggu</span>;
    }
  };

  // Format tanggal menjadi format Indonesia
  const formatTanggal = (isoString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(isoString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pengaduan & Pesan Warga</h1>
        <p className="text-gray-600 mt-1">Kirimkan keluhan atau pesan langsung ke pengurus RT/RW.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulir Kirim Pesan */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare size={20} className="text-teal-600" /> Kirim Pesan
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Judul / Subjek</label>
              <input 
                type="text" name="judul" value={formData.judul} onChange={handleChange} required disabled={submitting}
                placeholder="Contoh: Lampu jalan mati"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
              <select 
                name="kategori" value={formData.kategori} onChange={handleChange} disabled={submitting}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="Keamanan">Keamanan</option>
                <option value="Kebersihan">Kebersihan</option>
                <option value="Fasilitas Umum">Fasilitas Umum</option>
                <option value="Administrasi">Administrasi</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Isi Pesan / Keluhan</label>
              <textarea 
                name="deskripsi" value={formData.deskripsi} onChange={handleChange} required rows="4" disabled={submitting}
                placeholder="Tuliskan keluhan atau pesan Anda secara detail..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none resize-none"
              ></textarea>
            </div>
            <button type="submit" disabled={submitting} className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} 
              Kirim ke Pengurus
            </button>
          </form>
        </div>

        {/* Riwayat & Balasan Pengurus */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Riwayat Pesan & Tanggapan</h2>
          
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin" /> Memuat data...</div>
          ) : daftarPengaduan.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center text-gray-500">
              Belum ada riwayat pengaduan.
            </div>
          ) : (
            daftarPengaduan.map((item) => (
              <div key={item.id_pengaduan} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">{item.kategori}</span>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">{item.judul}</h3>
                    </div>
                    {renderStatus(item.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.deskripsi}</p>
                  <div className="text-xs text-gray-400 mt-3 font-medium">Dikirim: {formatTanggal(item.tanggal_dibuat)}</div>
                </div>
                
                {/* Box Balasan Pengurus */}
                {item.tanggapan_pengurus && (
                  <div className="bg-teal-50/60 border-t border-teal-100 p-5 flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      RT
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-teal-900 mb-1">Balasan Pengurus</h4>
                      <p className="text-sm text-teal-800 leading-relaxed">{item.tanggapan_pengurus}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}