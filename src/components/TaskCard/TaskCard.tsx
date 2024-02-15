import React, { useState } from "react";
import { ITask } from "../../interfaces/interfaces";
import './TaskCard.css'
import { Button, CloseButton, Modal } from "react-bootstrap";
import axios from "axios";
import { Draggable } from "react-beautiful-dnd";

export enum TaskStatus {
    ToDo = 'To do',
    Doing = 'Doing',
    Ready = 'Ready',
}

export interface TaskCardProps {
    task: ITask;
    index: number;
    onDelete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({task, index, onDelete}) => {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const formattedDate = new Date(task.due_date);

    const handleDeleteTask = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/tasks/${task.id}`);
            onDelete();
        } catch (error) {
            console.error('Erro ao excluir a tarefa:', error);
        }
        handleCloseModal();
    };

    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided) => (
                <div ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps} className="task-card">
                    <h3>{task.name}</h3>
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