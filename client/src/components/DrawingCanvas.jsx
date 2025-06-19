import React, { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Pencil, Eraser, Undo2, RefreshCw, Sparkles } from 'lucide-react';

const DrawingCanvas = ({ onPredict }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [tool, setTool] = useState('pencil');
  const [strokeHistory, setStrokeHistory] = useState([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = tool === 'pencil' ? 20 : 30;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'pencil' ? 'black' : 'white';
    
    // Fill with white on initial load only
    if (!context) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    setContext(ctx);
  }, [tool, context]);
  
  const startDrawing = (e) => {
    if (!context) return;
    
    // Prevent default behavior to avoid page scrolling on touch devices
    if (e.preventDefault) e.preventDefault();
    
    setIsDrawing(true);
    
    // Save the current canvas state before drawing
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');
    setStrokeHistory([...strokeHistory, imageData]);
    
    // Get initial position
    const rect = canvas.getBoundingClientRect();
    const x = e.type.includes('touch')
      ? e.touches[0].clientX - rect.left
      : e.clientX - rect.left;
    const y = e.type.includes('touch')
      ? e.touches[0].clientY - rect.top
      : e.clientY - rect.top;
    
    context.beginPath();
    context.moveTo(x, y);
  };
  
  const draw = (e) => {
    if (!isDrawing || !context) return;
    
    // Prevent default behavior
    if (e.preventDefault) e.preventDefault();
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const x = e.type.includes('touch')
      ? e.touches[0].clientX - rect.left
      : e.clientX - rect.left;
    const y = e.type.includes('touch')
      ? e.touches[0].clientY - rect.top
      : e.clientY - rect.top;
    
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  };
  
  const endDrawing = () => {
    if (!context) return;
    setIsDrawing(false);
    context.beginPath();
  };
  
  const clearCanvas = () => {
    if (!context) return;
    const canvas = canvasRef.current;
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    setStrokeHistory([]);
  };
  
  const undoStroke = () => {
    if (!context || strokeHistory.length === 0) return;
    
    const previousState = strokeHistory[strokeHistory.length - 1];
    const img = new Image();
    img.onload = () => {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.drawImage(img, 0, 0);
    };
    img.src = previousState;
    setStrokeHistory(strokeHistory.slice(0, -1));
  };
  
  const handlePredict = () => {
    if (!context) return;
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');
    onPredict(imageData);
  };
  
  return (
    <Card className="flex flex-col items-center p-4">
      <div className="mb-4 w-full flex justify-between">
        <div className="flex space-x-1">
          <Button 
            size="icon" 
            variant={tool === 'pencil' ? 'default' : 'outline'} 
            onClick={() => setTool('pencil')}
            title="Pencil"
          >
            <Pencil size={18} />
          </Button>
          <Button 
            size="icon" 
            variant={tool === 'eraser' ? 'default' : 'outline'} 
            onClick={() => setTool('eraser')}
            title="Eraser"
          >
            <Eraser size={18} />
          </Button>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={undoStroke}
            disabled={strokeHistory.length === 0}
            title="Undo"
          >
            <Undo2 size={18} />
          </Button>
        </div>
        <Button 
          size="icon" 
          variant="outline" 
          onClick={clearCanvas}
          title="Clear all"
        >
          <RefreshCw size={18} />
        </Button>
      </div>
      
      <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="touch-none cursor-crosshair canvas-background"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseOut={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={(e) => {
            // Prevent scrolling on touch devices
            e.preventDefault();
            draw(e);
          }}
          onTouchEnd={endDrawing}
          style={{ touchAction: 'none' }}
        />
      </div>
      <Button 
        onClick={handlePredict} 
        className="mt-4 w-full"
        size="lg"
      >
        <Sparkles className="mr-2" size={18} />
        Recognize Digit
      </Button>
    </Card>
  );
};

export default DrawingCanvas;
