import { IColumn } from "../../interfaces/interfaces";
import React from "react";
import { Column } from "../Column/Column";
import './Board.css'

interface BoardProps {
    columns: IColumn[];
    onUpdateTasks: () => void;
}

export const Board: React.FC<BoardProps> = ({columns, onUpdateTasks}) => {
    return (
        <div className="board">
            {columns.map((column: IColumn) => (
                <Column onUpdateTasks={onUpdateTasks} key={column.key} column={column}></Column>
            ))}
        </div>
    );
};