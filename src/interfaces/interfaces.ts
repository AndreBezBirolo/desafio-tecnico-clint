export interface Task {
    id: number;
    name: string;
    status: string;
    due_date: string;
}

export interface Column {
    key: string,
    title: string,
    tasks: Task[]
}