import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] text-white overflow-hidden -mb-20">
      <div className="text-center p-8 rounded-lg shadow-lg relative z-10" style={{
        background: 'linear-gradient(145deg, rgba(13,13,13,0.9) 0%, rgba(20,20,20,0.9) 100%)',
        border: '1px solid rgba(40,40,40,0.7)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-full animate-pulse" style={{
            background: 'rgba(0, 220, 173, 0.1)',
            boxShadow: '0 0 15px rgba(0, 220, 173, 0.5)'
          }}>
            <svg
              className="w-16 h-16 text-[#00DCAD]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
        </div>
        <h1 className="mb-4 text-6xl font-extrabold text-[#00DCAD] animate-fade-in-down">404</h1>
        <p className="mb-6 text-2xl text-gray-300 animate-fade-in-up">Səhifə tapılmadı!</p>
        <p className="mb-8 text-lg text-gray-400 animate-fade-in-up delay-100">
          Axtardığınız səhifə mövcud deyil. Ola bilsin ki, səhv ünvan daxil etdiniz və ya səhifə köçürülüb.
        </p>
        <a
          href="/"
          className="inline-block px-8 py-3 rounded-full font-semibold text-lg transition duration-300 hover:scale-105 transform"
          style={{
            background: 'linear-gradient(90deg, #00DCAD 0%, #30E39F 100%)',
            color: '#ffffff',
            boxShadow: '0 4px 15px rgba(0, 220, 173, 0.4)'
          }}
        >
          Ana Səhifəyə Qayıt
        </a>
      </div>
      
      {/* Background circles for animation */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00DCAD] rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-move-up-down"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#00DCAD] rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-move-down-up delay-200"></div>

      {/* Adding keyframes for animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }

          @keyframes fadeInDown {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes moveUpDown {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-20px) scale(1.05);
            }
          }

          @keyframes moveDownUp {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(20px) scale(1.05);
            }
          }

          .animate-pulse {
            animation: pulse 2s infinite;
          }

          .animate-fade-in-down {
            animation: fadeInDown 0.8s ease-out;
          }

          .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out;
          }

          .animate-move-up-down {
            animation: moveUpDown 6s infinite ease-in-out;
          }

          .animate-move-down-up {
            animation: moveDownUp 6s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default NotFound;