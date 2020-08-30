import request from 'supertest';

import { Connection, getConnection } from 'typeorm';
import createConnection from '@shared/infra/typeorm/index';

import app from '@shared/infra/http/app';

let connection: Connection;

// TODO: Refactor or Mock some requests

describe('App', () => {
  beforeAll(async () => {
    connection = await createConnection('test-connection');

    await connection.query('DROP TABLE IF EXISTS room_users');
    await connection.query('DROP TABLE IF EXISTS rooms');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM room_users');
    await connection.query('DELETE FROM rooms');
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

  it('should be able to update a user', async () => {
    const requestUser = await request(app).post('/users').send({
      username: 'johndoe',
      password: '123456',
    });

    const { authorization } = requestUser.body;

    const response = await request(app)
      .put('/users')
      .set('Authorization', `bearer ${authorization}`)
      .send({
        mobile_token: 'updated-token',
      });

    expect(response.body).toEqual(
      expect.objectContaining({
        mobile_token: 'updated-token',
      })
    );
  });

  it('should be able to delete a user', async () => {
    const requestUser = await request(app).post('/users').send({
      username: 'johndoe',
      password: '123456',
    });

    const { authorization } = requestUser.body;

    const response = await request(app)
      .delete('/users')
      .set('Authorization', `bearer ${authorization}`)
      .send();

    expect(response.status).toEqual(204);
  });

  it('should be able to create a room', async () => {
    const responseUser = await request(app).post('/users').send({
      username: 'johndoe',
      password: '123456',
    });

    const { authorization } = responseUser.body;

    const response = await request(app)
      .post('/rooms')
      .set('Authorization', `bearer ${authorization}`)
      .send({
        name: 'johndoe room',
        capacity: 10,
      });

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'johndoe room',
      })
    );
    expect(response.body).toHaveProperty('host.id');
  });

  it('should be able to show a room', async () => {
    const {
      body: { authorization },
    } = await request(app).post('/users').send({
      username: 'johndoe',
      password: '123456',
    });

    const {
      body: { id, capacity },
    } = await request(app)
      .post('/rooms')
      .set('Authorization', `bearer ${authorization}`)
      .send({
        name: 'johndoe room',
        capacity: 10,
      });

    const response = await request(app).get(`/rooms/${id}`);

    expect(response.body).toEqual(
      expect.objectContaining({
        id,
        capacity,
      })
    );
  });

  it('should be able to joins a room', async () => {
    const {
      body: { username, authorization },
    } = await request(app).post('/users').send({
      username: 'johndoe',
      password: '123456',
    });

    const {
      body: { id },
    } = await request(app)
      .post('/rooms')
      .set('Authorization', `bearer ${authorization}`)
      .send({
        name: 'johndoe room',
        capacity: 10,
      });

    const response = await request(app)
      .post(`/rooms/${id}/join`)
      .set('Authorization', `bearer ${authorization}`)
      .send();

    expect(response.body.participants).toEqual(
      expect.arrayContaining([expect.objectContaining({ username })])
    );
  });

  it('should be able to leaves a room', async () => {
    const {
      body: { authorization },
    } = await request(app).post('/users').send({
      username: 'johndoe',
      password: '123456',
    });

    const {
      body: { id },
    } = await request(app)
      .post('/rooms')
      .set('Authorization', `bearer ${authorization}`)
      .send({
        name: 'johndoe room',
        capacity: 10,
      });

    await request(app)
      .post(`/rooms/${id}/join`)
      .set('Authorization', `bearer ${authorization}`)
      .send();

    const response = await request(app)
      .post(`/rooms/${id}/leave`)
      .set('Authorization', `bearer ${authorization}`)
      .send();

    expect(response.status).toEqual(204);
  });
});
