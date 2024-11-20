const request = require('supertest');
const app = require('../server');
const sequelize = require('../config/db');

let server;
let cookie;

beforeAll(async () => {
  // Ожидаем завершения всех операций с базой данных
  await sequelize.sync(); 
  server = app.listen(0, () => {
    const address = server.address();
    console.log(`Сервер запущен на http://localhost:${address.port}`);
  });
});

afterAll(async () => {
  await sequelize.close();
  await server.close();
});

describe('GET /login', () => {
  it('should return 200', async () => {
    const response = await request(server)
      .get('/login')

    expect(response.statusCode).toBe(200);
  });
});

describe('GET /register', () => {
  it('should return 200', async () => {
    const response = await request(server)
      .get('/register')

    expect(response.statusCode).toBe(200);
  });
});

describe('GET /api/users/getAll', () => {
  it('should return 200', async () => {
    const response = await request(server)
      .get('/api/users/getAll')

    expect(response.statusCode).toBe(200);
  });
});

describe('GET /api/recipe', () => {
  it('should return 302', async () => {
    const response = await request(server)
      .get('/api/recipe')

    expect(response.statusCode).toBe(302);
  });
});

describe('POST /api/users/login', () => {
  it('should set a cookie when valid credentials are provided', async () => {
    const response = await request(server)
      .post('/api/users/login')
      .send({
        username: '123',
        password: '123'
      });

    // Проверяем, что в заголовках ответа присутствует Set-Cookie
    expect(response.headers['set-cookie']).toBeDefined();
    
    // Сохраняем куку для дальнейшего использования
    cookie = response.headers['set-cookie'][0]; // Берем первую куку
  });
});

describe('GET /api/recipe', () => {
  it('should return 200 when the request includes a valid cookie', async () => {
    // Делаем запрос на /api/recipe с кукой, полученной при логине
    const response = await request(server)
      .get('/api/recipe')
      .set('Cookie', cookie); // Добавляем куку в заголовки

    // Проверяем код ответа
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /profile', () => {
  it('should return 200 when the request includes a valid cookie', async () => {
    // Делаем запрос на /api/recipe с кукой, полученной при логине
    const response = await request(server)
      .get('/profile')
      .set('Cookie', cookie); // Добавляем куку в заголовки

    // Проверяем код ответа
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /', () => {
  it('should return 200 when the request includes a valid cookie', async () => {
    // Делаем запрос на /api/recipe с кукой, полученной при логине
    const response = await request(server)
      .get('/')
      .set('Cookie', cookie); // Добавляем куку в заголовки

    // Проверяем код ответа
    expect(response.statusCode).toBe(200);
  });
});

describe('PUT /api/users/:id/makeModerator', () => {
  it('should return 200 and a success message when user is made a moderator', async () => {
    const response = await request(server)
      .put('/api/users/1/makeModerator')
      .set('Cookie', cookie); // Добавляем куку в заголовки

    // Проверяем статус ответа
    expect(response.statusCode).toBe(200);
    
    // Проверяем содержимое ответа
    expect(response.body).toEqual({ message: 'Пользователь теперь модератор' });
  });
});

describe('GET /moderator', () => {
  it('should return 200 when the request includes a valid cookie', async () => {
    // Делаем запрос на /api/recipe с кукой, полученной при логине
    const response = await request(server)
      .get('/moderator')
      .set('Cookie', cookie); // Добавляем куку в заголовки

    // Проверяем код ответа
    expect(response.statusCode).toBe(200);
  });
});

describe('PUT /api/users/:id/makeAdmin', () => {
  it('should return 200 and a success message when user is made a moderator', async () => {
    const response = await request(server)
      .put('/api/users/1/makeAdmin')
      .set('Cookie', cookie); // Добавляем куку в заголовки

    // Проверяем статус ответа
    expect(response.statusCode).toBe(200);
    
    // Проверяем содержимое ответа
    expect(response.body).toEqual({ message: 'Пользователь теперь администратор' });
  });
});

describe('GET /admin', () => {
  it('should return 200 when the request includes a valid cookie', async () => {
    // Делаем запрос на /api/recipe с кукой, полученной при логине
    const response = await request(server)
      .get('/admin')
      .set('Cookie', cookie); // Добавляем куку в заголовки

    // Проверяем код ответа
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /api/recipe', () => {
  it('should successfully create a new recipe', async () => {
    const recipeData = {
      name: "Тирамиссу",
      category: "dessert",
      description: "яхз",
      ingredients: "ну тут чота",
      steps: "перчим солим",
      userId: 1,
    };

    const response = await request(server)
      .post('/api/recipe')
      .set('Cookie', cookie) // Добавляем куку для авторизации
      .send(recipeData);

    // Проверяем, что запрос успешный и данные были отправлены
    expect(response.statusCode).toBe(201);  // Ожидаем статус 201
    expect(response.body).toEqual(expect.objectContaining(recipeData));  // Проверяем, что данные в ответе совпадают
  });
});

describe('DELETE /api/recipe/:id', () => {
  it('should successfully delete a recipe', async () => {
    const response = await request(server)
      .delete('/api/recipe/999')  // Отправляем DELETE запрос на рецепт с ID 999
      .set('Cookie', cookie);
    expect(response.statusCode).toBe(404);
  });
});