import React, { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";
import { IColumn, ITask, ITaskBase } from "./interfaces/interfaces";
import { Board } from './components/Board/Board';
import { Button } from "react-bootstrap";
import { TaskForm } from "./components/TaskForm/TaskForm";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    const [showForm, setShowForm] = useState
    (false);
    const [filter, setFilter] = useState<string | null>(null);
    const [sort, setSort] = useState<string | null>(null);
    const [search, setSearch] = useState<string | null>(null);
    const handleAddTaskClick = () => {
        setShowForm(true);
    };
    const organizeTasksInColumns = () => {
        const newColumns = columns.map((column) => ({
            ...column,
            tasks: tasks.filter((task) => task.status.replace(/\s/g, '').toLowerCase() === column.key),
        }));
        setColumns(newColumns);
    };
    const fetchTasks = async (): Promise<void> => {
        try {
            const response = await axios.get<ITask[]>(`${process.env.REACT_APP_BACKEND_URL}/tasks`, {
                params: {
                    filter,
                    search,
                    sort,
                },
            });
            setTasks(response.data);
        } catch (e) {
            console.log('--- Error: ', e)
        }
    }

    const postTask = async (taskData: ITaskBase): Promise<void> => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks`, taskData);
        } catch (e) {
            console.log('--- Error: ', e)
        }
    }

    const handleFormSubmit = async (taskData: ITaskBase) => {
        await postTask(taskData);
        await fetchTasks();
        setFilter(null);
        setSort(null);
        setSearch(null);
        setShowForm(false);
    };

    const handleFormCancel = () => {
        setShowForm(false);
    };

    const handleTaskMove = async (taskId: number, updatedStatus: string) => {
        try {
            await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/tasks/${taskId}`, {
                status: updatedStatus
            });
            await fetchTasks();
        } catch (error) {
            console.error('Erro ao mover a tarefa:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [filter, sort, search]);

    useEffect(() => {
        organizeTasksInColumns();
    }, [tasks]);

    return (
        <div className="App">
            <header>
                <h1>Online Kanban Board</h1>
            </header>
            <main>
                {showForm ? (
                    <TaskForm onBack={handleFormCancel} onSubmit={handleFormSubmit}/>
                ) : (
                    <>
                        <Button className="add-task-button" onClick={handleAddTaskClick}>Add new task</Button>
                        <Board onUpdateTasks={fetchTasks} setSearch={setSearch} filter={filter} sort={sort}
                               onTaskMove={handleTaskMove}
                               setFilter={setFilter}
                               search={search}
                               setSort={setSort} columns={columns}/>
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
