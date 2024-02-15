import { IColumn } from "../interfaces/interfaces";
import React from "react";
import { Column } from "./Column";

interface BoardProps {
    columns: IColumn[];
}

export const Board: React.FC<BoardProps> = ({columns}) => {
    return (
        <div className="board">
            {columns.map((column: IColumn) => (
                <div key={column.key}>
                    <div>
                        <Column key={column.key} column={column}></Column>
                    </div>
                </div>
            ))}
        </div>
    );
};