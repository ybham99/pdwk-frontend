import { useState, useEffect } from 'react';
import { Send, AlertCircle, Plus, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function FormPembaruan() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Data Kartu Keluarga
  const [formData, setFormData] = useState({ no_kk: '', alamat: '', rt: '', rw: '' });
  
  // State untuk Daftar Anggota Keluarga (Dinamis)
  const [anggota, setAnggota] = useState([
    { nik: '', nama: '', jk: 'L', tgl_lahir: '', hubungan: 'Kepala Keluarga', pendidikan: 'SMA', pekerjaan: '', no_telepon: '' }
  ]);

  // Cek apakah user sudah punya data sebelumnya (untuk di-edit)
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      fetch(`http://localhost:5000/api/profil/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.kk) {
            setFormData({ no_kk: data.kk.no_kk, alamat: data.kk.alamat, rt: data.kk.rt, rw: data.kk.rw });
            // Format ulang anggota dari database
            const anggotaDb = data.anggota.map(a => ({
              nik: a.nik, nama: a.nama_lengkap, jk: a.jenis_kelamin, 
              tgl_lahir: a.tanggal_lahir ? a.tanggal_lahir.split('T')[0] : '', 
              hubungan: a.hubungan_keluarga, pendidikan: a.pendidikan, pekerjaan: a.pekerjaan, no_telepon: a.no_telepon || ''
            }));
            if (anggotaDb.length > 0) setAnggota(anggotaDb);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, []);

  // Fungsi mengubah data form anggota spesifik
  const handleAnggotaChange = (index, field, value) => {
    const newAnggota = [...anggota];
    newAnggota[index][field] = value;
    setAnggota(newAnggota);
  };

  // Fungsi menambah baris anggota
  const tambahAnggota = () => {
    setAnggota([...anggota, { nik: '', nama: '', jk: 'L', tgl_lahir: '', hubungan: 'Anak', pendidikan: 'SD', pekerjaan: 'Pelajar', no_telepon: '' }]);
  };

  // Fungsi menghapus baris anggota
  const hapusAnggota = (index) => {
    if (anggota.length === 1) return toast.error("Minimal harus ada 1 anggota keluarga (Kepala Keluarga).");
    const newAnggota = anggota.filter((_, i) => i !== index);
    setAnggota(newAnggota);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Mengirim data...');

    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr);

    try {
      const response = await fetch('http://localhost:5000/api/simpan-data-keluarga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: user.id,
          no_kk: formData.no_kk,
          alamat: formData.alamat,
          rt: formData.rt,
          rw: formData.rw,
          anggota: anggota
        }),
      });

      if (response.ok) {
        toast.success('Data berhasil dikirim dan menunggu verifikasi!', { id: toastId });
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        const errorData = await response.json();
        toast.error(`Gagal: ${errorData.error}`, { id: toastId, duration: 6000 });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan pada server.', { id: toastId });
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-gray-500 flex justify-center py-20"><Loader2 className="animate-spin mr-2" /> Memuat formulir...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Formulir Pendataan Keluarga</h1>
        <p className="text-gray-600 mt-1">Isi atau perbarui data Kartu Keluarga dan anggota keluarga Anda.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3 text-blue-800 text-sm">
        <AlertCircle size={20} className="mt-0.5 shrink-0" />
        <p>Mohon isi data dengan lengkap dan sesuai dengan Kartu Keluarga asli. Anda dapat menambahkan anggota keluarga dengan menekan tombol <b>Tambah Anggota</b> di bagian bawah.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: DATA KARTU KELUARGA */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Informasi Kartu Keluarga</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor KK</label>
              <input type="text" required value={formData.no_kk} onChange={(e) => setFormData({...formData, no_kk: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
              <input type="text" required value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RT</label>
                <input type="text" required value={formData.rt} onChange={(e) => setFormData({...formData, rt: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="01" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RW</label>
                <input type="text" required value={formData.rw} onChange={(e) => setFormData({...formData, rw: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="05" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: DAFTAR ANGGOTA KELUARGA */}
        <div className="space-y-4">
          {anggota.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Anggota #{index + 1} - {item.hubungan}</h2>
                <button type="button" onClick={() => hapusAnggota(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm">
                  <Trash2 size={16} /> Hapus
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">NIK</label>
                  <input type="text" required value={item.nik} onChange={(e) => handleAnggotaChange(index, 'nik', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Nama Lengkap</label>
                  <input type="text" required value={item.nama} onChange={(e) => handleAnggotaChange(index, 'nama', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Status Hubungan</label>
                  <select value={item.hubungan} onChange={(e) => handleAnggotaChange(index, 'hubungan', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Kepala Keluarga">Kepala Keluarga</option>
                    <option value="Istri">Istri</option>
                    <option value="Anak">Anak</option>
                    <option value="Kerabat Lain">Kerabat Lain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Jenis Kelamin</label>
                  <select value={item.jk} onChange={(e) => handleAnggotaChange(index, 'jk', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Tanggal Lahir</label>
                  <input type="date" required value={item.tgl_lahir} onChange={(e) => handleAnggotaChange(index, 'tgl_lahir', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Pekerjaan</label>
                  <input type="text" required value={item.pekerjaan} onChange={(e) => handleAnggotaChange(index, 'pekerjaan', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Pendidikan</label>
                  <select value={item.pendidikan} onChange={(e) => handleAnggotaChange(index, 'pendidikan', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="SD">SD Sederajat</option>
                    <option value="SMP">SMP Sederajat</option>
                    <option value="SMA">SMA Sederajat</option>
                    <option value="D3">D3 / Diploma</option>
                    <option value="S1">S1 / Sarjana</option>
                    <option value="S2">S2 / Magister</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1">No. HP / WhatsApp (Opsional)</label>
                  <input type="text" value={item.no_telepon} onChange={(e) => handleAnggotaChange(index, 'no_telepon', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TOMBOL TAMBAH ANGGOTA & SUBMIT */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <button type="button" onClick={tambahAnggota} className="w-full sm:w-auto px-5 py-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
            <Plus size={18} /> Tambah Anggota Keluarga
          </button>
          
          <div className="flex w-full sm:w-auto gap-3">
            <button type="button" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
              Batal
            </button>
            <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Kirim Pendataan
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}