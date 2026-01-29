export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface IToast {
    id: number;
    message: string;
    type: ToastType;
    duration?: number;
}