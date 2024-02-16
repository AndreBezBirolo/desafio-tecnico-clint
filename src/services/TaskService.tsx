import axios from "axios";
import { ITask, ITaskBase } from "../interfaces/interfaces";

const TaskService = {
    fetch: async (filter: string | null, search: string | null, sort: string | null) => {
        try {
            const response = await axios.get<ITask[]>(`${process.env.REACT_APP_BACKEND_URL}/tasks`, {
                params: {
                    filter,
                    search,
                    sort,
                },
            });
            return response.data;
        } catch (error: any) {
            throw error.response.data.error;
        }
    },

    create: async (taskData: ITaskBase) => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks`, taskData);
        } catch (error: any) {
            throw error.response.data.error;
        }
    },

    editStatus: async (taskId: number, updatedStatus: string) => {
        try {
            await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/tasks/${taskId}`, {
                status: updatedStatus
            });
        } catch (error: any) {
            throw error.response.data.error;
        }
    },

    delete: async (taskId: number, onDelete: () => void) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/tasks/${taskId}`);
            onDelete();
        } catch (error: any) {
            throw error.response.data.error;
        }
    }
};

export default TaskService;