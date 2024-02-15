import React, { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";

interface Task {
    id: number;
    name: string;
    status: string;
    due_date: string;
}

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        /* TODO: Verificar porque está sendo chamado duas vezes */
        fetchTasks();
    }, []);

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
            </main>
        </div>
    );
}

export default App;
