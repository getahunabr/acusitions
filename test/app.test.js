import app from '#src/app.js';
import request from 'supertest';
describe('Api Endpoints ', () => {
  describe('GET/health', () => {
    it('should return health status.', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });
  describe('GET/api', () => {
    it('should return Api Message.', async () => {
      const response = await request(app).get('/api').expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Acqusitions Api is Running.'
      );
    });
  });
  describe('GET/nonexistent', () => {
    it('should return 404 for non existant routes.', async () => {
      const response = await request(app).get('/nonexsitant').expect(404);

      expect(response.body).toHaveProperty('error', 'Route not Found.');
    });
  });
});
