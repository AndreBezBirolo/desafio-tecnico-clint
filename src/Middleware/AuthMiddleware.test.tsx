import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import UserService from "../services/UserService";
import { setupJWT } from "./AuthMiddleware";

describe('Middleware', () => {
    let mockAxios: MockAdapter;

    beforeAll(() => {
        mockAxios = new MockAdapter(axios);
        setupJWT();
    });

    afterEach(() => {
        mockAxios.reset();
    });

    it('deve adicionar o token de autorização aos cabeçalhos da solicitação quando um token está presente', async () => {
        const token = 'mockToken';

        jest.spyOn(UserService, 'getToken').mockReturnValue(token);

        mockAxios.onAny().reply(config => {
            expect(config.headers?.Authorization).toEqual(`Bearer ${token}`);
            return [200];
        });

        await axios.get('/test');
    });

    it('não deve adicionar o token de autorização aos cabeçalhos da solicitação quando nenhum token está presente', async () => {
        jest.spyOn(UserService, 'getToken').mockReturnValue(null);

        mockAxios.onAny().reply(config => {
            expect(config.headers?.Authorization).toBeUndefined();
            return [200];
        });

        await axios.get('/test');
    });
});
