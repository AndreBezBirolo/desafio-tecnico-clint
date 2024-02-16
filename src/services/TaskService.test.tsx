import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { jest } from "@jest/globals";
import TaskService from "./TaskService";

const mockAxios = new MockAdapter(axios);

describe('TaskService', () => {
    afterEach(() => {
        mockAxios.reset();
        jest.clearAllMocks();
        localStorage.clear();
    });

    it("fetch - deve retornar todos os dados corretamente", async () => {
        const mockResponse = [{id: 1, name: 'Task 1', status: 'todo', due_date: 1708041600000, user_id: 1}];
        mockAxios.onGet(`${process.env.REACT_APP_BACKEND_URL}/tasks`).reply(200, mockResponse);

        const tasks = await TaskService.fetch(null, null, null);
        expect(tasks).toEqual(mockResponse);
    })

    it('fetch - deve retornar uma lista vazia', async () => {
        mockAxios.onGet(`${process.env.REACT_APP_BACKEND_URL}/tasks`).reply(200, []);

        const tasks = await TaskService.fetch(null, null, null);
        expect(tasks).toEqual([]);
    });

    it('fetch - deve lançar um erro solicitação', async () => {
        mockAxios.onGet(`${process.env.REACT_APP_BACKEND_URL}/tasks`).reply(500);

        await expect(TaskService.fetch(null, null, null)).rejects.toThrow();
    });

    it('post - deve retornar solicitação bem-sucedida', async () => {
        const date = new Date();
        const mockTask = {id: 1, name: 'Task 1', status: 'todo', due_date: date, user_id: 1};
        mockAxios.onPost(`${process.env.REACT_APP_BACKEND_URL}/tasks`).reply(201, mockTask);

        await TaskService.create({name: 'Task 1', status: 'todo', due_date: date});

        expect(mockAxios.history.post.length).toBe(1);
        expect(mockAxios.history.post[0].data).toEqual(JSON.stringify({
            name: 'Task 1',
            status: 'todo',
            due_date: date
        }));
    });

    it('post - deve lançar uma falha na solicitação', async () => {
        mockAxios.onPost(`${process.env.REACT_APP_BACKEND_URL}/tasks`).reply(500);

        await expect(TaskService.create({name: 'Task 1', status: 'todo', due_date: new Date()})).rejects.toThrow();
    });

    it('patch - deve fazer uma requisição PATCH com sucesso', async () => {
        const taskId = 1;
        const updatedStatus = 'doing';
        mockAxios.onPatch(`${process.env.REACT_APP_BACKEND_URL}/tasks/${taskId}`).reply(204);

        await expect(TaskService.editStatus(taskId, updatedStatus)).resolves.not.toThrow();

        expect(mockAxios.history.patch.length).toBe(1);
    });

    it('patch - deve lançar um erro em caso de falha na requisição PATCH', async () => {
        const taskId = 1;
        const updatedStatus = 'doing';
        const mockErrorResponse = {error: "validação"};
        mockAxios.onPatch(`${process.env.REACT_APP_BACKEND_URL}/tasks/${taskId}`).reply(400, mockErrorResponse);

        await expect(TaskService.editStatus(taskId, updatedStatus)).rejects.toEqual("validação");
    });

    it('delete - deve fazer uma requisição DELETE com sucesso', async () => {
        const taskId = 1;
        const onDeleteMock = jest.fn();

        mockAxios.onDelete(`${process.env.REACT_APP_BACKEND_URL}/tasks/${taskId}`).reply(204);

        await expect(TaskService.delete(taskId, onDeleteMock)).resolves.not.toThrow();

        expect(onDeleteMock).toHaveBeenCalledTimes(1);
    });

    it('delete - deve lançar um erro ao fazer uma requisição DELETE sem sucesso', async () => {
        const taskId = 1;
        const onDeleteMock = jest.fn();

        const errorMessage = 'Erro ao deletar a tarefa';
        mockAxios.onDelete(`${process.env.REACT_APP_BACKEND_URL}/tasks/${taskId}`).reply(400, {error: errorMessage});

        await expect(TaskService.delete(taskId, onDeleteMock)).rejects.toEqual(errorMessage);

        expect(onDeleteMock).not.toHaveBeenCalled();
    });
});
