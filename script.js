// TODOリストアプリ - ローカルストレージ使用
const STORAGE_KEY = 'todos';
let todos = [];
let currentFilter = 'all';

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const clearBtn = document.getElementById('clearBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// 初期化
function init() {
    loadTodos();
    renderTodos();
    setupEventListeners();
}

// イベントリスナーの設定
function setupEventListeners() {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    clearBtn.addEventListener('click', clearCompletedTodos);
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTodos();
        });
    });
}

// ローカルストレージからロード
function loadTodos() {
    const saved = localStorage.getItem(STORAGE_KEY);
    todos = saved ? JSON.parse(saved) : [];
}

// ローカルストレージに保存
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// TODOを追加
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    todos.unshift(todo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

// TODOを削除
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// TODOの完了状態を切り替え
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// 完了したTODOをクリア
function clearCompletedTodos() {
    if (!todos.some(t => t.completed)) return;
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

// TODOをレンダリング
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    todoList.innerHTML = '';
    
    if (filteredTodos.length === 0) {
        emptyState.classList.remove('hidden');
        clearBtn.disabled = !todos.some(t => t.completed);
    } else {
        emptyState.classList.add('hidden');
        filteredTodos.forEach(todo => {
            const li = createTodoElement(todo);
            todoList.appendChild(li);
        });
    }

    updateStats();
    clearBtn.disabled = !todos.some(t => t.completed);
}

// フィルタリングされたTODOを取得
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

// TODOエレメントを作成
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '削除';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
}

// 統計情報を更新
function updateStats() {
    const total = todos.length;
    const active = todos.filter(t => !t.completed).length;
    const completed = todos.filter(t => t.completed).length;

    document.getElementById('totalCount').textContent = `合計: ${total}`;
    document.getElementById('activeCount').textContent = `未完了: ${active}`;
    document.getElementById('completedCount').textContent = `完了: ${completed}`;
}

// 初期化を実行
init();
