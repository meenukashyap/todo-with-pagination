document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://jsonplaceholder.typicode.com/todos';
    const todoList = document.getElementById('todo-list');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    let currentPage = 1;
    const todosPerPage = 10;

    async function fetchTodos(page) {
        try {
            const response = await fetch(`${apiUrl}?_page=${page}&_limit=${todosPerPage}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const todos = await response.json();
            const totalTodos = response.headers.get('x-total-count');
            return { todos, totalTodos };
        } catch (error) {
            console.error('Fetch error:', error);
            return { todos: [], totalTodos: 0 };
        }
    }

    function displayTodos(todos) {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.classList.add('todo-item');
            todoElement.innerHTML = `
                <p><strong>${todo.title}</strong></p>
                <p>Completed: ${todo.completed}</p>
            `;
            todoList.appendChild(todoElement);
        });
    }

    function updatePagination(totalTodos) {
        const totalPages = Math.ceil(totalTodos / todosPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    async function loadTodos() {
        const { todos, totalTodos } = await fetchTodos(currentPage);
        displayTodos(todos);
        updatePagination(totalTodos);
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadTodos();
        }
    });

    nextBtn.addEventListener('click', () => {
        currentPage++;
        loadTodos();
    });

    // Initial load
    loadTodos();
});
