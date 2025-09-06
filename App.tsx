
import React, { useState, useCallback, useEffect } from 'react';
import type { UploadedImage } from './types';
import { generateSimulation } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { EyeIcon } from './components/icons/EyeIcon';
import { EyeOffIcon } from './components/icons/EyeOffIcon';

const DEFAULT_PROMPT = `Given two facial images, use the first image (‘before’ photo) as the base and naturally and realistically apply the key facial features (eyes, nose, jawline, etc.) from the second image (‘reference’ photo) within the realistic boundaries of possible plastic surgery. The changes should be noticeable but maintain the original person's identity and unique characteristics. The resulting image should be high-quality and highly realistic. Output only the final modified image.`;

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [beforeImage, setBeforeImage] = useState<UploadedImage | null>(null);
  const [referenceImage, setReferenceImage] = useState<UploadedImage | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [theme, setTheme] = useState<Theme>('light');
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeyVisible, setIsApiKeyVisible] = useState<boolean>(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    const storedPrompt = localStorage.getItem('gemini_prompt');
    if (storedPrompt) {
        setPrompt(storedPrompt);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem('gemini_api_key', newKey);
  };
  
  const toggleApiKeyVisibility = () => {
    setIsApiKeyVisible(prev => !prev);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    localStorage.setItem('gemini_prompt', newPrompt);
  };

  const handleResetPrompt = () => {
    setPrompt(DEFAULT_PROMPT);
    localStorage.setItem('gemini_prompt', DEFAULT_PROMPT);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

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
    if (!apiKey) {
      setError('Please enter your Gemini API Key.');
      return;
    }
    if (!beforeImage || !referenceImage) {
      setError('Please upload both your photo and a reference photo.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const promptToSend = prompt.trim() === '' ? DEFAULT_PROMPT : prompt;
      const generatedImage = await generateSimulation(beforeImage.file, referenceImage.file, promptToSend, apiKey);
      setResultImage(generatedImage);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during simulation.';
      setError(errorMessage);
      alert(`Simulation Failed:\n${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [beforeImage, referenceImage, prompt, apiKey]);
  
  const handleReset = () => {
    setBeforeImage(null);
    setReferenceImage(null);
    setResultImage(null);
    setError(null);
    setIsLoading(false);
    setPrompt(DEFAULT_PROMPT);
    localStorage.setItem('gemini_prompt', DEFAULT_PROMPT);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">AI-Powered Plastic Surgery Simulation</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Curious about a new look? Upload your photo and a reference image to see a realistic preview.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-card text-card-foreground rounded-2xl shadow-lg p-6 md:p-10 border">
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
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="prompt" className="block text-sm font-medium text-card-foreground">
                    Describe the changes you want (optional):
                  </label>
                  <button
                    type="button"
                    onClick={handleResetPrompt}
                    className="text-xs font-semibold text-primary hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 py-0.5"
                  >
                    Reset to Default
                  </button>
                </div>
                <textarea
                  id="prompt"
                  rows={4}
                  maxLength={300}
                  className="w-full p-3 border border-input-border rounded-lg shadow-sm focus:ring-ring focus:border-primary transition-colors bg-background text-foreground placeholder:text-muted-foreground"
                  value={prompt}
                  onChange={handlePromptChange}
                  placeholder="e.g., Apply the eye shape from the reference photo, but keep my original nose."
                />
                <p className="text-right text-xs text-muted-foreground mt-1">
                  {prompt.length} / 300
                </p>
              </div>

              <div className="mb-8">
                <label htmlFor="api-key" className="block text-sm font-medium text-card-foreground mb-2">
                  Gemini API Key:
                </label>
                <div className="relative">
                  <input
                    id="api-key"
                    type={isApiKeyVisible ? 'text' : 'password'}
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    className="w-full p-3 pr-10 border border-input-border rounded-lg shadow-sm focus:ring-ring focus:border-primary transition-colors bg-background text-foreground placeholder:text-muted-foreground"
                    placeholder="Enter your Gemini API Key here"
                    aria-label="Gemini API Key"
                  />
                  <button
                    type="button"
                    onClick={toggleApiKeyVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                    aria-label={isApiKeyVisible ? 'Hide API Key' : 'Show API Key'}
                  >
                    {isApiKeyVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  입력하신 API 키는 서버로 전송되지 않으며, 사용자의 브라우저에만 안전하게 저장됩니다.
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={handleSimulate}
                  disabled={!beforeImage || !referenceImage || isLoading || !apiKey}
                  className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 disabled:bg-muted-foreground/50 text-primary-foreground font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  {isLoading ? 'Generating...' : 'Start Simulation'}
                </button>
              </div>
            </>
          )}

          {isLoading && <Loader />}

          {error && (
            <div className="text-center p-4 my-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
              <p><strong>Oops!</strong> {error}</p>
               <button
                onClick={handleReset}
                className="mt-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold py-2 px-4 rounded-full transition-colors duration-300"
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
      <footer className="text-center py-6 text-muted-foreground text-sm">
        <p>Powered by Gemini. Images are for illustrative purposes only.</p>
        <a 
          href="mailto:dev.sweetcode@gmail.com?subject=Inquiry about AI Plastic Surgery Simulation" 
          className="mt-2 inline-block text-primary hover:underline"
        >
          Contact Us
        </a>
      </footer>
    </div>
  );
};

export default App;
