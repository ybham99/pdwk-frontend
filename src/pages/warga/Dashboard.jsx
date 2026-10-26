import { useState, useEffect } from 'react';
import { FileText, Users, Clock, CheckCircle, AlertCircle, Loader2, Megaphone, Bell, History, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardWarga() {
  const [profil, setProfil] = useState({ kk: null, anggota: [] });
  const [user, setUser] = useState({ nama: 'Warga' });
  const [loading, setLoading] = useState(true);
  
  // State untuk Papan Pengumuman & Efek Animasi Emote
  const [pengumuman, setPengumuman] = useState([]);
  const [loadingPengumuman, setLoadingPengumuman] = useState(true);
  const [floatingEmotes, setFloatingEmotes] = useState([]);

  // Ambil Data Profil User
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);

      fetch(`http://localhost:5000/api/profil/${userData.id}`)
        .then(res => res.json())
        .then(data => {
          setProfil(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Gagal memuat profil:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Ambil Data Pengumuman Dinamis
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
    fetchPengumuman();
  }, []);

  // ================= FUNGSI REAKSI & ANIMASI TERBANG =================
  const handleReaksi = async (e, id_pengumuman, emote) => {
    if (!user.id) return;

    // 1. Tangkap posisi klik mouse/jari untuk memunculkan animasi tepat di tombol
    const rect = e.currentTarget.getBoundingClientRect();
    const newAnim = {
      id: Date.now(), // ID unik
      emote: emote,
      x: rect.left + rect.width / 2,
      y: rect.top
    };

    // 2. Munculkan emote terbang di layar
    setFloatingEmotes(prev => [...prev, newAnim]);

    // 3. Hapus elemen animasi setelah 1 detik agar memori tidak penuh
    setTimeout(() => {
      setFloatingEmotes(prev => prev.filter(anim => anim.id !== newAnim.id));
    }, 1000);

    // 4. Kirim reaksi ke database secara background
    try {
      await fetch(`http://localhost:5000/api/pengumuman/${id_pengumuman}/reaksi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_user: user.id, emote })
      });
      fetchPengumuman(); 
    } catch (error) {
      console.error('Gagal mengirim reaksi', error);
    }
  };

  const formatTanggalDinamis = (isoString) => {
    return new Date(isoString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="flex justify-center py-20 text-gray-500"><Loader2 className="animate-spin mr-2" /> Memuat dashboard...</div>;
  }

  const statusPendataan = profil.kk ? profil.kk.status_pendataan : 'belum_mengisi';
  const totalAnggota = profil.anggota.length;
  const noKK = profil.kk ? profil.kk.no_kk : 'Belum Ada Data';
  const kepalaKeluarga = profil.anggota.find(a => a.hubungan_keluarga === 'Kepala Keluarga')?.nama_lengkap || user.nama;

  const getNotifikasiOtomatis = () => {
    const tanggalSekarang = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    switch (statusPendataan) {
      case 'disetujui': return [{ id: 1, tanggal: tanggalSekarang, judul: 'Verifikasi Data Berhasil', pesan: 'Data kependudukan Anda telah diperiksa dan disetujui oleh Pengurus RT/RW. Terima kasih atas partisipasi Anda.', bgClass: 'bg-green-50/50', textClass: 'text-green-900', pClass: 'text-green-700' }];
      case 'perlu_diperbaiki': return [{ id: 1, tanggal: tanggalSekarang, judul: 'Perbaikan Data Diperlukan', pesan: 'Pengurus menemukan ketidaksesuaian pada data yang Anda inputkan. Silakan periksa kembali dan perbarui data keluarga Anda.', bgClass: 'bg-red-50/50', textClass: 'text-red-900', pClass: 'text-red-700' }];
      case 'menunggu_verifikasi': return [{ id: 1, tanggal: tanggalSekarang, judul: 'Data Sedang Diproses', pesan: 'Data Anda telah masuk ke dalam sistem dan sedang dalam antrean pengecekan oleh Pengurus.', bgClass: 'bg-yellow-50/50', textClass: 'text-yellow-900', pClass: 'text-yellow-700' }];
      default: return [{ id: 1, tanggal: tanggalSekarang, judul: 'Selamat Datang di PDWK', pesan: 'Silakan isi formulir data keluarga Anda untuk memulai proses pendataan warga.', bgClass: 'bg-gray-50/50', textClass: 'text-gray-900', pClass: 'text-gray-700' }];
    }
  };

  const getRiwayatOtomatis = () => {
    const riwayatList = [{ id: 1, tanggal: 'Sistem', aksi: 'Akun warga berhasil dibuat' }];
    if (statusPendataan !== 'belum_mengisi') riwayatList.unshift({ id: 2, tanggal: 'Sistem', aksi: 'Mengirim formulir pendataan' });
    if (statusPendataan === 'disetujui') riwayatList.unshift({ id: 3, tanggal: 'Sistem', aksi: 'Pengurus menyetujui data Anda' });
    else if (statusPendataan === 'perlu_diperbaiki') riwayatList.unshift({ id: 3, tanggal: 'Sistem', aksi: 'Pengurus meminta perbaikan data' });
    return riwayatList;
  };

  const notifikasiDinamis = getNotifikasiOtomatis();
  const riwayatDinamis = getRiwayatOtomatis();

  const daftarPengumuman = [
    { id: 1, judul: 'Event Semarak 17 Agustusan', tanggal: 'Agustus Mendatang', deskripsi: 'Mari meriahkan berbagai perlombaan dan malam puncak perayaan kemerdekaan RI di lapangan utama komplek. Pendaftaran lomba dapat dilakukan di ketua RT masing-masing.', gambar: '/17an.jpg' },
    { id: 2, judul: 'Program Imunisasi Anak', tanggal: 'Setiap Minggu Ke-2', deskripsi: 'Kader posyandu akan mengadakan imunisasi rutin untuk balita dan anak-anak. Jangan lupa membawa buku KIA (Kesehatan Ibu dan Anak).', gambar: '/imunisasi.jpg' },
    { id: 3, judul: 'Penimbangan & Cek Darah Rutin', tanggal: 'Sabtu, Akhir Bulan', deskripsi: 'Tersedia layanan penimbangan balita dan lansia, serta pemeriksaan tekanan darah dan gula darah gratis untuk warga. Tersedia juga program donor darah.', gambar: '/darah.jpg' },
    { id: 4, judul: 'Pembaruan Pembangunan Masjid', tanggal: 'Info Berkelanjutan', deskripsi: 'Tahap pengecoran atap masjid komplek telah selesai. Panitia pembangunan masih menerima donasi material maupun infak untuk tahap finishing.', gambar: '/masjid.jpg' }
  ];

  return (
    <div className="space-y-8 pb-10 relative">
      
      {/* ================= INJEKSI CSS UNTUK ANIMASI TERBANG ================= */}
      <style>{`
        @keyframes flyAndFade {
          0% { transform: translate(-50%, 0) scale(0.5); opacity: 0.8; }
          50% { transform: translate(-50%, -60px) scale(2) rotate(15deg); opacity: 1; }
          100% { transform: translate(-50%, -100px) scale(2.5); opacity: 0; }
        }
        .animate-fly-emote {
          animation: flyAndFade 0.8s cubic-bezier(0.2, 1, 0.3, 1) forwards;
          text-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
      `}</style>

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Selamat datang, {user.nama}!</h1>
        <p className="text-gray-600 mt-1">Pantau dan perbarui data kependudukan keluarga Anda di sini.</p>
      </div>

      {statusPendataan === 'belum_mengisi' && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 text-red-800 shadow-sm">
          <AlertCircle className="mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900">Data Belum Diisi</h3>
            <p className="text-sm mt-1 mb-3">Anda belum mengisi formulir pendataan. Segera lengkapi data keluarga Anda.</p>
            <Link to="/pembaruan" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-block">Isi Formulir Sekarang</Link>
          </div>
        </div>
      )}

      {statusPendataan === 'menunggu_verifikasi' && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3 text-yellow-800 shadow-sm">
          <Clock className="mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-900">Menunggu Verifikasi</h3>
            <p className="text-sm mt-1">Data Anda telah dikirim dan sedang menunggu pengecekan oleh pengurus RT/RW.</p>
          </div>
        </div>
      )}

      {statusPendataan === 'disetujui' && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3 text-green-800 shadow-sm">
          <CheckCircle className="mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-green-900">Data Telah Disetujui</h3>
            <p className="text-sm mt-1">Terima kasih, data keluarga Anda telah terverifikasi dan up-to-date.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden transition-all hover:shadow-md">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -z-10"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium">Nomor Kartu Keluarga</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20} /></div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">{noKK}</p>
          <p className="text-sm text-gray-500">Kepala Keluarga: <span className="font-medium text-gray-700">{kepalaKeluarga}</span></p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden transition-all hover:shadow-md">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-full -z-10"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium">Total Anggota Keluarga</h3>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Users size={20} /></div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">{totalAnggota} Orang</p>
          {totalAnggota > 0 && (
             <Link to="/pembaruan" className="text-sm text-blue-600 hover:underline inline-flex items-center mt-1 font-medium">Lihat Detail Anggota →</Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
            <Bell size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-800">Pesan & Notifikasi Pengurus</h3>
          </div>
          <div className="divide-y divide-gray-100 flex-1">
            {notifikasiDinamis.map((notif) => (
              <div key={notif.id} className={`p-6 ${notif.bgClass}`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-bold ${notif.textClass}`}>{notif.judul}</h4>
                  <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-md">{notif.tanggal}</span>
                </div>
                <p className={`text-sm leading-relaxed ${notif.pClass}`}>{notif.pesan}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
            <History size={20} className="text-gray-600" />
            <h3 className="font-bold text-gray-800">Status Aktivitas</h3>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {riwayatDinamis.map((item) => (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-4 h-4 rounded-full border-2 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${statusPendataan === 'disetujui' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="text-sm font-medium text-gray-700">{item.aksi}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-8">
        <div className="flex items-center gap-2 mb-6 pb-3">
          <MessageCircle className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Pemberitahuan Terkini (Interaktif)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loadingPengumuman ? (
            <div className="col-span-full flex items-center justify-center py-8 text-gray-500"><Loader2 className="animate-spin mr-2" /> Memuat pemberitahuan...</div>
          ) : pengumuman.length === 0 ? (
            <div className="col-span-full bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
              Belum ada pemberitahuan baru dari pengurus.
            </div>
          ) : (
            pengumuman.map(item => (
              <div key={item.id_pengumuman} className="bg-white p-5 rounded-xl shadow-sm border border-blue-100 transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow">RT</div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">Pengurus RT/RW</h3>
                    <p className="text-xs text-gray-500">{formatTanggalDinamis(item.tanggal_dibuat)}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 whitespace-pre-wrap mb-5 leading-relaxed text-sm">{item.isi_pengumuman}</p>
                
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                  <button onClick={(e) => handleReaksi(e, item.id_pengumuman, '👍')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-blue-50 active:scale-75 active:bg-blue-100 rounded-full text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-blue-300 shadow-sm cursor-pointer select-none">
                    <span>👍</span> <span className="text-gray-700">{item.jempol}</span>
                  </button>
                  <button onClick={(e) => handleReaksi(e, item.id_pengumuman, '❤️')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-red-50 active:scale-75 active:bg-red-100 rounded-full text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-red-300 shadow-sm cursor-pointer select-none">
                    <span>❤️</span> <span className="text-gray-700">{item.hati}</span>
                  </button>
                  <button onClick={(e) => handleReaksi(e, item.id_pengumuman, '😂')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-yellow-50 active:scale-75 active:bg-yellow-100 rounded-full text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-yellow-300 shadow-sm cursor-pointer select-none">
                    <span>😂</span> <span className="text-gray-700">{item.ketawa}</span>
                  </button>
                  <button onClick={(e) => handleReaksi(e, item.id_pengumuman, '😢')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-blue-50 active:scale-75 active:bg-blue-100 rounded-full text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-blue-300 shadow-sm cursor-pointer select-none">
                    <span>😢</span> <span className="text-gray-700">{item.sedih}</span>
                  </button>
                  <button onClick={(e) => handleReaksi(e, item.id_pengumuman, '😡')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-red-50 active:scale-75 active:bg-red-100 rounded-full text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-red-300 shadow-sm cursor-pointer select-none">
                    <span>😡</span> <span className="text-gray-700">{item.marah}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-10 border-t border-gray-200 pt-8">
        <div className="flex items-center gap-2 mb-6 pb-3">
          <Megaphone className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Informasi & Pengumuman Lingkungan</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {daftarPengumuman.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row group">
              <div className="sm:w-2/5 h-48 sm:h-auto shrink-0 overflow-hidden relative">
                <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-5 flex flex-col justify-center flex-1">
                <div className="mb-3">
                  <h3 className="font-bold text-gray-800 text-lg leading-snug mb-2 group-hover:text-blue-600 transition-colors">{item.judul}</h3>
                  <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md">{item.tanggal}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= RENDER ANIMASI EMOTE MELAYANG ================= */}
      {floatingEmotes.map(anim => (
        <div
          key={anim.id}
          className="fixed pointer-events-none z-50 text-4xl animate-fly-emote select-none"
          style={{ left: anim.x, top: anim.y }}
        >
          {anim.emote}
        </div>
      ))}
      
    </div>
  );
}