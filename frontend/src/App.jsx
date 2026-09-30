import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    iq: '',
    cgpa: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear results when typing
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.iq || !formData.cgpa) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Connect to the Flask backend
      const response = await axios.post('http://localhost:5000/predict', {
        iq: parseFloat(formData.iq),
        cgpa: parseFloat(formData.cgpa)
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="header">
          <h1>Placement Predictor</h1>
          <p>Enter student details to predict placement</p>
        </div>

        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="input-group">
            <label htmlFor="iq">Student IQ</label>
            <input
              type="number"
              id="iq"
              name="iq"
              value={formData.iq}
              onChange={handleChange}
              step="0.01"
            />
          </div>

          <div className="input-group">
            <label htmlFor="cgpa">Student CGPA</label>
            <input
              type="number"
              id="cgpa"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              step="0.01"
            />
          </div>

          <button 
            type="submit" 
            className="predict-btn"
            disabled={loading}
          >
            {loading ? 'Predicting...' : 'Predict'}
          </button>
        </form>

        {error && (
          <div className="alert error-alert">
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className={`alert ${result.prediction === 1 ? 'success-alert' : 'error-alert'}`}>
            <h2>
              {result.prediction === 1 ? 'Placed' : 'Not Placed'}
            </h2>
            <p>
              {result.prediction === 1 
                ? 'The model predicts this student will be placed.'
                : 'The model predicts this student will not be placed.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
