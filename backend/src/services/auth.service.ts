import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(data: Pick<User, 'email' | 'password' | 'name'>) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError('User already exists', 400);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.userRepository.create({
            ...data,
            password: hashedPassword,
        });

        const token = this.generateToken(user.id, user.email);
        return { user, token };
    }

    async login(data: Pick<User, 'email' | 'password'>) {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        const token = this.generateToken(user.id, user.email);
        return { user, token };
    }

    private generateToken(id: string, email: string): string {
        return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '24h' });
    }
}
