import { IColumn } from "../../interfaces/interfaces";
import React from "react";
import { Column } from "../Column/Column";
import './Board.css'
import { Form } from "react-bootstrap";
import { debounce } from "lodash";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

interface BoardProps {
    columns: IColumn[];
    onUpdateTasks: () => void;
    filter: string | null;
    sort: string | null;
    search: string | null;
    setFilter: React.Dispatch<React.SetStateAction<string | null>>;
    setSort: React.Dispatch<React.SetStateAction<string | null>>;
    setSearch: React.Dispatch<React.SetStateAction<string | null>>;
    onTaskMove: (taskId: number, updatedStatus: string) => void;
}

export const Board: React.FC<BoardProps> = ({
                                                columns,
                                                onUpdateTasks,
                                                filter,
                                                sort,
                                                search,
                                                setFilter,
                                                setSort,
                                                setSearch,
                                                onTaskMove
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

    const onDragEnd = (result: DropResult) => {
        const {destination, draggableId} = result;
        if (!destination) {
            return;
        }
        const taskId = Number(draggableId);
        const updatedStatus = destination.droppableId;
        onTaskMove(taskId, updatedStatus);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
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
                <Droppable droppableId="board" direction="horizontal" type="column">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="columns-container">
                            {columns.map((column: IColumn, index: number) => (
                                <Column index={index} key={column.key} column={column} onUpdateTasks={onUpdateTasks}/>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
};