import React, { useState } from 'react';
import { Button, Form } from "react-bootstrap";
import UserService from "../../services/UserService";

interface LoginFormProps {
    onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleShowError = (message: string) => {
        setErrorMessage(message);
        setShowError(true);
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    const loginUser = async (): Promise<void> => {
        try {
            await UserService.login(username, password)
                .then(() => {
                    onLogin();
                })
        } catch (error) {
            handleShowError('An error occurred while sending data to the server.');
        }
    }

    const registerUser = async (): Promise<void> => {
        /* TODO: Fazer com que no registro ele se logue após registrar */
        try {
            await UserService.register(username, password)
                .then(async () => {
                    console.log('oi')
                })
        } catch (error) {
            handleShowError('An error occurred while sending data to the server.');
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await loginUser();
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername">
                <Form.Control type="text" placeholder="Username" value={username}
                              onChange={(e) => setUsername(e.target.value)}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Control type="password" placeholder="Password" value={password}
                              onChange={(e) => setPassword(e.target.value)}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Login
            </Button>
        </Form>
    );
};

export default LoginForm;