document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const clearButton = document.getElementById('clearButton');
    const predictButton = document.getElementById('predictButton');
    const resultDiv = document.getElementById('result');
    const confidenceDiv = document.getElementById('confidence');
    
    // Canvas drawing settings
    ctx.lineWidth = 20; // Increased for better digit recognition
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'black';
    
    // Drawing state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // Clear canvas
    function clearCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        resultDiv.textContent = 'Draw a digit and click "Predict"';
        confidenceDiv.textContent = '';
        
        // Hide debug image if it exists
        const debugImg = document.getElementById('debugImage');
        if (debugImg) debugImg.style.display = 'none';
    }
    
    // Setup drawing events
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        
        const [x, y] = getCoordinates(e);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        [lastX, lastY] = [x, y];
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    // Get coordinates for both mouse and touch events
    function getCoordinates(e) {
        if (e.type.includes('mouse')) {
            return [
                e.offsetX,
                e.offsetY
            ];
        } else {
            const rect = canvas.getBoundingClientRect();
            return [
                e.touches[0].clientX - rect.left,
                e.touches[0].clientY - rect.top
            ];
        }
    }
    
    // Make a prediction
    function predict() {
        const imageData = canvas.toDataURL('image/png');
        
        resultDiv.textContent = 'Predicting...';
        confidenceDiv.textContent = '';
        
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        })
        .then(response => response.json())
        .then(data => {
            resultDiv.textContent = `Predicted Digit: ${data.digit}`;
            confidenceDiv.textContent = `Confidence: ${(data.confidence * 100).toFixed(2)}%`;
            
            // Show debug image
            let debugImg = document.getElementById('debugImage');
            if (!debugImg) {
                debugImg = document.createElement('img');
                debugImg.id = 'debugImage';
                debugImg.style.display = 'block';
                debugImg.style.margin = '10px auto';
                debugImg.width = 140; // Show larger for visibility
                debugImg.height = 140;
                document.querySelector('.result-container').appendChild(debugImg);
            }
            
            // Add timestamp to prevent caching
            debugImg.src = `${data.debug_image}?${new Date().getTime()}`;
            debugImg.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.textContent = 'Error making prediction';
            confidenceDiv.textContent = '';
        });
    }
    
    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Button events
    clearButton.addEventListener('click', clearCanvas);
    predictButton.addEventListener('click', predict);
    
    // Initial clear - use white background
    clearCanvas();
});
