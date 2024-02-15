import React, { useState } from "react";
import { ITaskBase } from "../../interfaces/interfaces";
import './TaskForm.css'
import { Button, Form } from "react-bootstrap";

interface TaskFormProps {
    onSubmit: (taskData: ITaskBase) => void;
    onBack: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({onSubmit, onBack}) => {
    const [taskData, setTaskData] = useState({
        name: '',
        due_date: new Date(),
        status: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setTaskData({...taskData, [name]: value});
    };

    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setTaskData({...taskData, [name]: value});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(taskData);
        setTaskData({
            name: '',
            due_date: new Date(),
            status: ''
        });
    };

    const handleBack = () => {
        onBack();
        setTaskData({
            name: '',
            due_date: new Date(),
            status: ''
        });
    };

    return (
        <div className="center">
            <div className="task-form-container">
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="taskName">
                        <Form.Label>Task name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={taskData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="due_date">
                        <Form.Label>Due date</Form.Label>
                        <Form.Control
                            type="date"
                            name="due_date"
                            value={taskData.due_date instanceof Date ? taskData.due_date.toISOString().split('T')[0] : taskData.due_date}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={taskData.status}
                            onChange={handleChangeSelect}
                            required
                        >
                            <option value="">Select a status</option>
                            <option value="todo">To do</option>
                            <option value="doing">Doing</option>
                            <option value="ready">Ready</option>
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Send
                    </Button>
                    <Button variant="secondary" onClick={handleBack}>
                        Back
                    </Button>
                </Form>
            </div>
        </div>
    );
};