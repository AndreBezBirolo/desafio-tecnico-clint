import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import { IColumn, ITask, ITaskBase } from "./interfaces/interfaces";
import { Board } from './components/Board/Board';
import { Button } from "react-bootstrap";
import { TaskForm } from "./components/TaskForm/TaskForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import ErrorToast from "./components/Toasts/ErrorToast";
import LoginForm from "./components/LoginForm/LoginForm";
import { setupJWT } from './Middleware/AuthMiddleware';
import UserService from "./services/UserService";
import TaskService from "./services/TaskService";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [showForm, setShowForm] = useState
    (false);
    const [filter, setFilter] = useState<string | null>(null);
    const [sort, setSort] = useState<string | null>(null);
    const [search, setSearch] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const columns: IColumn[] = useMemo(() => [
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
    ].map((column) => ({
        ...column,
        tasks: tasks.filter((task) => task.status.replace(/\s/g, '').toLowerCase() === column.key),
    })), [tasks])

    const fetchTasks = async (): Promise<void> => {
        try {
            const tasks = await TaskService.fetchTasks(filter, search, sort);
            setTasks(tasks);
        } catch (errorMessage) {
            handleShowError(errorMessage as string);
        }
    }

    const postTask = async (taskData: ITaskBase): Promise<void> => {
        try {
            await TaskService.postTask(taskData);
        } catch (errorMessage) {
            handleShowError(errorMessage as string);
        }
    }

    const patchTask = async (taskId: number, updatedStatus: string): Promise<void> => {
        try {
            await TaskService.patchTask(taskId, updatedStatus);
        } catch (errorMessage) {
            handleShowError(errorMessage as string);
        }
    }

    const handleShowError = useCallback((message: string) => {
        setErrorMessage(message);
        setShowError(true);
    }, []);

    const handleCloseError = useCallback(() => {
        setShowError(false);
    }, []);

    const handleFormSubmit = useCallback(async (taskData: ITaskBase) => {
        await postTask(taskData);
        await fetchTasks();
        setFilter(null);
        setSort(null);
        setSearch(null);
        setShowForm(false);
    }, []);

    const handleTaskMove = useCallback(async (taskId: number, updatedStatus: string) => {
        await patchTask(taskId, updatedStatus);
    }, [])


    const handleAddTaskClick = useCallback(() => {
        setShowForm(true);
    }, []);

    const handleLogin = useCallback(() => {
        setIsLoggedIn(true);
    }, [])

    const handleLogout = useCallback(() => {
        setIsLoggedIn(false);
        UserService.logout();
    }, [])

    useEffect(() => {
        setupJWT();
        const token = UserService.getToken();
        setIsLoggedIn(!!token);
        fetchTasks();
    }, []);

    /* TODO: Ao invés de usar
            useEffect(() => {
                    fetchTasks();
                }, [filter, sort, search]);
            Aplicar o fetch em todos os locais que geram as mudanças no board.tsx */
    useEffect(() => {
        fetchTasks();
    }, [filter, sort, search]);

    return (
        <div className="App">
            <header>
                <div className="header-content">
                    <h1>Online Kanban Board</h1>
                    {isLoggedIn ? <a onClick={handleLogout} className="link">Logout</a> : ''}
                </div>
                <ErrorToast show={showError} onClose={handleCloseError} message={errorMessage}/>
            </header>
            <main>
                {isLoggedIn ? (
                    <>
                        {showForm ? (
                            <TaskForm onBack={() => setShowForm(false)} onSubmit={handleFormSubmit}/>
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
                    </>
                ) : (
                    <LoginForm onLogin={handleLogin}/>
                )}
            </main>
        </div>
    );
}

export default App;
