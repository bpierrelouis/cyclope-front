import toast from 'react-hot-toast';

import { Toast } from '../components';

const openToast = (message, type, options) =>
    toast.custom((t) => (
        <Toast t={t} message={message} type={type} />
    ), options);

export const openInfoToast = (message, options) =>
    openToast(message, 'alert-info', options);

export const openSuccessToast = (message, options) =>
    openToast(message, 'alert-success', options);

export const openWarningToast = (message, options) =>
    openToast(message, 'alert-warning', options);

export const openErrorToast = (message, options) =>
    openToast(message, 'alert-error', options);

export const dismissToast = (id) => toast.dismiss(id);
