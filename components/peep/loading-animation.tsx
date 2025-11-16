'use client';

import React, { useEffect, useState } from 'react';

export default function PeepLoadingAnimation() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @keyframes peepFadeInOut {
          0% {
            opacity: 1;
            pointer-events: auto;
          }
          85% {
            opacity: 1;
            pointer-events: auto;
          }
          100% {
            opacity: 0;
            pointer-events: none;
            visibility: hidden;
          }
        }

        @keyframes dotBlinkYellow {
          0%, 20% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .peep-footer-text {
          position: absolute;
          bottom: 60px;
          font-size: 0.8rem;
          font-weight: 600;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
            sans-serif;
          color: #FCD34D;
          letter-spacing: 0.05em;
        }

        .peep-loading-overlay {
          animation: peepFadeInOut 5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #000000;
        }

        .peep-text-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
        }

        .peep-main-text {
          display: flex;
          align-items: baseline;
          justify-content: center;
          line-height: 1;
        }

        .peep-tagline {
          font-size: 0.85rem;
          font-weight: 500;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
            sans-serif;
          color: #FCD34D;
          letter-spacing: 0.03em;
          margin-top: 0;
          line-height: 1.1;
        }

        .peep-loading-text {
          font-size: 4rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
            sans-serif;
          color: #FFFFFF;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .peep-loading-dot {
          display: inline-block;
          animation: dotBlinkYellow 1.2s ease-in-out infinite;
          color: #FBBF24;
        }

        .peep-glow-bottom {
          position: absolute;
          bottom: -50px;
          left: 0;
          right: 0;
          height: 400px;
          background: linear-gradient(
            to top,
            rgba(167, 139, 250, 1) 0%,
            rgba(139, 92, 246, 0.8) 10%,
            rgba(109, 40, 217, 0.5) 25%,
            transparent 60%
          );
          filter: blur(80px);
          pointer-events: none;
          z-index: 5;
        }
      `}</style>

      {isVisible && (
        <div className="peep-loading-overlay">
          <div className="peep-glow-bottom" />
          <div className="peep-text-wrapper">
            <div className="peep-main-text peep-loading-text">
              peep<span className="peep-loading-dot">.</span>
            </div>
            <div className="peep-tagline">a community driven approach</div>
          </div>
          <div className="peep-footer-text">GRD PUBLIC SCHOOL</div>
        </div>
      )}
    </>
  );
}
