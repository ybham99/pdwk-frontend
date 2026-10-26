import { useEffect, useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifikasiData() {
  const [dataMenunggu, setDataMenunggu] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data dari backend
  const fetchDaftarTunggu = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/verifikasi');
      const data = await response.json();
      setDataMenunggu(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Panggil fungsi fetch saat halaman pertama dibuka
  useEffect(() => {
    fetchDaftarTunggu();
  }, []);

  // Fungsi saat tombol Setujui atau Tolak diklik
  const handleAksi = async (id_kk, status_baru) => {
    const pesan = status_baru === 'disetujui' 
      ? 'Setujui pembaruan data ini?' 
      : 'Kembalikan data ini untuk diperbaiki warga?';
      
    if (!window.confirm(pesan)) return;
    
    const toastId = toast.loading('Memproses...'); // Toast loading

    try {
      const response = await fetch(`http://localhost:5000/api/verifikasi/${id_kk}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_baru }),
      });

      if (response.ok) {
        toast.success('Berhasil memproses data!', { id: toastId }); // Toast sukses
        fetchDaftarTunggu(); 
      } else {
        toast.error('Gagal memproses data.', { id: toastId }); // Toast gagal
      }
    } catch (error) {
      toast.error('Terjadi kesalahan server.', { id: toastId }); // Toast error server
    }
  };

  if (loading) {
    return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin" /> Memuat data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Verifikasi Data Warga</h1>
        <p className="text-gray-600 mt-1">Periksa dan setujui pembaruan data yang dikirim oleh warga.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {dataMenunggu.map((item) => (
          <div key={item.id_kk} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">{item.kepala}</h3>
              <p className="text-gray-500 text-sm mt-1">No KK: {item.no_kk}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleAksi(item.id_kk, 'perlu_diperbaiki')}
                className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors" 
                title="Kembalikan/Tolak"
              >
                <X size={20} />
              </button>
              <button 
                onClick={() => handleAksi(item.id_kk, 'disetujui')}
                className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-colors" 
                title="Setujui"
              >
                <Check size={20} />
              </button>
            </div>
          </div>
        ))}

        {dataMenunggu.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
            <Check size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Hebat! Tidak ada data yang menunggu verifikasi saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}