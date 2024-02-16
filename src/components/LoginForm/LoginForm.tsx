import React, { useState } from 'react';
import { Button, Form } from "react-bootstrap";
import UserService from "../../services/UserService";
import './LoginForm.css'
import { toast } from 'react-toastify';


interface LoginFormProps {
    onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = async (): Promise<void> => {
        try {
            await UserService.login(username, password)
                .then(() => {
                    onLogin();
                })
        } catch (errorMessage: any) {
            toast.error(errorMessage as string);
        }
    }

    const registerUser = async (): Promise<void> => {
        try {
            await UserService.register(username, password)
                .then(async () => {
                    onLogin();
                })
        } catch (errorMessage: any) {
            toast.error(errorMessage as string);
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await loginUser();
    };

    return (
        <div className="center">
            <div className="form-container">
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

                    <Button variant="link" onClick={registerUser}>
                        Register
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default LoginForm;