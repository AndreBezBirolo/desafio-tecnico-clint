import React, { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";
import { IColumn, ITask } from "./interfaces/interfaces";
import { Board } from './components/Board';

function App() {
    const [columns, setColumns] = useState<IColumn[]>([
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
    const [tasks, setTasks] = useState<ITask[]>([]);

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
            const response = await axios.get<ITask[]>(`${process.env.REACT_APP_BACKEND_URL}/tasks`);
            setTasks(response.data);
        } catch (e) {
            console.log('--- Error: ', e)
        }
    }

    return (
        <div className="App">
            <header>Online Kanban Board</header>
            <main>
                <Board columns={columns}></Board>
            </main>
        </div>
    );
}

export default App;
