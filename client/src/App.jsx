import React, { useState } from 'react';
import DrawingCanvas from './components/DrawingCanvas';
import ResultDisplay from './components/ResultDisplay';
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastViewport } from './components/ui/toast';
import { ThemeProvider } from './components/ui/theme-provider';
import { ModeToggle } from './components/ui/mode-toggle';
import { Github } from 'lucide-react';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', description: '' });

  const handlePredict = async (imageData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error('Error predicting digit:', error);
      setToastMessage({
        title: 'Error',
        description: 'Failed to predict digit. Please try again.'
      });
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background text-foreground py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Digit Recognition</h1>
              <p className="text-muted-foreground mt-2">
                Draw a digit and let AI predict what you've drawn
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center px-3 py-1 rounded-full bg-card border border-border">
                <ModeToggle />
              </div>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="inline-block p-2 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[500px]">
            <DrawingCanvas onPredict={handlePredict} />
            <ResultDisplay prediction={prediction} isLoading={isLoading} />
          </div>
          
          <div className="mt-12 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="p-4 border border-border rounded-lg bg-card">
              <h3 className="font-medium mb-2">How it works</h3>
              <p>Our AI uses a CNN model trained on the MNIST dataset to recognize handwritten digits from 0-9.</p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <h3 className="font-medium mb-2">Best Practices</h3>
              <p>Draw each digit clearly in the center of the canvas. Use the eraser tool to refine your drawing.</p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <h3 className="font-medium mb-2">About</h3>
              <p>Created with TensorFlow, Flask and React. Model achieves 98%+ accuracy on test datasets.</p>
            </div>
          </div>
        </div>
      </div>
      
      <ToastProvider>
        {showToast && (
          <Toast variant="destructive" onOpenChange={setShowToast}>
            <ToastTitle>{toastMessage.title}</ToastTitle>
            <ToastDescription>{toastMessage.description}</ToastDescription>
          </Toast>
        )}
        <ToastViewport />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
