export interface ITask extends ITaskBase {
    id: number;
}

export interface ITaskBase {
    name: string;
    status: string;
    due_date: Date;
}

export interface IColumn {
    key: string;
    title: string;
    tasks: ITask[];
}
