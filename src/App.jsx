import React from 'react';
import Note from './Note.jsx';

export default function App() {
  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem' }}>
      <h1 className="app-title">SmartNotes ✨</h1>
      <Note />
    </div>
  );
}
