import React, { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";

interface Task {
    id: number;
    name: string;
    status: string;
    due_date: string;
}

interface Column {
    key: string,
    title: string,
    tasks: Task[]
}

function App() {
    const [columns, setColumns] = useState<Column[]>([
        {
            key: 'todo',
            title: 'To do',
            tasks: [],
        },
        {
            key: 'doing',
            title: 'Doing',
            tasks: [],
        },
        {
            key: 'ready',
            title: 'Ready',
            tasks: [],
        },
    ])
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        /* TODO: Verificar porque está sendo chamado duas vezes */
        fetchTasks();
    }, []);

    useEffect(() => {
        organizeTasksInColumns();
    }, [tasks]);

    const organizeTasksInColumns = () => {
        console.log('--- organize tasks', columns, tasks)
        const newColumns = columns.map((column) => ({
            ...column,
            tasks: tasks.filter((task) => task.status.replace(/\s/g, '').toLowerCase() === column.key),
        }));
        setColumns(newColumns);
    };
    const fetchTasks = async (): Promise<void> => {
        try {
            const response = await axios.get<Task[]>(`${process.env.REACT_APP_BACKEND_URL}/tasks`);
            setTasks(response.data);
        } catch (e) {
            console.log('--- Error: ', e)
        }
    }

    return (
        <div className="App">
            <header>Online Kanban Board</header>
            <main>
                {/*    Criar o board e o formulário para cadastrar task */}
                {columns.map((column) => (
                    <div key={column.key}>
                        <h2>{column.title}</h2>
                        <ul>
                            {column.tasks.map((task) => (
                                <li key={task.id}>{task.name}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </main>
        </div>
    );
}

export default App;
