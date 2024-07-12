document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-task').addEventListener('click', () => {
        const taskValue = document.getElementById('new-task').value;
        if (taskValue) {
            addTask(taskValue);
            document.getElementById('new-task').value = '';
            saveTasks();
        }
    });

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        addTask(task.text, task.isCompleted);
    });
});

function addTask(taskValue, isCompleted = false) {
    const ul = document.getElementById('task-list');
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCompleted;
    checkbox.addEventListener('change', toggleTask);

    const text = document.createElement('span');
    text.textContent = taskValue;
    text.style.textDecoration = isCompleted ? 'line-through' : 'none';

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', editTask);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', deleteTask);

    li.append(checkbox, text, editButton, deleteButton);
    ul.appendChild(li);
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(taskLi => {
        const text = taskLi.querySelector('span').textContent;
        const isCompleted = taskLi.querySelector('input').checked;
        tasks.push({ text, isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleTask(event) {
    event.target.nextElementSibling.style.textDecoration = event.target.checked ? 'line-through' : 'none';
    saveTasks();
}

function deleteTask(event) {
    const li = event.target.parentNode;
    event.target.parentNode.parentNode.removeChild(li);
    saveTasks();
}

function editTask(event) {
    const textSpan = event.target.previousElementSibling;
    const newText = prompt("Edit Your Task", textSpan.textContent);
    if (newText !== null && newText !== textSpan.textContent) {
        textSpan.textContent = newText;
        saveTasks();
    }
}