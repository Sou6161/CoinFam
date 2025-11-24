import React from "react";

const CryptoLoader = () => {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black">
      <div className="loader-matrix"></div>

      <style jsx>{`
        .loader-matrix {
          width: 45px;
          height: 40px;
          background: 
            linear-gradient(transparent calc(1*100%/6), #00ff88 0 calc(3*100%/6), transparent 0),
            linear-gradient(transparent calc(2*100%/6), #00ff88 0 calc(4*100%/6), transparent 0),
            linear-gradient(transparent calc(3*100%/6), #00ff88 0 calc(5*100%/6), transparent 0);
          background-size: 10px 400%;
          background-repeat: no-repeat;
          animation: matrix 1s infinite linear;
        }

        @keyframes matrix {
          0% {
            background-position: 0% 100%, 50% 100%, 100% 100%;
          }
          100% {
            background-position: 0% 0%, 50% 0%, 100% 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default CryptoLoader;
