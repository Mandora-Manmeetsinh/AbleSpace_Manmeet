import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = registerSchema.parse(req.body);
            const { user, token } = await this.authService.register(data);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax', // or 'none' if cross-site
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });

            res.status(201).json({ user: { id: user.id, email: user.email, name: user.name } });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = loginSchema.parse(req.body);
            const { user, token } = await this.authService.login(data);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.json({ user: { id: user.id, email: user.email, name: user.name } });
        } catch (error) {
            next(error);
        }
    };

    logout = async (req: Request, res: Response) => {
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    };

    me = async (req: Request, res: Response) => {
        // @ts-ignore
        const user = req.user;
        res.json({ user });
    }
}
