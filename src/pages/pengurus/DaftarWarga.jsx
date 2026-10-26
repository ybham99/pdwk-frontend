import { useEffect, useState } from 'react';
import { Search, FileSpreadsheet, Loader2, Trash2, Eye, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export default function DaftarWarga() {
  const [dataWarga, setDataWarga] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State untuk Pop-up Modal Detail
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = () => {
    fetch('http://localhost:5000/api/warga')
      .then(res => res.json())
      .then(data => {
        setDataWarga(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Fungsi Lihat Detail ---
  const handleViewDetail = async (no_kk) => {
    const toastId = toast.loading('Memuat data...');
    try {
      const response = await fetch(`http://localhost:5000/api/warga/${no_kk}/detail`);
      if (response.ok) {
        const data = await response.json();
        setModalData(data);
        setIsModalOpen(true);
        toast.dismiss(toastId); // Tutup loading jika sukses
      } else {
        toast.error('Gagal memuat detail.', { id: toastId });
      }
    } catch (error) {
      toast.error('Terjadi kesalahan server.', { id: toastId });
    }
  };

  // --- Fungsi Hapus ---
  const handleDelete = async (no_kk, namaKepala) => {
    if (!window.confirm(`Yakin ingin menghapus seluruh data keluarga ${namaKepala} (No KK: ${no_kk})?`)) return;
    
    const toastId = toast.loading('Menghapus data...');
    try {
      const response = await fetch(`http://localhost:5000/api/warga/${no_kk}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Data dihapus!', { id: toastId });
        setDataWarga(dataWarga.filter(warga => warga.no_kk !== no_kk));
      } else {
        toast.error('Gagal menghapus data.', { id: toastId });
      }
    } catch (error) {
      toast.error('Terjadi kesalahan server.', { id: toastId });
    }
  };

  const dataFiltered = dataWarga.filter(warga => 
    warga.kepala.toLowerCase().includes(searchTerm.toLowerCase()) || 
    warga.no_kk.includes(searchTerm)
  );

  const handleExportExcel = () => {
    if (dataWarga.length === 0) return toast.error("Tidak ada data untuk diekspor!");
    const dataExcel = dataFiltered.map((warga, index) => ({
      'No': index + 1,
      'Nomor KK': warga.no_kk,
      'Kepala Keluarga': warga.kepala,
      'RT': warga.rt,
      'RW': warga.rw,
      'Status Pendataan': warga.status_pendataan.replace('_', ' ').toUpperCase()
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Warga");
    XLSX.writeFile(workbook, "Rekapitulasi_Data_Warga.xlsx");
  };

  if (loading) return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin" /> Memuat data...</div>;

  return (
    <div className="space-y-6">
      {/* --- BAGIAN POP-UP MODAL DETAIL --- */}
      {isModalOpen && modalData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Detail Kartu Keluarga</h2>
                <p className="text-sm text-gray-500">No. KK: {modalData.kk.no_kk}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex flex-col md:flex-row gap-4 justify-between text-sm">
                <div><span className="font-semibold block">Alamat:</span> {modalData.kk.alamat}</div>
                <div><span className="font-semibold block">RT/RW:</span> {modalData.kk.rt} / {modalData.kk.rw}</div>
                <div><span className="font-semibold block">Status Pendataan:</span> <span className="uppercase">{modalData.kk.status_pendataan.replace('_', ' ')}</span></div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Daftar Anggota Keluarga</h3>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-4 py-3 font-medium">NIK</th>
                        <th className="px-4 py-3 font-medium">Nama Lengkap</th>
                        <th className="px-4 py-3 font-medium">Hubungan</th>
                        <th className="px-4 py-3 font-medium">L/P</th>
                        <th className="px-4 py-3 font-medium">Pendidikan</th>
                        <th className="px-4 py-3 font-medium">Pekerjaan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {modalData.anggota.map((ang, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">{ang.nik}</td>
                          <td className="px-4 py-3">{ang.nama_lengkap}</td>
                          <td className="px-4 py-3 font-semibold text-blue-600">{ang.hubungan_keluarga}</td>
                          <td className="px-4 py-3">{ang.jenis_kelamin}</td>
                          <td className="px-4 py-3">{ang.pendidikan}</td>
                          <td className="px-4 py-3">{ang.pekerjaan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- BAGIAN HALAMAN UTAMA --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Warga</h1>
          <p className="text-gray-600 mt-1">Kelola, lihat detail, dan ekspor data seluruh kartu keluarga.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input type="text" placeholder="Cari nama atau No KK..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64" />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button onClick={handleExportExcel} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
            <FileSpreadsheet size={18} /> Ekspor Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium">No KK</th>
                <th className="px-6 py-4 font-medium">Kepala Keluarga</th>
                <th className="px-6 py-4 font-medium">RT/RW</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {dataFiltered.length > 0 ? (
                dataFiltered.map((warga, index) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{warga.no_kk}</td>
                    <td className="px-6 py-4">{warga.kepala}</td>
                    <td className="px-6 py-4">{warga.rt} / {warga.rw}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium 
                        ${warga.status_pendataan === 'disetujui' ? 'bg-green-100 text-green-700' : 
                          warga.status_pendataan === 'belum_mengisi' ? 'bg-gray-100 text-gray-600' : 
                          'bg-yellow-100 text-yellow-700'}`}>
                        {warga.status_pendataan.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      {/* Tombol Lihat Detail (Mata Biru) */}
                      <button 
                        onClick={() => handleViewDetail(warga.no_kk)}
                        className="p-2 text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                        title="Lihat Detail Keluarga"
                      >
                        <Eye size={18} />
                      </button>
                      
                      {/* Tombol Hapus (Tong Sampah Merah) */}
                      <button 
                        onClick={() => handleDelete(warga.no_kk, warga.kepala)}
                        className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        title="Hapus Data"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Data warga tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}