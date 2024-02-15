import React from "react";
import { ITask } from "../interfaces/interfaces";

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
            <p>{task.name}</p>
            <p>{task.status}</p>
            <p>{formattedDate.toLocaleDateString()}</p>
        </div>
    );
};