"use client";

import { useEffect, useState } from "react";

export default function AppLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2400);
    const hideTimer = setTimeout(() => setVisible(false), 2800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes loader-pulse {
          0%, 100% { transform: scale(0.92); }
          50%      { transform: scale(1); }
        }
        .loader-pulse {
          animation: loader-pulse 1.4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          transform-origin: center;
        }

        @keyframes loader-wedge-left-pulse {
          0%, 100% { fill: #00BE62; }
          50%      { fill: #008a45; }
        }
        @keyframes loader-wedge-right-pulse {
          0%, 100% { fill: #008a45; }
          50%      { fill: #00BE62; }
        }
        .loader-wedge-left  { animation: loader-wedge-left-pulse  1.4s cubic-bezier(0.25, 1, 0.5, 1) infinite; }
        .loader-wedge-right { animation: loader-wedge-right-pulse 1.4s cubic-bezier(0.25, 1, 0.5, 1) infinite; }

        .app-loader-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          background: rgba(255, 255, 255, 0.03);
          transition: opacity 300ms ease;
          opacity: 1;
        }
        .app-loader-overlay.is-fading { opacity: 0; }

        /* Dark mode — invert the black SVG mark to white */
        [data-theme='dark'] .app-loader-svg-path,
        .dark .app-loader-svg-path { fill: #E8E8E8 !important; }
        [data-theme='dark'] .app-loader-svg-stroke,
        .dark .app-loader-svg-stroke { stroke: #E8E8E8 !important; }
      `}</style>

      <div
        className={`app-loader-overlay ${fading ? "is-fading" : ""}`}
        aria-hidden="true"
      >
        <svg
          width="195"
          height="208"
          viewBox="0 0 195 208"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="loader-pulse"
          style={{ width: 156, height: 166 }}
          aria-hidden="true"
        >
          <g clipPath="url(#wedge-left)">
            <rect x="9.07129" y="66.5205" width="177" height="62" rx="31" className="loader-wedge-left" />
          </g>
          <g clipPath="url(#wedge-right)">
            <rect x="9.07129" y="66.5205" width="177" height="62" rx="31" className="loader-wedge-right" />
          </g>

          <g filter="url(#filter0_d_844_10)">
            <path className="app-loader-svg-path" d="M125.69 0.0554187C131.123 -0.174361 135.198 0.261914 140.373 2.28382C148.336 5.43965 154.699 11.6604 158.033 19.5501C161.254 26.993 161.409 36.0053 158.434 43.5716C155.9 50.0179 151.626 55.5424 145.654 59.165C144.334 59.9661 142.66 60.668 141.226 61.2878C144.538 61.6455 149.678 61.4674 153.113 61.4154C173.298 61.1093 190.366 77.7714 190.222 97.9991C190.222 107.958 186.184 117.493 179.031 124.424C176.323 127.075 169.801 130.929 169.801 130.929L164.571 134.555L106.352 175.683L89.7525 187.715C80.7518 194.243 75.6104 198.568 63.6026 198.52C61.172 198.444 59.0299 198.091 56.6733 197.531C48.4159 195.524 42.1938 191.019 36.8888 183.048C26.3011 167.139 46.5741 135.502 46.5741 135.502C46.5741 135.502 38.2674 134.862 34.885 134.312C18.0127 131.568 5.1199 117.456 4.0713 100.34C3.13428 85.047 11.4932 70.0941 25.5714 64.0205L87.7302 21.8373L102.365 11.2467C110.264 5.50353 115.384 0.963276 125.69 0.0554187ZM56.4694 128.354C62.0852 128.112 67.3667 128.218 72.9838 128.218L97.4813 128.197L134.582 128.202L147.046 128.227C151.567 128.232 156.101 128.41 160.537 127.374C165.892 126.103 170.783 123.356 174.652 119.443C180.423 113.711 183.618 106.364 183.617 98.1951C183.604 90.136 180.417 82.4062 174.745 76.6799C169.658 71.613 162.914 68.5487 155.75 68.0489C151.572 67.7901 147.058 68.1268 142.761 67.8871C141.648 68.261 138.576 70.6456 137.389 71.4813L126.48 79.1864L79.6892 112.138L64.3166 123.003C62.0747 124.57 58.7211 127.007 56.4694 128.354ZM19.8092 119.82C25.4545 125.424 34.0637 128.521 41.9365 128.227C43.0673 128.185 44.2403 128.247 45.3806 128.227C48.5837 126.145 52.0729 123.544 55.2329 121.32L74.9979 107.382L129.867 68.7421C130.204 68.5023 130.576 68.2582 130.765 67.8977L130.637 67.76L130.062 67.7774C122.271 68.324 112.514 67.9895 104.489 67.983L59.754 67.9903L46.8218 68.0081C42.1832 68.0168 37.8843 67.7078 33.3446 68.8791C27.2882 70.4416 21.9293 73.8201 17.8471 78.5091C12.6937 84.5387 10.1172 92.3529 10.6735 100.265C11.2025 107.507 14.6618 114.713 19.8092 119.82Z" fill="black" />
            <path className="app-loader-svg-path" d="M151.919 74.582C164.324 73.6608 175.107 83.2051 175.991 95.8884C176.872 108.572 167.52 119.58 155.111 120.464C142.729 121.346 131.988 111.81 131.106 99.1529C130.225 86.4961 139.538 75.5011 151.919 74.582Z" fill="black" />
            <path className="app-loader-svg-path" d="M40.1127 74.5682C52.4958 73.759 63.182 83.3505 63.9985 96.007C64.8151 108.663 55.4535 119.606 43.0737 120.467C30.6588 121.329 19.9165 111.726 19.0977 99.0337C18.2789 86.3412 27.6945 75.3797 40.1127 74.5682Z" fill="black" />
            <circle className="app-loader-svg-path" cx="64.0713" cy="164.521" r="34" fill="black" />
            <path className="app-loader-svg-stroke" d="M50.5713 126.021C50.5713 126.021 48.3681 126.972 47.0713 127.521C44.9058 128.437 40.0713 128.521 40.0713 128.521" stroke="black" fill="none" />
            <path className="app-loader-svg-stroke" d="M15.5716 74.0204C15.5716 74.0204 14.0714 74.5204 18.5716 69.5204C23.0718 64.5204 68.5714 37.1443 68.5714 37.1443" stroke="black" strokeWidth="2.8" fill="none" />
          </g>

          <defs>
            <clipPath id="wedge-left">
              <polygon points="9,66 12,155 195,45" />
            </clipPath>
            <clipPath id="wedge-right">
              <polygon points="186,128 195,40 9,145" />
            </clipPath>
            <filter id="filter0_d_844_10" x="0" y="0" width="194.223" height="207.521" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="5" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_844_10" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_844_10" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </>
  );
}
