import client from './client';
import type { LoginDto, RegisterDto, User } from '../types';

export const login = async (data: LoginDto): Promise<User> => {
    const response = await client.post<{ user: User }>('/auth/login', data);
    return response.data.user;
};

export const register = async (data: RegisterDto): Promise<User> => {
    const response = await client.post<{ user: User }>('/auth/register', data);
    return response.data.user;
};

export const logout = async (): Promise<void> => {
    await client.post('/auth/logout');
};

export const getMe = async (): Promise<User> => {
    const response = await client.get<{ user: User }>('/auth/me');
    return response.data.user;
};
