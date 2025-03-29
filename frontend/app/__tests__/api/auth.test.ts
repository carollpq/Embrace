import request from 'supertest';
import app from '@/app'; // Adjust the import based on your Next.js API structure

describe('Auth API Tests', () => {
    test('Should sign up a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({ email: 'test@example.com', password: 'StrongPass123' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('user');
    });

    test('Should not allow duplicate email signup', async () => {
        await request(app).post('/api/auth/signup').send({ email: 'test@example.com', password: 'StrongPass123' });
        const res = await request(app).post('/api/auth/signup').send({ email: 'test@example.com', password: 'AnotherPass' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Email already in use');
    });

    test('Should login an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/signin')
            .send({ email: 'test@example.com', password: 'StrongPass123' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('Should reject incorrect password', async () => {
        const res = await request(app)
            .post('/api/auth/signin')
            .send({ email: 'test@example.com', password: 'WrongPass' });
        expect(res.status).toBe(401);
    });
});