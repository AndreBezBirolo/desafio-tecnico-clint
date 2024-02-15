import { IColumn } from "../../interfaces/interfaces";
import React, { useCallback, useEffect, useState } from "react";
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
    const [updatedColumns, setUpdatedColumns] = useState<IColumn[]>(columns);
    const [isFirstChange, setIsFirstChange] = useState<boolean>(true);

    useEffect(() => {
        setUpdatedColumns(columns);
    }, [columns]);

    const delayedHandleSearchChange = debounce((value: string) => {
        setSearch(value);
    }, 300);

    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        delayedHandleSearchChange(event.target.value);
    }, [delayedHandleSearchChange]);

    const handleFilterChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value);
    }, [setFilter]);


    const handleSortChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(event.target.value);
    }, [setSort]);

    const onDragEnd = async (result: DropResult) => {
        let actualColumns = [];
        if (isFirstChange) {
            actualColumns = columns;
        } else {
            actualColumns = updatedColumns;
        }

        const {destination, draggableId, source} = result;
        if (!destination) {
            return;
        }
        const taskId = Number(draggableId);
        const sourceColumnKey = source.droppableId;
        const destinationColumnKey = destination.droppableId;

        const sourceColumnIndex = actualColumns.findIndex(column => column.key === sourceColumnKey);
        if (sourceColumnIndex === -1) {
            console.error('Coluna de origem não encontrada');
            return;
        }
        const sourceColumn = actualColumns[sourceColumnIndex];

        const destinationColumnIndex = actualColumns.findIndex(column => column.key === destinationColumnKey);
        if (destinationColumnIndex === -1) {
            console.error('Coluna de destino não encontrada');
            return;
        }

        const taskIndex = sourceColumn.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            console.error('Tarefa não encontrada na coluna de origem');
            return;
        }
        const task = sourceColumn.tasks[taskIndex];

        onTaskMove(taskId, destinationColumnKey);

        const updatedColumnsCopy = [...actualColumns];
        const updatedSourceTasks = [...updatedColumnsCopy[sourceColumnIndex].tasks];
        updatedSourceTasks.splice(taskIndex, 1);
        updatedColumnsCopy[sourceColumnIndex] = {...updatedColumnsCopy[sourceColumnIndex], tasks: updatedSourceTasks};

        const updatedDestinationTasks = [...updatedColumnsCopy[destinationColumnIndex].tasks];
        updatedDestinationTasks.splice(destination.index, 0, task);
        updatedColumnsCopy[destinationColumnIndex] = {
            ...updatedColumnsCopy[destinationColumnIndex],
            tasks: updatedDestinationTasks
        };

        setUpdatedColumns(updatedColumnsCopy);
        setIsFirstChange(false);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="board">
                <div className="actions-container">
                    <Form.Select onChange={handleFilterChange} defaultValue="">
                        <option value="">Filter by...</option>
                        <option value="todo">To do</option>
                        <option value="doing">Doing</option>
                        <option value="ready">Ready</option>
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
                            {updatedColumns.map((column: IColumn, index: number) => (
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