import React, { useState } from "react";
import { ITask } from "../../interfaces/interfaces";
import './TaskCard.css'
import { Button, CloseButton, Modal } from "react-bootstrap";
import axios from "axios";
import { Draggable } from "react-beautiful-dnd";
import ErrorToast from "../Toasts/ErrorToast";

export interface TaskCardProps {
    task: ITask;
    index: number;
    onDelete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({task, index, onDelete}) => {
    const [showModal, setShowModal] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleShowError = (message: string) => {
        setErrorMessage(message);
        setShowError(true);
    };

    const handleCloseError = () => {
        setShowError(false);
    };
    const formattedDate = new Date(task.due_date);

    const deleteTask = async (): Promise<void> => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/tasks/${task.id}`);
            onDelete();
        } catch (error) {
            handleShowError('An error occurred while fetching data from the server.');
        }
    }

    const handleDeleteTask = async () => {
        await deleteTask();
        handleCloseModal();
    };

    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided) => (
                <div ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps} className="task-card">
                    <h4>{task.name}</h4>
                    <ErrorToast show={showError} onClose={handleCloseError} message={errorMessage}/>
                    <p>Due date: {formattedDate.toLocaleDateString()}</p>
                    <CloseButton onClick={handleShowModal} className="close-button"></CloseButton>

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete this task?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleDeleteTask}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
        </Draggable>
    );
};