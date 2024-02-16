import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import { IColumn, ITask, ITaskBase } from "./interfaces/interfaces";
import { Board } from './components/Board/Board';
import { Button } from "react-bootstrap";
import { TaskForm } from "./components/TaskForm/TaskForm";
import LoginForm from "./components/LoginForm/LoginForm";
import { setupJWT } from './Middleware/AuthMiddleware';
import UserService from "./services/UserService";
import TaskService from "./services/TaskService";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [filter, setFilter] = useState<string | null>(null);
    const [sort, setSort] = useState<string | null>(null);
    const [search, setSearch] = useState<string | null>(null);
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
    const navigate = useNavigate();

    const fetchTasks = async (): Promise<void> => {
        try {
            const tasks = await TaskService.fetch(filter, search, sort);
            setTasks(tasks);
        } catch (errorMessage) {
            toast.error(errorMessage as string)
        }
    }

    const postTask = async (taskData: ITaskBase): Promise<void> => {
        try {
            await TaskService.create(taskData);
        } catch (errorMessage) {
            toast.error(errorMessage as string)
        }
    }

    const patchTask = async (taskId: number, updatedStatus: string): Promise<void> => {
        try {
            await TaskService.editStatus(taskId, updatedStatus);
        } catch (errorMessage) {
            toast.error(errorMessage as string);
        }
    }

    const handleFormSubmit = useCallback(async (taskData: ITaskBase) => {
        await postTask(taskData);
        await fetchTasks();
        setFilter(null);
        setSort(null);
        setSearch(null);
    }, []);

    const handleTaskMove = useCallback(async (taskId: number, updatedStatus: string) => {
        await patchTask(taskId, updatedStatus);
    }, [])

    const handleLogin = useCallback(() => {
        setIsLoggedIn(true);
    }, [])

    const handleLogout = useCallback(() => {
        setIsLoggedIn(false);
        navigate('/login');
        UserService.logout();
    }, [navigate])

    useEffect(() => {
        setupJWT();
        const token = UserService.getToken();
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchTasks();
        }
    }, [filter, sort, search, isLoggedIn]);


    return (
        <div className="App">
            <ToastContainer/>
            <header>
                <div className="header-content">
                    <h1>Online Kanban Board</h1>
                    {isLoggedIn ? <a onClick={handleLogout} className="link">Logout</a> : ''}
                </div>
                {/*<ErrorToast show={showError} onClose={handleCloseError} message={errorMessage}/>*/}
            </header>
            <main>
                <Routes>
                    <Route path="/" element={
                        isLoggedIn ? <>
                            <Link to="/new-task">
                                <Button className="add-task-button">
                                    Add new task
                                </Button>
                            </Link>
                            <Board onUpdateTasks={fetchTasks} setSearch={setSearch} filter={filter} sort={sort}
                                   onTaskMove={handleTaskMove}
                                   setFilter={setFilter}
                                   search={search}
                                   setSort={setSort} columns={columns}/>
                        </> : <Navigate to="/login" replace/>
                    }></Route>
                    <Route path="/login" element={
                        isLoggedIn ? <Navigate to="/" replace/> : <LoginForm onLogin={handleLogin}/>
                    }/>
                    <Route path="/new-task" element={isLoggedIn ?
                        <TaskForm onSubmit={handleFormSubmit}/> :
                        <Navigate to="/login" replace/>}/>
                    <Route path="*" element={<Navigate to="/login" replace/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default App;
