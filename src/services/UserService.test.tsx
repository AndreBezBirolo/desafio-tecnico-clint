import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import UserService from "./UserService";
import { jest } from "@jest/globals";

const mockAxios = new MockAdapter(axios);
jest.useFakeTimers();
describe("UserService", () => {
    afterEach(() => {
        mockAxios.reset();
        localStorage.clear();
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it("login - deve fazer login do usuário corretamente", async () => {
        const mockSuccessResponse = {token: "mockToken"};
        mockAxios.onPost(`${process.env.REACT_APP_BACKEND_URL}/user/login`).reply(200, mockSuccessResponse);

        const token = await UserService.login("mockUsername", "mockPassword");
        expect(token).toEqual(mockSuccessResponse.token);

        expect(localStorage.getItem("jwtToken")).toEqual(mockSuccessResponse.token);
    });

    it("login - deve lançar um erro ao fazer login com credenciais inválidas", async () => {
        const mockErrorResponse = {error: "Invalid credentials"};
        mockAxios.onPost(`${process.env.REACT_APP_BACKEND_URL}/user/login`).reply(400, mockErrorResponse);

        await expect(UserService.login("invalidUsername", "invalidPassword")).rejects.toEqual("Invalid credentials");

        expect(localStorage.getItem("jwtToken")).toBeNull();
    });

    it("login - deve lançar um erro ao fazer login devido a problemas no backend", async () => {
        const mockErrorResponse = {error: "Backend error"};
        mockAxios.onPost(`${process.env.REACT_APP_BACKEND_URL}/user/login`).reply(500, mockErrorResponse);

        await expect(UserService.login("mockUsername", "mockPassword")).rejects.toEqual("Backend error");

        expect(localStorage.getItem("jwtToken")).toBeNull();
    });

    it("login - deve lançar um erro ao fazer login devido a falta de resposta do backend", async () => {
        mockAxios.onPost(`${process.env.REACT_APP_BACKEND_URL}/user/login`).timeout();

        await expect(UserService.login("mockUsername", "mockPassword")).rejects.toThrowError();

        expect(localStorage.getItem("jwtToken")).toBeNull();
    });

    it("login - deve lançar um erro ao fazer login devido a problemas de rede", async () => {
        mockAxios.onPost(`${process.env.REACT_APP_BACKEND_URL}/user/login`).networkError();

        await expect(UserService.login("mockUsername", "mockPassword")).rejects.toThrowError();

        expect(localStorage.getItem("jwtToken")).toBeNull();
    });

    it("register - deve fazer registro de usuário corretamente", async () => {
        const mockResponse = {token: "mockToken"};
        mockAxios
            .onPost(`${process.env.REACT_APP_BACKEND_URL}/user/register`)
            .reply(200, mockResponse);

        const token = await UserService.register("mockUsername", "mockPassword");
        expect(token).toEqual(mockResponse.token);
        expect(localStorage.getItem("jwtToken")).toEqual(mockResponse.token);
    });

    it("register - deve lançar um erro ao tentar registrar com um nome de usuário já existente", async () => {
        const mockErrorResponse = {error: "Username already exists"};
        mockAxios.onPost(`${process.env.REACT_APP_BACKEND_URL}/user/register`).reply(400, mockErrorResponse);

        await expect(UserService.register("existingUsername", "mockPassword")).rejects.toEqual("Username already exists");

        expect(localStorage.getItem("jwtToken")).toBeNull();
    });

    it("register - deve lançar um erro ao tentar registrar devido a problemas no backend", async () => {
        const mockErrorResponse = {error: "Backend error"};
        mockAxios.onPost(`${process.env.REACT_APP_BACKEND_URL}/user/register`).reply(500, mockErrorResponse);

        await expect(UserService.register("mockUsername", "mockPassword")).rejects.toEqual("Backend error");

        expect(localStorage.getItem("jwtToken")).toBeNull();
    });

    it("register - deve lançar um erro ao tentar registrar devido a falta de resposta do backend", async () => {
        mockAxios.onPost(`${process.env.REACT_APP_BACKEND_URL}/user/register`).timeout();

        await expect(UserService.register("mockUsername", "mockPassword")).rejects.toThrowError();

        expect(localStorage.getItem("jwtToken")).toBeNull();
    });

    it("register - deve lançar um erro ao tentar registrar devido a problemas de rede", async () => {
        mockAxios.onPost(`${process.env.REACT_APP_BACKEND_URL}/user/register`).networkError();

        await expect(UserService.register("mockUsername", "mockPassword")).rejects.toThrowError();

        expect(localStorage.getItem("jwtToken")).toBeNull();
    });

    it("logout - deve fazer logout corretamente", () => {
        localStorage.setItem("jwtToken", "mockToken");

        UserService.logout();

        expect(localStorage.getItem("jwtToken")).toBeNull();
    });

    it("getToken - deve retornar o token corretamente", () => {
        localStorage.setItem("jwtToken", "mockToken");

        const token = UserService.getToken();

        expect(token).toEqual("mockToken");
    });

    it("setToken - deve definir o token corretamente", () => {
        UserService.setToken("mockToken");

        expect(localStorage.getItem("jwtToken")).toEqual("mockToken");
    });
});
