import { useState, useEffect, useRef } from 'react'
import './App.css'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

type Filter = 'all' | 'active' | 'completed'

function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem('todos')
      return saved ? (JSON.parse(saved) as Todo[]) : []
    } catch {
      return []
    }
  })
  const [filter, setFilter] = useState<Filter>('all')
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const editRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus()
      editRef.current.select()
    }
  }, [editingId])

  const addTodo = () => {
    const text = input.trim()
    if (!text) return
    setTodos(prev => [
      ...prev,
      { id: generateId(), text, completed: false, createdAt: Date.now() },
    ])
    setInput('')
    inputRef.current?.focus()
  }

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const commitEdit = () => {
    if (!editingId) return
    const text = editText.trim()
    if (text) {
      setTodos(prev =>
        prev.map(t => (t.id === editingId ? { ...t, text } : t)),
      )
    } else {
      setTodos(prev => prev.filter(t => t.id !== editingId))
    }
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const clearCompleted = () => {
    setTodos(prev => prev.filter(t => !t.completed))
  }

  const toggleAll = () => {
    const allCompleted = todos.every(t => t.completed)
    setTodos(prev => prev.map(t => ({ ...t, completed: !allCompleted })))
  }

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length
  const allCompleted = todos.length > 0 && todos.every(t => t.completed)

  return (
    <div className="app">
      <header>
        <h1>TODO</h1>
      </header>

      <div className="card">
        <div className="input-row">
          {todos.length > 0 && (
            <button
              className={`toggle-all ${allCompleted ? 'all-done' : ''}`}
              onClick={toggleAll}
              title="すべて完了/未完了にする"
              aria-label="すべて完了/未完了にする"
            >
              ▾
            </button>
          )}
          <input
            ref={inputRef}
            className="todo-input"
            type="text"
            placeholder="タスクを入力して Enter..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            autoFocus
          />
          <button className="add-btn" onClick={addTodo}>
            追加
          </button>
        </div>

        {filtered.length > 0 && (
          <ul className="todo-list">
            {filtered.map(todo => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="checkbox"
                  aria-label={`${todo.text} を完了にする`}
                />
                {editingId === todo.id ? (
                  <input
                    ref={editRef}
                    className="edit-input"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitEdit()
                      if (e.key === 'Escape') cancelEdit()
                    }}
                  />
                ) : (
                  <span
                    className="todo-text"
                    onDoubleClick={() => !todo.completed && startEdit(todo)}
                    title={todo.completed ? '' : 'ダブルクリックで編集'}
                  >
                    {todo.text}
                  </span>
                )}
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`${todo.text} を削除`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {todos.length === 0 && (
          <div className="empty">
            <div className="empty-icon">✓</div>
            <p className="empty-title">タスクがありません</p>
            <p className="empty-sub">上のフォームからタスクを追加しましょう</p>
          </div>
        )}

        {todos.length > 0 && (
          <div className="footer">
            <span className="count">
              {activeCount} 件残り
            </span>
            <div className="filters" role="group" aria-label="フィルター">
              {(
                [
                  ['all', 'すべて'],
                  ['active', '未完了'],
                  ['completed', '完了済み'],
                ] as [Filter, string][]
              ).map(([f, label]) => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                >
                  {label}
                </button>
              ))}
            </div>
            {completedCount > 0 && (
              <button className="clear-btn" onClick={clearCompleted}>
                完了済みを削除
              </button>
            )}
          </div>
        )}
      </div>

      <p className="hint">ダブルクリックでタスクを編集 · Esc でキャンセル</p>
    </div>
  )
}

export default App
