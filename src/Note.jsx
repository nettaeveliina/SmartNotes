import React, { useState, useEffect } from 'react';
import { FaTrash, FaPen, FaCheck, FaPlus, FaStickyNote, FaTasks, FaMoon, FaSun } from 'react-icons/fa';

export default function App() {
  // --- Teemat ---
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('sn-darkMode') === 'true' || false;
  });

  useEffect(() => {
    localStorage.setItem('sn-darkMode', darkMode);
  }, [darkMode]);

  // --- Välilehdet ---
  const [tab, setTab] = useState('notes'); // 'notes' tai 'todos'

  // --- MUISTIINNOT ---
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('sn-notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('sn-categories');
    return saved ? JSON.parse(saved) : ['Yleinen'];
  });
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Yleinen');
  const [editNoteId, setEditNoteId] = useState(null);

  // --- TO-DO ---
  const [todoText, setTodoText] = useState('');
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('sn-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [editTodoId, setEditTodoId] = useState(null);

  // --- Save localStorage on changes ---
  useEffect(() => {
    localStorage.setItem('sn-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('sn-categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('sn-todos', JSON.stringify(todos));
  }, [todos]);

  // --- NOTE HANDLERS ---
  const saveNote = () => {
    if (!noteText.trim()) return;

    if (editNoteId !== null) {
      setNotes(notes.map(n => n.id === editNoteId ? { ...n, text: noteText.trim(), category: selectedCategory } : n));
      setEditNoteId(null);
    } else {
      setNotes([{ id: Date.now(), text: noteText.trim(), category: selectedCategory }, ...notes]);
    }
    setNoteText('');
    setSelectedCategory('Yleinen');
  };

  const deleteNote = id => {
    setNotes(notes.filter(n => n.id !== id));
    if (editNoteId === id) {
      setEditNoteId(null);
      setNoteText('');
      setSelectedCategory('Yleinen');
    }
  };

  const startEditNote = (id, text, category) => {
    setEditNoteId(id);
    setNoteText(text);
    setSelectedCategory(category);
  };

  const cancelEditNote = () => {
    setEditNoteId(null);
    setNoteText('');
    setSelectedCategory('Yleinen');
  };

  // --- CATEGORY HANDLERS ---
  const addCategory = () => {
    const cat = newCategory.trim();
    if (!cat) return alert('Kategorian nimi ei voi olla tyhjä.');
    if (categories.includes(cat)) return alert('Kategoria on jo olemassa.');
    setCategories([...categories, cat]);
    setNewCategory('');
  };

  const deleteCategory = (cat) => {
    if (cat === 'Yleinen') return alert('Peruskategoriaa "Yleinen" ei voi poistaa.');
    if (!window.confirm(`Poistetaanko kategoria "${cat}" ja kaikki siihen kuuluvat muistiinpanot?`)) return;
    setCategories(categories.filter(c => c !== cat));
    setNotes(notes.filter(n => n.category !== cat));
    if (selectedCategory === cat) setSelectedCategory('Yleinen');
  };

  // --- TODO HANDLERS ---
  const saveTodo = () => {
    if (!todoText.trim()) return;

    if (editTodoId !== null) {
      setTodos(todos.map(t => t.id === editTodoId ? { ...t, text: todoText.trim() } : t));
      setEditTodoId(null);
    } else {
      setTodos([{ id: Date.now(), text: todoText.trim(), done: false }, ...todos]);
    }
    setTodoText('');
  };

  const deleteTodo = id => {
    setTodos(todos.filter(t => t.id !== id));
    if (editTodoId === id) {
      setEditTodoId(null);
      setTodoText('');
    }
  };

  const toggleDone = id => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const startEditTodo = (id, text) => {
    setEditTodoId(id);
    setTodoText(text);
  };

  const cancelEditTodo = () => {
    setEditTodoId(null);
    setTodoText('');
  };

  // --- Ryhmittele muistiinpanot kategorioittain ---
  const notesByCategory = categories.reduce((acc, cat) => {
    acc[cat] = notes.filter(n => n.category === cat);
    return acc;
  }, {});

  // --- TYYLIT ---
  const colors = {
    bg: darkMode ? '#121212' : '#f9f9f9',
    fg: darkMode ? '#eee' : '#222',
    cardBg: darkMode ? '#1e1e1e' : 'white',
    border: darkMode ? '#333' : '#ddd',
    accent: '#6c5ce7',
  };

  const styles = {
    app: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: 800,
      margin: '2rem auto',
      padding: '1rem',
      backgroundColor: colors.bg,
      color: colors.fg,
      minHeight: '90vh',
      borderRadius: 16,
      boxShadow: darkMode
        ? '0 0 10px rgba(100, 0, 255, 0.6)'
        : '0 8px 24px rgba(108, 92, 231, 0.3)',
      boxSizing: 'border-box',
      userSelect: 'text',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      userSelect: 'none',
    },
    tabs: {
      display: 'flex',
      gap: 12,
      marginTop: 12,
    },
    tab: {
      cursor: 'pointer',
      padding: '0.6rem 1.2rem',
      borderRadius: 10,
      fontWeight: '600',
      userSelect: 'none',
      backgroundColor: colors.cardBg,
      color: colors.fg,
      border: `2px solid transparent`,
      transition: 'all 0.25s ease',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
    tabActive: {
      borderColor: colors.accent,
      color: colors.accent,
      boxShadow: `0 0 8px ${colors.accent}`,
    },
    textarea: {
      width: '100%',
      minHeight: 120,
      padding: 12,
      borderRadius: 12,
      border: `2px solid ${colors.border}`,
      backgroundColor: colors.cardBg,
      color: colors.fg,
      fontSize: 16,
      resize: 'vertical',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease',
    },
    input: {
      padding: '0.5rem 1rem',
      fontSize: 16,
      borderRadius: 8,
      border: `2px solid ${colors.border}`,
      outline: 'none',
      boxSizing: 'border-box',
      color: colors.fg,
      backgroundColor: colors.cardBg,
    },
    button: {
      padding: '0.6rem 1.4rem',
      backgroundColor: colors.accent,
      color: 'white',
      border: 'none',
      borderRadius: 12,
      fontWeight: '600',
      fontSize: 16,
      cursor: 'pointer',
      userSelect: 'none',
      boxShadow: `0 4px 12px ${colors.accent}`,
      transition: 'background-color 0.3s ease',
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    noteCard: {
      backgroundColor: colors.cardBg,
      padding: 16,
      borderRadius: 16,
      marginBottom: 12,
      boxShadow: `0 2px 8px ${colors.border}`,
      userSelect: 'text',
    },
    noteText: {
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      fontSize: 16,
      marginBottom: 8,
    },
    noteButtons: {
      display: 'flex',
      gap: 10,
    },
    categorySelect: {
      marginBottom: 12,
      width: '100%',
      maxWidth: 240,
      borderRadius: 8,
      border: `2px solid ${colors.border}`,
      padding: '0.4rem 0.8rem',
      fontSize: 16,
      color: colors.fg,
      backgroundColor: colors.cardBg,
      cursor: 'pointer',
      userSelect: 'none',
      outline: 'none',
    },
    categoryRow: {
      display: 'flex',
      gap: 12,
      marginBottom: 16,
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    categoryItem: {
      padding: '0.4rem 0.8rem',
      borderRadius: 12,
      backgroundColor: colors.accent,
      color: 'white',
      fontWeight: '600',
      userSelect: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    categoryDeleteBtn: {
      cursor: 'pointer',
      fontSize: 14,
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      userSelect: 'none',
      padding: 0,
      marginLeft: 6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    todoList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      maxHeight: 400,
      overflowY: 'auto',
      userSelect: 'none',
    },
    todoItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem 1rem',
      marginBottom: 8,
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      boxShadow: `0 1px 4px ${colors.border}`,
      userSelect: 'text',
    },
    todoText: done => ({
      flexGrow: 1,
      fontSize: 16,
      color: done ? '#888' : colors.fg,
      textDecoration: done ? 'line-through' : 'none',
      cursor: 'pointer',
      userSelect: 'text',
    }),
    todoButtons: {
      display: 'flex',
      gap: 8,
      marginLeft: 12,
    },
    inputGroup: {
      display: 'flex',
      gap: 8,
      marginBottom: 12,
      flexWrap: 'wrap',
    },
    toggleThemeBtn: {
      cursor: 'pointer',
      backgroundColor: 'transparent',
      border: 'none',
      color: colors.accent,
      fontSize: 24,
      userSelect: 'none',
      transition: 'color 0.3s ease',
    },
    footer: {
      textAlign: 'center',
      fontSize: 12,
      color: colors.fg,
      userSelect: 'none',
      marginTop: 16,
    }
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1>
          {tab === 'notes' ? <><FaStickyNote /> Muistiinpanot</> : <><FaTasks /> Tehtävälista</>}
        </h1>
        <button
          title={darkMode ? 'Vaihda vaaleaan tilaan' : 'Vaihda tummaan tilaan'}
          onClick={() => setDarkMode(!darkMode)}
          style={styles.toggleThemeBtn}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </header>

      <nav style={styles.tabs}>
        <div
          onClick={() => setTab('notes')}
          style={{
            ...styles.tab,
            ...(tab === 'notes' ? styles.tabActive : {}),
          }}
          aria-selected={tab === 'notes'}
          role="tab"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') setTab('notes'); }}
        >
          <FaStickyNote /> Muistiinpanot
        </div>
        <div
          onClick={() => setTab('todos')}
          style={{
            ...styles.tab,
            ...(tab === 'todos' ? styles.tabActive : {}),
          }}
          aria-selected={tab === 'todos'}
          role="tab"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') setTab('todos'); }}
        >
          <FaTasks /> Tehtävälista
        </div>
      </nav>

      {tab === 'notes' && (
        <>
          {/* Uuden muistiinpanon lisääminen */}
          <textarea
            placeholder="Kirjoita muistiinpano..."
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            style={styles.textarea}
            aria-label="Muistiinpano"
          />

          {/* Kategoriavalikko ja lisäys */}
          <div style={styles.categoryRow}>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={styles.categorySelect}
              aria-label="Valitse kategoria"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Lisää uusi kategoria"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              style={styles.input}
              aria-label="Uusi kategoria"
              onKeyDown={e => { if (e.key === 'Enter') addCategory(); }}
            />
            <button
              onClick={addCategory}
              style={{ ...styles.button, flexShrink: 0 }}
              aria-label="Lisää kategoria"
              title="Lisää kategoria"
            >
              <FaPlus />
            </button>
          </div>

          <div>
            <button
              onClick={saveNote}
              style={{ ...styles.button, marginBottom: 16 }}
              disabled={!noteText.trim()}
            >
              {editNoteId !== null ? 'Tallenna muistiinpano' : 'Lisää muistiinpano'}
            </button>
            {editNoteId !== null && (
              <button
                onClick={cancelEditNote}
                style={{
                  ...styles.button,
                  backgroundColor: '#888',
                  marginLeft: 8,
                }}
              >
                Peruuta
              </button>
            )}
          </div>

          {/* Listaa muistiinpanot kategoriaryhmittäin */}
          {categories.map(cat => (
            <section key={cat} aria-label={`Kategoria ${cat}`}>
              <h2>{cat} ({notesByCategory[cat]?.length || 0})</h2>
              {notesByCategory[cat]?.length === 0 && <p style={{ fontStyle: 'italic' }}>Ei muistiinpanoja.</p>}
              {notesByCategory[cat]?.map(n => (
                <article key={n.id} style={styles.noteCard}>
                  <p style={styles.noteText}>{n.text}</p>
                  <div style={styles.noteButtons}>
                    <button
                      onClick={() => startEditNote(n.id, n.text, n.category)}
                      title="Muokkaa muistiinpanoa"
                      aria-label="Muokkaa muistiinpanoa"
                      style={{ ...styles.button, padding: '0.4rem 0.8rem', fontSize: 14 }}
                    >
                      <FaPen />
                    </button>
                    <button
                      onClick={() => deleteNote(n.id)}
                      title="Poista muistiinpano"
                      aria-label="Poista muistiinpano"
                      style={{ ...styles.button, backgroundColor: '#e74c3c', padding: '0.4rem 0.8rem', fontSize: 14 }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </article>
              ))}
            </section>
          ))}

          {/* Listaa kategoriat poistoa varten */}
          <section aria-label="Kategoriat">
            <h3>Kategoriat</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categories.map(cat => (
                <div key={cat} style={styles.categoryItem}>
                  {cat}
                  {cat !== 'Yleinen' && (
                    <button
                      onClick={() => deleteCategory(cat)}
                      aria-label={`Poista kategoria ${cat}`}
                      title={`Poista kategoria ${cat}`}
                      style={styles.categoryDeleteBtn}
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {tab === 'todos' && (
        <>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Lisää tehtävä..."
              value={todoText}
              onChange={e => setTodoText(e.target.value)}
              style={styles.input}
              aria-label="Tehtävä"
              onKeyDown={e => { if (e.key === 'Enter') saveTodo(); }}
            />
            <button
              onClick={saveTodo}
              style={{ ...styles.button, flexShrink: 0 }}
              disabled={!todoText.trim()}
              aria-label="Lisää tehtävä"
            >
              <FaPlus />
            </button>
            {editTodoId !== null && (
              <button
                onClick={cancelEditTodo}
                style={{
                  ...styles.button,
                  backgroundColor: '#888',
                  marginLeft: 8,
                }}
              >
                Peruuta
              </button>
            )}
          </div>

          <ul style={styles.todoList} aria-live="polite">
            {todos.length === 0 && <li style={{ fontStyle: 'italic' }}>Ei tehtäviä.</li>}
            {todos.map(t => (
              <li key={t.id} style={styles.todoItem}>
                <span
                  onClick={() => toggleDone(t.id)}
                  style={styles.todoText(t.done)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={t.done}
                  onKeyDown={e => { if (e.key === 'Enter') toggleDone(t.id); }}
                  title={t.done ? 'Merkitse tekemättömäksi' : 'Merkitse tehdyksi'}
                >
                  {t.text}
                </span>
                <div style={styles.todoButtons}>
                  <button
                    onClick={() => startEditTodo(t.id, t.text)}
                    title="Muokkaa tehtävää"
                    aria-label="Muokkaa tehtävää"
                    style={{ ...styles.button, padding: '0.4rem 0.8rem', fontSize: 14 }}
                  >
                    <FaPen />
                  </button>
                  <button
                    onClick={() => deleteTodo(t.id)}
                    title="Poista tehtävä"
                    aria-label="Poista tehtävä"
                    style={{ ...styles.button, backgroundColor: '#e74c3c', padding: '0.4rem 0.8rem', fontSize: 14 }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <footer style={styles.footer}>
        <small>SmartNotes & To-Do</small>
      </footer>
    </div>
  );
}
