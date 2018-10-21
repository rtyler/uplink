import { TypesService } from '../src/services/types';

describe('Unit tests for /types', () => {
  describe('find', () => {
    let service = new TypesService();

    it('should return an Array', async () => {
      const result = await service.find();
      console.log(result);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
