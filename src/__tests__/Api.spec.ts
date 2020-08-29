import request from 'supertest';

import { Connection, getConnection } from 'typeorm';
import createConnection from '@shared/infra/typeorm/index';

import app from '@shared/infra/http/app';

let connection: Connection;

// TODO: Mock some requests

describe('App', () => {
  beforeAll(async () => {
    connection = await createConnection('test-connection');

    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM users');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to list all users', async () => {
    await request(app).post('/users').send({
      username: 'johndoe',
      password: '123456',
    });

    await request(app).post('/users').send({
      username: 'johndoe2',
      password: '123456',
    });

    const response = await request(app).get('/users').send();

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ username: 'johndoe' }),
        expect.objectContaining({ username: 'johndoe2' }),
      ])
    );
  });

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      username: 'johndoe',
      password: '123456',
    });

    expect(response.body).toEqual(
      expect.objectContaining({
        username: 'johndoe',
      })
    );
    expect(response.body).toHaveProperty('authorization');
  });

  it('should be able to show a user', async () => {
    const requestUser = await request(app).post('/users').send({
      username: 'johndoe',
      password: '123456',
    });

    const { id, username } = requestUser.body;

    const response = await request(app).get(`/users/${username}`);

    expect(response.body).toEqual(
      expect.objectContaining({
        id,
        username,
      })
    );
  });

  it('should be able to authenticate a user', async () => {
    await request(app).post('/users').send({
      username: 'johndoe',
      password: '123456',
    });

    const response = await request(app).post('/authenticate').send({
      username: 'johndoe',
      password: '123456',
    });

    expect(response.body).toHaveProperty('authorization');
  });
});
