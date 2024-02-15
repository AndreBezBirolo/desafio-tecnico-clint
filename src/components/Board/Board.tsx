import { IColumn } from "../../interfaces/interfaces";
import React from "react";
import { Column } from "../Column/Column";
import './Board.css'

interface BoardProps {
    columns: IColumn[];
}

export const Board: React.FC<BoardProps> = ({columns}) => {
    return (
        <div className="board">
            {columns.map((column: IColumn) => (
                <Column key={column.key} column={column}></Column>
            ))}
        </div>
    );
};