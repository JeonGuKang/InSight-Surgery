
import React, { useState, useCallback } from 'react';
import type { UploadedImage } from './types';
import { generateSimulation } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';

const DEFAULT_PROMPT = `Your task is to act as a plastic surgery simulator. Take the first image (the 'before' photo) and apply the distinct facial features from the second image (the 'reference' photo). Specifically, blend the shape and style of the reference's eyes, nose, and jawline onto the 'before' photo. The result should be a realistic and high-quality image that maintains the original person's core identity but clearly shows the simulated changes. Output *only* the final modified image.`;

const App: React.FC = () => {
  const [beforeImage, setBeforeImage] = useState<UploadedImage | null>(null);
  const [referenceImage, setReferenceImage] = useState<UploadedImage | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);

  const handleImageChange = (
    setter: React.Dispatch<React.SetStateAction<UploadedImage | null>>
  ) => (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setter({
        file: file,
        previewUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
    setResultImage(null);
    setError(null);
  };

  const handleSimulate = useCallback(async () => {
    if (!beforeImage || !referenceImage) {
      setError('Please upload both your photo and a reference photo.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const promptToSend = prompt.trim() === '' ? DEFAULT_PROMPT : prompt;
      const generatedImage = await generateSimulation(beforeImage.file, referenceImage.file, promptToSend);
      setResultImage(generatedImage);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during simulation.';
      setError(errorMessage);
      alert(`Simulation Failed:\n${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [beforeImage, referenceImage, prompt]);
  
  const handleReset = () => {
    setBeforeImage(null);
    setReferenceImage(null);
    setResultImage(null);
    setError(null);
    setIsLoading(false);
    setPrompt(DEFAULT_PROMPT);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">AI-Powered Plastic Surgery Simulation</h1>
          <p className="text-lg text-gray-600 mb-8">
            Curious about a new look? Upload your photo and a reference image to see a realistic preview.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-200">
          {!resultImage && !isLoading && (
            <>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <ImageUploader
                  id="before-image"
                  label="Your Photo (Before)"
                  onImageChange={handleImageChange(setBeforeImage)}
                  imagePreviewUrl={beforeImage?.previewUrl}
                />
                <ImageUploader
                  id="reference-image"
                  label="Reference Photo (Inspiration)"
                  onImageChange={handleImageChange(setReferenceImage)}
                  imagePreviewUrl={referenceImage?.previewUrl}
                />
              </div>

              <div className="mb-8">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe the changes you want (optional):
                </label>
                <textarea
                  id="prompt"
                  rows={4}
                  maxLength={300}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-blue focus:border-brand-blue transition-colors placeholder-gray-500"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Apply the eye shape from the reference photo, but keep my original nose."
                />
                <p className="text-right text-xs text-gray-500 mt-1">
                  {prompt.length} / 300
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={handleSimulate}
                  disabled={!beforeImage || !referenceImage || isLoading}
                  className="inline-flex items-center justify-center bg-brand-blue hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  {isLoading ? 'Generating...' : 'Start Simulation'}
                </button>
              </div>
            </>
          )}

          {isLoading && <Loader />}

          {error && (
            <div className="text-center p-4 my-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">
              <p><strong>Oops!</strong> {error}</p>
               <button
                onClick={handleReset}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          )}

          {resultImage && beforeImage && (
            <ResultDisplay
              beforeImage={beforeImage.previewUrl}
              afterImage={resultImage}
              referenceImage={referenceImage?.previewUrl}
              onReset={handleReset}
            />
          )}
        </div>
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by Gemini. Images are for illustrative purposes only.</p>
        <a 
          href="mailto:developer-inquiry@example.com?subject=Inquiry about AI Plastic Surgery Simulation" 
          className="mt-2 inline-block text-brand-blue hover:underline"
        >
          Contact Us
        </a>
      </footer>
    </div>
  );
};

export default App;
