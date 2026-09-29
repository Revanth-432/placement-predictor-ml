import React, { useState } from 'react';
import axios from 'axios';
import { Brain, GraduationCap, Sparkles, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
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
      setError(err.response?.data?.error || "Failed to connect to the server. Is the Python backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        <div className="header">
          <h1>Placement Predictor</h1>
          <p>AI-powered placement probability analysis</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="iq">Student IQ</label>
            <div className="input-wrapper">
              <Brain />
              <input
                type="number"
                id="iq"
                name="iq"
                placeholder="e.g. 100"
                value={formData.iq}
                onChange={handleChange}
                step="0.01"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="cgpa">Student CGPA</label>
            <div className="input-wrapper">
              <GraduationCap />
              <input
                type="number"
                id="cgpa"
                name="cgpa"
                placeholder="e.g. 7.5"
                value={formData.cgpa}
                onChange={handleChange}
                step="0.01"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="predict-btn"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="spinner" />
            ) : (
              <Sparkles />
            )}
            {loading ? 'Analyzing...' : 'Predict Placement'}
          </button>
        </form>

        {error && (
          <div className="result-card error" style={{ padding: '1rem', marginTop: '1rem' }}>
            <p style={{ color: 'var(--error)' }}>{error}</p>
          </div>
        )}

        {result && (
          <div className={`result-card ${result.prediction === 1 ? 'success' : 'error'}`}>
            <div className="result-icon">
              {result.prediction === 1 ? (
                <CheckCircle2 size={32} />
              ) : (
                <XCircle size={32} />
              )}
            </div>
            <h2 className="result-title">
              {result.prediction === 1 ? 'High Chance of Placement!' : 'Needs Improvement'}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              {result.prediction === 1 
                ? 'Great job! The model predicts this student will be placed.'
                : 'The model predicts this student might struggle to be placed.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
