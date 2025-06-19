# Handwritten Digit Recognition with React and Flask

A modern application for recognizing handwritten digits using a neural network model with a sleek UI built with React and Shadcn UI components.

## Features

- Neural network model trained on the MNIST dataset
- Modern UI with React and Shadcn UI components
- Real-time drawing and prediction
- Probability distribution visualization for all digits
- Responsive design for all devices

## Setup and Installation

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install the required Python packages:
```bash
pip install -r requirements.txt
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Build the frontend:
```bash
npm run build
```

### Running the Application

1. Start the Flask server:
```bash
python app.py
```

2. Open your browser and go to:
```
http://localhost:5000
```

## Development

For development, you can run the React development server:

```bash
cd client
npm run dev
```

This will start the development server on port 3000 and proxy API requests to the Flask backend.
The model typically achieves 98%+ accuracy on the MNIST test dataset.
