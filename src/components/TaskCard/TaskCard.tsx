import React, { useCallback, useState } from "react";
import { ITask } from "../../interfaces/interfaces";
import './TaskCard.css'
import { Button, CloseButton, Modal } from "react-bootstrap";
import { Draggable } from "react-beautiful-dnd";
import TaskService from "../../services/TaskService";
import { toast } from 'react-toastify';


export interface TaskCardProps {
    task: ITask;
    index: number;
    onDelete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({task, index, onDelete}) => {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = useCallback(() => setShowModal(true), []);
    const handleCloseModal = useCallback(() => setShowModal(false), []);

    const formattedDate = new Date(task.due_date);

    const deleteTask = async (): Promise<void> => {
        try {
            await TaskService.deleteTask(task.id, onDelete);
        } catch (errorMessage) {
            toast.error(errorMessage as string);
        }
    }


    const handleDeleteTask = useCallback(async () => {
        await deleteTask();
    }, []);

    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided) => (
                <div ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps} className="task-card">
                    <h4>{task.name}</h4>
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