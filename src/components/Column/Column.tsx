import { IColumn } from "../../interfaces/interfaces";
import React from "react";
import { TaskCard } from "../TaskCard/TaskCard";
import './Column.css'

export interface ColumnProps {
    column: IColumn
}

export const Column: React.FC<ColumnProps> = ({column}) => {
    return (
        <div className="column">
            <h2>{column.title}</h2>
            <div className="tasks-container">
                {column.tasks.map((task, index) => (
                    <TaskCard task={task}></TaskCard>
                ))}
            </div>
        </div>
    );
};