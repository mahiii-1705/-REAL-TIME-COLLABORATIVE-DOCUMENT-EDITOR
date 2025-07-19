import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/document')
      .then(res => res.json())
      .then(data => setText(data.text))
      .catch(err => console.error("Error loading text:", err));
  }, []);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    fetch('http://localhost:3001/document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText })
    }).catch(err => console.error("Error saving text:", err));
  };

  return (
    <div className="App">
      <h1>Collaborative Editor</h1>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Start typing..."
      />
    </div>
  );
}

export default App;

