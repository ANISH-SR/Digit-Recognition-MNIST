import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Progress } from './ui/progress';
import { Loader2, Sparkles } from 'lucide-react';

const ResultDisplay = ({ prediction, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="h-full flex flex-col justify-center items-center p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <CardTitle className="text-lg">Analyzing your drawing</CardTitle>
        <CardDescription>Our AI is processing your digit...</CardDescription>
      </Card>
    );
  }

  if (!prediction) {
    return (
      <Card className="h-full flex flex-col justify-center items-center p-8">
        <div className="rounded-full bg-secondary p-4 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-lg text-center">Draw a digit and click "Recognize Digit"</CardTitle>
        <CardDescription className="text-center mt-2">Our AI model will predict what digit you've drawn</CardDescription>
      </Card>
    );
  }

  const maxProb = Math.max(...prediction.probabilities);
  const maxIndex = prediction.probabilities.indexOf(maxProb);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="mr-2">Prediction Result</span>
          {prediction.confidence > 0.9 && (
            <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
              High Confidence
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Detected digit with {(prediction.confidence * 100).toFixed(1)}% confidence
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <div className="flex justify-center items-center flex-grow">
            <div className="text-8xl font-bold relative">
              {prediction.digit}
              <div className="absolute -top-2 -right-3 transform rotate-12">
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </div>
          
          {prediction.debug_image && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2 text-center">Processed Image</h3>
              <div className="flex justify-center">
                <img 
                  src={`${prediction.debug_image}?${new Date().getTime()}`} 
                  alt="Processed digit" 
                  className="border border-border rounded-md w-24 h-24 object-contain pixelated dark:invert dark:brightness-90"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-sm font-medium mb-2">Probability Distribution</h3>
          <div className="space-y-3 flex-grow">
            {prediction.probabilities.map((prob, index) => (
              <div key={index} className={index === maxIndex ? "mb-2" : "mb-2 opacity-80"}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Digit {index}</span>
                  <span className={`text-sm font-medium ${index === maxIndex ? "text-primary" : ""}`}>
                    {(prob * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={prob * 100} 
                  className={`h-2 ${index === maxIndex ? "bg-secondary/80" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
