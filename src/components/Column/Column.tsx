import { IColumn } from "../../interfaces/interfaces";
import React from "react";
import { TaskCard } from "../TaskCard/TaskCard";
import './Column.css'
import { Droppable } from "react-beautiful-dnd";

export interface ColumnProps {
    column: IColumn;
    index: number;
    onUpdateTasks: () => void;
}

export const Column: React.FC<ColumnProps> = ({column, index, onUpdateTasks}) => {
    const handleDeleteTask = () => {
        onUpdateTasks();
    };

    return (
        <div className="column">
            <h2>{column.title}</h2>
            <Droppable droppableId={column.key.toString()} direction="vertical" type="task">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="tasks-container">
                        {column.tasks.map((task, index) => (
                            <TaskCard key={task.id} task={task} index={index}
                                      onDelete={() => handleDeleteTask()}/>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};