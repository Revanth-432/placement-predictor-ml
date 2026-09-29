from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the model
# Check if model.pkl exists, otherwise try model (1).pkl
model_path = 'model.pkl'
if not os.path.exists(model_path) and os.path.exists('model (1).pkl'):
    model_path = 'model (1).pkl'

try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
except Exception as e:
    model = None
    print(f"Error loading model: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model could not be loaded.'}), 500
        
    try:
        data = request.get_json()
        cgpa = float(data.get('cgpa', 0))
        iq = float(data.get('iq', 0))
        
        # Format for model prediction: [[cgpa, iq]] based on dataset columns
        features = np.array([[cgpa, iq]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Map prediction to text result
        result = "Placed" if int(prediction) == 1 else "Not Placed"
        
        return jsonify({
            'prediction': int(prediction),
            'result': result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)
