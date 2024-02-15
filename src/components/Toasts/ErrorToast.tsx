import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

interface ErrorToastProps {
    show: boolean;
    onClose: () => void;
    message: string;
}

const ErrorToast: React.FC<ErrorToastProps> = ({show, onClose, message}) => {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        setIsVisible(show);
        if (show) {
            const timeoutId = setTimeout(() => {
                setIsVisible(false);
                onClose();
            }, 5000);
            return () => clearTimeout(timeoutId);
        }
    }, [show, onClose, 5000]);

    return (
        <ToastContainer position="top-end"
                        className="position-fixed"
                        style={{zIndex: 1}}>
            <Toast show={isVisible} onClose={onClose} bg="Secondary" className="error-toast">
                <Toast.Header closeButton={true}>
                    <strong className="me-auto">Error</strong>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </ToastContainer>

    );
};

export default ErrorToast;