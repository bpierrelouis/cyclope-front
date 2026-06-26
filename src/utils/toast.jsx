import toast from 'react-hot-toast';
import { Toast } from '../components';

const openToast = (message, type) =>
    toast.custom((t) => (
        <Toast t={t} message={message} type={type} />
    ));

export const openInfoToast = (message) =>
    openToast(message, 'alert-info');

export const openSuccessToast = (message) =>
    openToast(message, 'alert-success');

export const openWarningToast = (message) =>
    openToast(message, 'alert-warning');

export const openErrorToast = (message) =>
    openToast(message, 'alert-error');
