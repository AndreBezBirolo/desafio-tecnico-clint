import { IColumn } from "../../interfaces/interfaces";
import React from "react";
import { Column } from "../Column/Column";
import './Board.css'
import { Form } from "react-bootstrap";
import { debounce } from "lodash";

interface BoardProps {
    columns: IColumn[];
    onUpdateTasks: () => void;
    filter: string | null;
    sort: string | null;
    search: string | null;
    setFilter: React.Dispatch<React.SetStateAction<string | null>>;
    setSort: React.Dispatch<React.SetStateAction<string | null>>;
    setSearch: React.Dispatch<React.SetStateAction<string | null>>
}

export const Board: React.FC<BoardProps> = ({
                                                columns,
                                                onUpdateTasks,
                                                filter,
                                                sort,
                                                search,
                                                setFilter,
                                                setSort,
                                                setSearch
                                            }) => {

    const delayedHandleSearchChange = debounce((value: string) => {
        setSearch(value);
    }, 300);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        delayedHandleSearchChange(event.target.value);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value);
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(event.target.value);
    };

    return (
        <div className="board">
            <div className="actions-container">
                <Form.Select onChange={handleFilterChange} defaultValue="">
                    <option value="">Filter by...</option>
                    <option value="Ready">Ready</option>
                    <option value="To do">To do</option>
                    <option value="Doing">Doing</option>
                </Form.Select>
                <Form.Select onChange={handleSortChange} defaultValue="">
                    <option value="">Order by...</option>
                    <option value="name">Name</option>
                    <option value="due_date">Due Date</option>
                </Form.Select>
                <Form.Control
                    type="text"
                    placeholder="Search..."
                    onChange={handleSearchChange}
                />
            </div>
            <div className="columns-container">
                {columns.map((column: IColumn) => (
                    <Column onUpdateTasks={onUpdateTasks} key={column.key} column={column}></Column>
                ))}
            </div>
        </div>
    );
};