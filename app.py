from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import base64
from io import BytesIO
from PIL import Image, ImageOps
import re
import os
import matplotlib.pyplot as plt

app = Flask(__name__, static_folder='client/dist', static_url_path='/')
CORS(app)

# Ensure directories exist
os.makedirs('client/dist', exist_ok=True)

model_path = 'digit_model.h5'
if not os.path.exists(model_path):
    from model import train_and_save_model
    model = train_and_save_model(model_path)
else:
    model = tf.keras.models.load_model(model_path)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    image_data = data['image']
    
    # Ensure image data is properly formatted
    if not image_data or not isinstance(image_data, str):
        return jsonify({'error': 'Invalid image data'}), 400
    
    try:
        image_data = re.sub('^data:image/.+;base64,', '', image_data)
        image = Image.open(BytesIO(base64.b64decode(image_data)))
        
        # Convert to grayscale
        image = image.convert('L')
        
        # Apply threshold to make it binary
        image = image.point(lambda x: 0 if x < 200 else 255, '1')
        
        # Resize to 20x20 to leave margin around the digit
        image = image.resize((20, 20))
        
        # Create 28x28 white canvas and paste the 20x20 image in the center
        target = Image.new('L', (28, 28), "white")
        target.paste(image, (4, 4))
        
        # Invert colors (MNIST has white digits on black background)
        target = ImageOps.invert(target)
        
        # Convert to numpy array
        image_array = np.array(target)
        
        # Ensure debug directory exists
        debug_path = 'client/dist/debug_image.png'
        os.makedirs(os.path.dirname(debug_path), exist_ok=True)
        
        # Save debug image
        plt.imsave(debug_path, image_array, cmap='gray')
        
        # Normalize and reshape
        image_array = image_array.astype('float32') / 255.0
        image_array = image_array.reshape(1, 28, 28, 1)
        
        # Make prediction with error handling
        prediction = model.predict(image_array)
        
        probabilities = prediction[0].tolist()
        digit = int(np.argmax(prediction))
        confidence = float(prediction[0, digit])
        
        return jsonify({
            'digit': digit,
            'confidence': confidence,
            'probabilities': probabilities,
            'debug_image': '/debug_image.png'
        })
    
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
