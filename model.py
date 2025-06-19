import numpy as np
import tensorflow as tf
from tensorflow.keras.datasets import mnist
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPooling2D
from tensorflow.keras.utils import to_categorical
import matplotlib.pyplot as plt
import os

def load_and_preprocess_data():
    try:
        (x_train, y_train), (x_test, y_test) = mnist.load_data()
        
        x_train = x_train.reshape(x_train.shape[0], 28, 28, 1).astype('float32')
        x_test = x_test.reshape(x_test.shape[0], 28, 28, 1).astype('float32')
        
        x_train = x_train / 255.0
        x_test = x_test / 255.0
        
        y_train = to_categorical(y_train)
        y_test = to_categorical(y_test)
        
        return (x_train, y_train), (x_test, y_test)
    except Exception as e:
        print(f"Error loading MNIST dataset: {e}")
        raise

def create_model():
    model = Sequential()
    
    model.add(Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)))
    model.add(MaxPooling2D((2, 2)))
    model.add(Conv2D(64, (3, 3), activation='relu'))
    model.add(MaxPooling2D((2, 2)))
    model.add(Conv2D(64, (3, 3), activation='relu'))
    
    model.add(Flatten())
    model.add(Dense(64, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(10, activation='softmax'))
    
    model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
    
    return model

def train_and_save_model(model_path='digit_model.h5'):
    try:
        (x_train, y_train), (x_test, y_test) = load_and_preprocess_data()
        
        model = create_model()
        
        # Set up early stopping to prevent overfitting
        early_stopping = tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=3,
            restore_best_weights=True
        )
        
        history = model.fit(
            x_train, y_train,
            validation_data=(x_test, y_test), 
            epochs=10,
            batch_size=128,
            verbose=1,
            callbacks=[early_stopping]
        )
        
        scores = model.evaluate(x_test, y_test, verbose=0)
        print(f"Accuracy: {scores[1]*100:.2f}%")
        
        # Ensure directory exists before saving
        model_dir = os.path.dirname(model_path)
        if model_dir and not os.path.exists(model_dir):
            os.makedirs(model_dir)
        
        model.save(model_path)
        print(f"Model saved to {model_path}")
        
        # Save training history plot
        plot_dir = os.path.dirname('training_history.png')
        if plot_dir and not os.path.exists(plot_dir):
            os.makedirs(plot_dir)
            
        plt.figure(figsize=(12, 4))
        plt.subplot(1, 2, 1)
        plt.plot(history.history['accuracy'], label='train')
        plt.plot(history.history['val_accuracy'], label='test')
        plt.title('Model Accuracy')
        plt.xlabel('Epoch')
        plt.ylabel('Accuracy')
        plt.legend()
        
        plt.subplot(1, 2, 2)
        plt.plot(history.history['loss'], label='train')
        plt.plot(history.history['val_loss'], label='test')
        plt.title('Model Loss')
        plt.xlabel('Epoch')
        plt.ylabel('Loss')
        plt.legend()
        
        plt.savefig('training_history.png')
        plt.close()
        
        return model
    except Exception as e:
        print(f"Error training model: {e}")
        raise

if __name__ == "__main__":
    try:
        if not os.path.exists('digit_model.h5'):
            train_and_save_model('digit_model.h5')
        else:
            print("Model already exists. Delete 'digit_model.h5' to train a new model.")
    except Exception as e:
        print(f"Error in model training script: {e}")
