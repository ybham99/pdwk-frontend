import { useEffect, useState } from 'react';
import { Edit, MapPin, User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilKeluarga() {
  const [dataKK, setDataKK] = useState(null);
  const [anggotaKeluarga, setAnggotaKeluarga] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mengambil data dari Backend saat halaman pertama kali dibuka
  useEffect(() => {
    // Ambil data user yang login dari localStorage
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      const user = JSON.parse(userStr);
      
      // Lakukan request (fetch) ke API Node.js
      fetch(`http://localhost:5000/api/profil/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.kk) {
            setDataKK(data.kk);
            setAnggotaKeluarga(data.anggota);
          }
          setLoading(false); // Matikan status loading
        })
        .catch((err) => {
          console.error("Gagal menarik data:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="text-gray-500">Memuat data dari server...</div>;
  }

  if (!dataKK) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Data keluarga belum tersedia. Silakan hubungi Pengurus RT/RW Anda.
      </div>
    );
  }

  // Mencari nama Kepala Keluarga dari tabel anggota
  const kepalaKeluarga = anggotaKeluarga.find(a => a.hubungan_keluarga === 'Kepala Keluarga');
  const namaKepala = kepalaKeluarga ? kepalaKeluarga.nama_lengkap : 'Belum Terdata';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profil Keluarga</h1>
          <p className="text-gray-600 mt-1">Detail informasi Kartu Keluarga dan anggota keluarga Anda.</p>
        </div>
        <Link to="/pembaruan" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-fit">
          <Edit size={18} />
          <span>Perbarui Data</span>
        </Link>
      </div>

      {/* Kartu Informasi KK (Menggunakan Data Asli) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={20} /></div>
            <div>
              <p className="text-sm text-gray-500">Kepala Keluarga</p>
              <p className="font-semibold text-gray-800">{namaKepala}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
            <div>
              <p className="text-sm text-gray-500">Nomor Kartu Keluarga (KK)</p>
              <p className="font-semibold text-gray-800">{dataKK.no_kk}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MapPin size={20} /></div>
            <div>
              <p className="text-sm text-gray-500">Alamat Lengkap</p>
              <p className="font-semibold text-gray-800">{dataKK.alamat}</p>
              <p className="text-sm text-gray-600 mt-1">RT {dataKK.rt} / RW {dataKK.rw}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Anggota Keluarga (Menggunakan Data Asli) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-800">Daftar Anggota Keluarga</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-3 font-medium">No</th>
                <th className="px-6 py-3 font-medium">NIK</th>
                <th className="px-6 py-3 font-medium">Nama Lengkap</th>
                <th className="px-6 py-3 font-medium">Status Hubungan</th>
                <th className="px-6 py-3 font-medium">Jenis Kelamin</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {anggotaKeluarga.map((anggota, index) => (
                <tr key={anggota.id_anggota} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{anggota.nik}</td>
                  <td className="px-6 py-4 font-medium">{anggota.nama_lengkap}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${anggota.hubungan_keluarga === 'Kepala Keluarga' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {anggota.hubungan_keluarga}
                    </span>
                  </td>
                  <td className="px-6 py-4">{anggota.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}