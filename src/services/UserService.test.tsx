import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import UserService from "./UserService";

const mockAxios = new MockAdapter(axios);
describe("UserService", () => {
    afterEach(() => {
        mockAxios.reset();
        localStorage.clear();
    });

    it("deve fazer login do usuário corretamente", async () => {
        const mockSuccessResponse = {token: "mockToken"};
        mockAxios.onPost(`${process.env.REACT_APP_BACKEND_URL}/user/login`).reply(200, mockSuccessResponse);

        const token = await UserService.login("mockUsername", "mockPassword");
        expect(token).toEqual(mockSuccessResponse.token);

        expect(localStorage.getItem("jwtToken")).toEqual(mockSuccessResponse.token);
    });

    it("deve lançar um erro ao fazer login com credenciais inválidas", async () => {
        const mockErrorResponse = {error: "Invalid credentials"};
        mockAxios.onPost(`${process.env.REACT_APP_BACKEND_URL}/user/login`).reply(400, mockErrorResponse);

        await expect(UserService.login("invalidUsername", "invalidPassword")).rejects.toEqual("Invalid credentials");

        expect(localStorage.getItem("jwtToken")).toBeNull();
    });
});
