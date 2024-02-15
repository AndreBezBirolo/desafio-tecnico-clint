import { Column } from "../interfaces/interfaces";
import React from "react";

interface BoardProps {
    columns: Column[];
}

export const Board: React.FC<BoardProps> = ({columns}) => {
    return (
        <div className="board">
            {columns.map((column: Column) => (
                <div key={column.key}>
                    <h2>{column.title}</h2>
                    <div>
                        Lista de tarefas
                    </div>
                </div>
            ))}
        </div>
    );
};