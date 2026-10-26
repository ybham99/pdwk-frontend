import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, X, Home, Check, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [identitas, setIdentitas] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [showPopup, setShowPopup] = useState(true);
  const [isExitingPopup, setIsExitingPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleClosePopup = () => {
    setIsExitingPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 500); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Memeriksa kredensial...');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identitas, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.dismiss(toastId);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setShowSuccess(true);
        setTimeout(() => {
          if (data.user.role !== 'warga') {
            navigate('/pengurus/dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 2000);
      } else {
        toast.error(data.message, { id: toastId });
        setIsLoading(false);
      }
    } catch (error) {
      toast.error('Gagal terhubung ke server', { id: toastId });
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <style>{`
          @keyframes scaleBounce {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes slideUpFade {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .anim-bounce { animation: scaleBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          .anim-text-1 { animation: slideUpFade 0.6s ease forwards; animation-delay: 0.3s; opacity: 0; }
          .anim-text-2 { animation: slideUpFade 0.6s ease forwards; animation-delay: 0.5s; opacity: 0; }
        `}</style>
        <div className="flex flex-col items-center text-center px-4">
          <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/40 anim-bounce text-white mb-6">
            <Check size={64} strokeWidth={3} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 anim-text-1">Login Berhasil!</h2>
          <p className="text-gray-500 mt-4 font-medium text-xl anim-text-2">Mengarahkan ke Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-stagger-1 { animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
        .anim-stagger-2 { animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .anim-stagger-3 { animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        .anim-stagger-4 { animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
        .anim-stagger-5 { animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards; opacity: 0; }

        @keyframes spinBorder {
          100% { transform: rotate(360deg); }
        }
        .glow-card-wrapper {
          position: relative;
          border-radius: 1.5rem;
          padding: 3px; /* Garis tepi sedikit lebih tebal untuk mengimbangi ukuran kartu */
          overflow: hidden;
          box-shadow: 0 10px 40px -10px rgba(37,99,235,0.15);
        }
        .glow-card-wrapper::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: conic-gradient(transparent, transparent, transparent, #2563eb, #60a5fa);
          animation: spinBorder 4s linear infinite;
          z-index: 1;
        }
        .glow-card-inner {
          position: relative;
          background: white;
          border-radius: calc(1.5rem - 3px);
          z-index: 2;
        }
      `}</style>

      {/* POP-UP MODAL AWAL */}
      {showPopup && (
        <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50 transition-opacity duration-500 ease-in-out ${isExitingPopup ? 'opacity-0' : 'opacity-100'}`}>
          <div className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-4 sm:p-6 relative flex flex-col items-center transform transition-all duration-500 ease-out ${isExitingPopup ? 'scale-95 translate-y-10' : 'scale-100 translate-y-0'}`}>
            <button onClick={handleClosePopup} className="absolute top-4 right-4 bg-white/80 shadow backdrop-blur text-gray-500 hover:text-red-600 hover:bg-gray-100 p-2 rounded-full transition-colors z-10">
              <X size={24} />
            </button>
            <div className="w-full overflow-hidden rounded-xl bg-gray-50 flex justify-center">
              <img src="/1.jpg" alt="Warga Komplek PDWK" className="w-full h-auto max-h-[70vh] object-contain rounded-lg" />
            </div>
            <button onClick={handleClosePopup} className="mt-6 mb-2 bg-[#0056A6] hover:bg-[#004080] text-white px-12 py-4 rounded-xl text-lg font-bold shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center">
              Ayok Login
            </button>
          </div>
        </div>
      )}

      {/* HALAMAN LOGIN UTAMA */}
      <div className={`min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans relative transition-all duration-500 ${showPopup ? 'blur-md grayscale-[20%] pointer-events-none overflow-hidden' : ''}`}>
        
        <Link to="/" className="absolute top-4 left-4 lg:top-8 lg:left-8 z-50 bg-black/20 hover:bg-black/40 backdrop-blur-md p-3 rounded-full text-white border border-white/20 transition-all hover:scale-110 shadow-lg group flex items-center justify-center" title="Kembali ke Beranda">
          <Home size={24} className="group-hover:-translate-x-1 transition-transform" />
        </Link>

        {/* SISI KIRI (VIDEO) */}
        <div className="w-full h-[40vh] lg:h-screen lg:w-1/2 relative flex items-center justify-center shrink-0">
          <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
            <source src="/bg-bandung.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-800/70 to-transparent"></div>
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 text-center text-white px-6 lg:px-12 flex flex-col items-center">
            <img src="/logo-pdwk.png" alt="Logo PDWK" className="mb-2 lg:mb-6 w-20 h-20 lg:w-32 lg:h-32 object-contain drop-shadow-md" />
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-widest mb-1 lg:mb-2 shadow-black/50 drop-shadow-lg">
              <span className="opacity-80">[</span> PDWK <span className="opacity-80">]</span>
            </h1>
            <h2 className="text-sm lg:text-2xl font-medium tracking-wide mb-2 lg:mb-6 text-blue-100">
              SISTEM PENDATAAN WARGA
            </h2>
            <p className="hidden lg:block text-base text-blue-200 max-w-lg mx-auto leading-relaxed backdrop-blur-sm bg-black/20 p-5 rounded-xl border border-white/10">
              Layanan administrasi kependudukan terpadu. Mudah, cepat, dan transparan untuk lingkungan yang lebih baik.
            </p>
          </div>
        </div>

        {/* SISI KANAN (KARTU SANGAT BESAR) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-gray-50/50 z-20 overflow-y-auto">
          
          {/* Kartu Diperbesar Menjadi max-w-lg (Lebar Maksimal ~512px) */}
          <div className="w-full max-w-lg mx-auto glow-card-wrapper my-8 lg:my-0">
            {/* Padding dinaikkan menjadi p-10/p-12 */}
            <div className="glow-card-inner p-8 sm:p-12 flex flex-col items-center">
              
              {/* Logo Diperbesar */}
              <div className="anim-stagger-1 w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-blue-100">
                <img src="/logo-pdwk.png" alt="Logo PDWK" className="w-14 h-14 object-contain drop-shadow-sm" />
              </div>
              
              {/* Teks Diperbesar */}
              <div className="anim-stagger-2 text-center w-full mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Selamat Datang</h2>
                <p className="text-gray-500 text-lg">Silakan masuk untuk melanjutkan</p>
              </div>

              <form onSubmit={handleLogin} className="w-full space-y-5 anim-stagger-3">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <User size={22} />
                  </div>
                  {/* Teks Input text-lg */}
                  <input
                    type="text" required placeholder="No. HP atau Email"
                    value={identitas} onChange={(e) => setIdentitas(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 shadow-sm text-lg font-medium"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={22} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"} required placeholder="Kata Sandi"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 shadow-sm text-lg font-medium"
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>

                <div className="flex justify-between items-center text-base px-2 pt-2 pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-gray-800 transition-colors">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    <span className="font-medium">Ingat saya</span>
                  </label>
                  <button type="button" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                    Lupa sandi?
                  </button>
                </div>

                <button
                  type="submit" disabled={isLoading}
                  className="anim-stagger-4 w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/30 active:scale-95 flex justify-center items-center gap-2 text-lg"
                >
                  {isLoading ? 'Memproses...' : (
                    <>Masuk <ArrowRight size={20} /></>
                  )}
                </button>
              </form>

              <div className="anim-stagger-5 w-full">
                <div className="flex items-center my-8">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-base">atau</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <Link 
                  to="/register" 
                  className="w-full flex justify-center items-center gap-3 bg-white border border-gray-200 text-gray-700 hover:text-blue-600 hover:bg-gray-50 hover:border-blue-300 py-4 rounded-xl font-bold transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 group text-lg"
                >
                  <UserPlus size={22} className="text-blue-600 group-hover:scale-110 transition-transform" />
                  Daftar Akun Baru
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}