// Constantes para seleccionar el formulario, input de entrada y la lista de tareas.
const formulario = document.getElementById('task-form');
const TareaInput = document.getElementById('new-task');
const ListaTareas = document.getElementById('task-list');

// Cargar las tareas desde el almacenamiento local al iniciar la aplicación
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

// Función para agregar una nueva tarea
formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    const InfoTarea = TareaInput.value.trim();
    if (InfoTarea === '') {
        alert('No puedes agregar tareas vacías. Por favor, escribe algo, tu puedes :)');
        return;
    }

    addTaskToDOM(InfoTarea, false);
    saveTaskToLocalStorage(InfoTarea, false);
    TareaInput.value = '';
});

// Función para manejar eventos de la lista (eliminar, marcar completada y tachar)
ListaTareas.addEventListener('click', function(event) {
    const li = event.target.closest('li');

    if (!li) return;

    const casillaAdorno = li.querySelector('input[type="checkbox"]');
    const InfoTarea = li.querySelector('span').textContent.trim();

    if (event.target.classList.contains('btn-eliminar')) {
        removeTaskFromLocalStorage(InfoTarea);
        li.remove();
    } else {
        
        toggleTask(casillaAdorno, li, InfoTarea);
    }
});

// Función para añadir tarea al DOM con casilla de verificación
function addTaskToDOM(InfoTarea, completed) {
    const li = document.createElement('li');
    li.className = 'task-item';  // Clase común para todas las tareas

    // Casilla de verificación de ADORNO
    const casillaAdorno = document.createElement('input');
    casillaAdorno.type = 'checkbox';
    casillaAdorno.checked = completed;
    li.appendChild(casillaAdorno);

    // Crear un nodo de texto solo para la tarea
    const textNode = document.createElement('span');
    textNode.textContent = InfoTarea; 
    li.appendChild(textNode);

    if (completed) {
        li.classList.add('completed');
    }

    // Botón de eliminar
    const BotonEliminar = document.createElement('button');
    BotonEliminar.classList.add('btn-eliminar');
    BotonEliminar.innerHTML = 'Eliminar <i class="fas fa-trash icon"></i>';
    li.appendChild(BotonEliminar);

    ListaTareas.appendChild(li);
    moveCompletedTasksToEnd();
}

// Función para cargar tareas desde el almacenamiento local
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        addTaskToDOM(task.text, task.completed);
    });
}

// Función para guardar tarea en almacenamiento local
function saveTaskToLocalStorage(InfoTarea, completed) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: InfoTarea, completed: completed });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Función para eliminar tarea del almacenamiento local
function removeTaskFromLocalStorage(InfoTarea) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== InfoTarea);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Función para marcar/desmarcar tarea completada en el almacenamiento local
function toggleTaskCompletionInLocalStorage(InfoTarea, completed) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        if (task.text === InfoTarea) {
            task.completed = completed;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Función para mover tareas completadas al final de la lista
function moveCompletedTasksToEnd() {
    const tasks = Array.from(ListaTareas.children);
    tasks.forEach(task => {
        if (task.classList.contains('completed')) {
            ListaTareas.appendChild(task);  // Mueve la tarea completada al final o debajo de las que no estan completadas.
        }
    });
}

// Función para alternar el estado de la tarea (completada/no completada)
function toggleTask(casillaAdorno, li, InfoTarea) {
    const completed = !casillaAdorno.checked; // Verifica el estado actual de la casilla

    // Cambiar el estado de la casilla de verificación
    casillaAdorno.checked = completed;

    // Cambiar la clase y el almacenamiento local
    if (completed) {
        li.classList.add('completed'); // Marca la tarea como completada.
    } else {
        li.classList.remove('completed'); // Desmarca la tarea.
    }

    toggleTaskCompletionInLocalStorage(InfoTarea, completed);
    moveCompletedTasksToEnd(); // Mueve tareas completadas al final o debajo de las no completadas.
}
