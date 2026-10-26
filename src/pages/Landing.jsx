import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Users, 
  UserPlus, 
  FileText, 
  CheckSquare, 
  Megaphone,
  MapPin, 
  Phone, 
  Mail,
  Globe, 
  MessageCircle, 
  Share2 
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-700 to-green-400 text-white font-sans overflow-x-hidden relative scroll-smooth">
      
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-teal-900/40 backdrop-blur-lg border-b border-white/10 transition-all">
        <div className="flex items-center justify-between px-6 lg:px-12 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src="/logo-pdwk.png" alt="Logo PDWK" className="w-9 h-9 object-contain drop-shadow-sm" />
            <span className="text-2xl font-bold tracking-wider">PDWK</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#beranda" className="hover:text-green-200 transition">Beranda</a>
            <a href="#tentang" className="hover:text-green-200 transition">Tentang</a>
            <a href="#panduan" className="hover:text-green-200 transition">Panduan</a>
          </div>
          <Link 
            to="/login" 
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-2 rounded-full font-semibold transition-all border border-white/30"
          >
            Masuk
          </Link>
        </div>
      </nav>

      {/* ================= BERANDA (HERO SECTION) ================= */}
      <section id="beranda" className="relative z-20 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 pt-32 pb-20 max-w-7xl mx-auto min-h-screen">
        <div className="w-full lg:w-1/2 flex flex-col items-start mb-16 lg:mb-0 z-10 text-center lg:text-left">
          <span className="text-green-200 font-semibold tracking-wider text-sm mb-4 uppercase bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10 inline-block mx-auto lg:mx-0">
            Sistem Informasi Warga
          </span>
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            Cara Baru Kelola Data Lingkungan Lebih Cepat
          </h1>
          <p className="text-teal-100 text-lg mb-10 max-w-lg leading-relaxed mx-auto lg:mx-0">
            Platform terpadu untuk warga komplek. Perbarui data keluarga, pantau informasi lingkungan, dan nikmati layanan administrasi digital secara transparan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mx-auto lg:mx-0 w-full sm:w-auto">
            <Link 
              to="/login" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/40 flex items-center justify-center gap-2"
            >
              Mulai Pendataan <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end z-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-300/20 blur-3xl rounded-full"></div>
          <div className="relative bg-white/10 backdrop-blur-xl p-2 sm:p-4 rounded-3xl border border-white/20 shadow-2xl w-full max-w-lg transform hover:scale-105 transition-transform duration-700">
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex gap-2 z-20">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
               <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="pt-8 sm:pt-10 overflow-hidden rounded-2xl relative bg-black">
               <video 
                 className="w-full h-auto object-cover opacity-90"
                 autoPlay muted loop playsInline
               >
                 <source src="/intro.mp4" type="video/mp4" />
               </video>
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TENTANG SECTION ================= */}
      <section id="tentang" className="relative z-20 py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 drop-shadow-md">Kenapa Menggunakan PDWK?</h2>
          <p className="text-teal-100 max-w-2xl mx-auto text-lg">Membangun lingkungan yang lebih tertib, aman, dan transparan melalui digitalisasi administrasi warga tingkat RT/RW.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 shadow-xl shadow-black/10">
            <div className="bg-green-400/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-green-300">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Cepat & Terintegrasi</h3>
            <p className="text-teal-50/80 leading-relaxed">Tidak perlu lagi repot antre ke rumah RT. Isi data dari mana saja melalui HP, dan pengurus akan memverifikasinya secara instan.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 shadow-xl shadow-black/10">
            <div className="bg-blue-400/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-blue-300">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Data Aman</h3>
            <p className="text-teal-50/80 leading-relaxed">Sistem dilengkapi autentikasi keamanan. Data warga hanya dapat diakses oleh individu yang bersangkutan dan pengurus berwenang.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 shadow-xl shadow-black/10">
            <div className="bg-orange-400/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-orange-300">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Komunitas Terhubung</h3>
            <p className="text-teal-50/80 leading-relaxed">Dapatkan informasi terbaru mengenai lingkungan, mulai dari iuran, jadwal posyandu, hingga undangan kegiatan warga secara real-time.</p>
          </div>
        </div>
      </section>

      {/* ================= PANDUAN SECTION ================= */}
      <section id="panduan" className="relative z-20 py-24 px-6 lg:px-12 max-w-7xl mx-auto bg-black/10 rounded-[3rem] my-10 border border-white/5 backdrop-blur-sm">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 drop-shadow-md">Panduan Penggunaan</h2>
          <p className="text-teal-100 max-w-2xl mx-auto text-lg">Ikuti 4 langkah mudah ini untuk mulai menggunakan portal warga komplek.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-white/20 z-0"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-teal-800 border-4 border-teal-600 rounded-full flex items-center justify-center mb-4 shadow-lg text-white">
              <UserPlus size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">1. Daftar Akun</h3>
            <p className="text-sm text-teal-100">Buat akun baru menggunakan identitas dan email Anda yang aktif.</p>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-teal-800 border-4 border-teal-600 rounded-full flex items-center justify-center mb-4 shadow-lg text-white">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">2. Isi Data Keluarga</h3>
            <p className="text-sm text-teal-100">Masuk ke sistem lalu lengkapi nomor KK dan detail seluruh anggota keluarga.</p>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-teal-800 border-4 border-teal-600 rounded-full flex items-center justify-center mb-4 shadow-lg text-white">
              <CheckSquare size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">3. Tunggu Verifikasi</h3>
            <p className="text-sm text-teal-100">Ketua RT/RW akan memeriksa dan memverifikasi data yang Anda ajukan.</p>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-teal-800 border-4 border-teal-600 rounded-full flex items-center justify-center mb-4 shadow-lg text-white">
              <Megaphone size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">4. Selesai!</h3>
            <p className="text-sm text-teal-100">Akses seluruh informasi pengumuman dan fasilitas dashboard warga Anda.</p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER MODERN ================= */}
      <footer className="relative z-20 bg-black/20 backdrop-blur-lg border-t border-white/10 pt-16 pb-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo-pdwk.png" alt="Logo PDWK" className="w-8 h-8 object-contain drop-shadow-sm" />
                <span className="text-2xl font-bold tracking-wider text-white">PDWK</span>
              </div>
              <p className="text-teal-100/80 text-sm leading-relaxed max-w-sm">
                Sistem Pendataan Warga Komplek modern. Mewujudkan lingkungan yang tertib administrasi, aman, dan saling terhubung secara digital.
              </p>
              <div className="flex gap-3 pt-4">
                {/* Ikon sosial diganti dengan ikon generik Lucide yang aman (Globe, MessageCircle, Share2) */}
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-green-400 hover:text-teal-900 transition-colors shadow-sm">
                  <Globe size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-green-400 hover:text-teal-900 transition-colors shadow-sm">
                  <MessageCircle size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-green-400 hover:text-teal-900 transition-colors shadow-sm">
                  <Share2 size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-6 drop-shadow-sm">Tautan Cepat</h4>
              <ul className="space-y-3 text-sm text-teal-100/80">
                <li><a href="#beranda" className="hover:text-green-300 transition-colors inline-block">Beranda</a></li>
                <li><a href="#tentang" className="hover:text-green-300 transition-colors inline-block">Tentang Kami</a></li>
                <li><a href="#panduan" className="hover:text-green-300 transition-colors inline-block">Panduan Penggunaan</a></li>
                <li><Link to="/login" className="hover:text-green-300 font-semibold transition-colors inline-block mt-2">Masuk ke Sistem &rarr;</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-6 drop-shadow-sm">Hubungi Kami</h4>
              <ul className="space-y-4 text-sm text-teal-100/80">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-green-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">Sekretariat RW 12, Komplek Harmoni Alam, Kota Bandung, Jawa Barat</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-green-400 shrink-0" />
                  <span>+62 812 3456 7890</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-green-400 shrink-0" />
                  <span>admin@pdwk.com</span>
                </li>
              </ul>
            </div>
            
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-teal-200/50">
            <p>© 2026 Pendataan Warga Komplek. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= ORNAMEN DEKORATIF ================= */}
      <div className="fixed bottom-0 left-0 w-full overflow-hidden leading-none z-0 opacity-5 pointer-events-none">
        {/* Atribut relative="block" yang tidak valid juga sudah dihapus */}
        <svg style={{ display: 'block' }} width="calc(150% + 1.3px)" height="150px" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
        </svg>
      </div>

    </div>
  );
}