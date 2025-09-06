
import React, { useState, useRef, useEffect } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultDisplayProps {
  beforeImage: string;
  afterImage: string;
  referenceImage?: string | null;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ beforeImage, afterImage, referenceImage, onReset }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };
  
  const handleDownload = () => {
      const link = document.createElement('a');
      link.href = afterImage;
      link.download = 'ai-simulation-result.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 w-full">
            <div className="flex flex-col items-center">
                <p className="font-semibold mb-2 text-gray-700">Before</p>
                <img src={beforeImage} alt="Before" className="w-full aspect-square object-cover rounded-lg shadow-md" />
            </div>
             <div className="flex flex-col items-center">
                <p className="font-semibold mb-2 text-gray-700">Reference</p>
                <img src={referenceImage || ''} alt="Reference" className="w-full aspect-square object-cover rounded-lg shadow-md" />
            </div>
             <div className="flex flex-col items-center">
                <p className="font-semibold mb-2 text-gray-700">AI Simulation</p>
                <img src={afterImage} alt="After" className="w-full aspect-square object-cover rounded-lg shadow-md" />
            </div>
        </div>
        
        <div className="w-full mb-6">
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Interactive Comparison</h3>
            <div ref={imageContainerRef} className="relative w-full aspect-square mx-auto select-none rounded-lg overflow-hidden shadow-xl">
              <img
                src={beforeImage}
                alt="Before"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img
                  src={afterImage}
                  alt="After"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute inset-y-0 bg-white w-1 cursor-ew-resize"
                style={{ left: `calc(${sliderPosition}% - 2px)` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-lg border-2 border-brand-blue">
                    <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={handleSliderChange}
                className="absolute inset-0 w-full h-full cursor-ew-resize opacity-0"
                aria-label="Image comparison slider"
              />
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
                onClick={handleDownload}
                className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download Result
            </button>
             <button
                onClick={onReset}
                className="inline-flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
                Start Over
            </button>
        </div>
    </div>
  );
};

export default ResultDisplay;
