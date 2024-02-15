export interface ITask {
    id: number;
    name: string;
    status: string;
    due_date: Date;
}

export interface IColumn {
    key: string,
    title: string,
    tasks: ITask[]
}
