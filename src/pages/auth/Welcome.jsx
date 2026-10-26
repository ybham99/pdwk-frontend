import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Memicu animasi muncul (fade-in) saat halaman pertama kali dibuka
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Fungsi untuk menjalankan animasi menghilang (fade-out) sebelum pindah halaman
  const handleMasuk = () => {
    setIsExiting(true);
    // Tunggu 400ms (sesuai durasi animasi) sebelum pindah ke /login
    setTimeout(() => {
      navigate('/login');
    }, 400);
  };

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/60 backdrop-blur-sm transition-all duration-500 ease-in-out ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Bingkai Putih (Card Modal) */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-4 relative flex flex-col items-center transform transition-all duration-500 ease-out ${
          isLoaded && !isExiting ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'
        }`}
      >
        
        {/* Tombol Silang (X) di pojok kanan atas */}
        <button 
          onClick={handleMasuk} 
          className="absolute top-3 right-3 bg-white/80 backdrop-blur text-gray-500 hover:text-red-600 hover:bg-gray-100 p-2 rounded-full transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Gambar Banner Hijau dari folder public */}
        <div className="w-full overflow-hidden rounded-xl bg-gray-50">
          <img 
            src="/nunjuk.jpg" 
            alt="Selamat Datang" 
            className="w-full h-auto max-h-[75vh] object-contain"
          />
        </div>

        {/* Tombol "Ayok Login" */}
        <button
          onClick={handleMasuk}
          className="mt-5 mb-2 bg-[#0056A6] hover:bg-[#004080] text-white px-10 py-2.5 rounded-lg font-bold shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          Ayok Login
        </button>
        
      </div>
    </div>
  );
}