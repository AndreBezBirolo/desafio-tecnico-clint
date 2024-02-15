import React from "react";
import { ITask } from "../../interfaces/interfaces";
import './TaskCard.css'

export enum TaskStatus {
    ToDo = 'To do',
    Doing = 'Doing',
    Ready = 'Ready',
}

export interface TaskCardProps {
    task: ITask
}

export const TaskCard: React.FC<TaskCardProps> = ({task}) => {
    const formattedDate = new Date(task.due_date);

    return (
        <div className="task-card">
            <h3>{task.name}</h3>
            <p>Due date: {formattedDate.toLocaleDateString()}</p>
        </div>
    );
};