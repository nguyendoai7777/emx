import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '@services';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

const mockRequest = (url: string, method: string, authorization?: string) =>
  ({
    url: url,
    method: method,
    headers: {
      authorization: authorization,
    },
  }) as unknown as Request;

// Mock cho ExecutionContext
const mockExecutionContext = (request: Request) =>
  ({
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  }) as unknown as ExecutionContext;
const mockJwtService = {
  verifyAsync: jest.fn(),
};

const mockRedisService = {
  get: jest.fn(),
};
describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let redisService: RedisService;
  beforeEach(async () => {
    // 1. Cấu hình TestingModule để tạo AuthGuard với các service đã được mock
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService, // Sử dụng mock object
        },
        {
          provide: RedisService,
          useValue: mockRedisService, // Sử dụng mock object
        },
      ],
    }).compile();
    guard = module.get(AuthGuard);
    // Lấy instance của mock services để kiểm tra hàm được gọi
    jwtService = module.get(JwtService);
    redisService = module.get(RedisService);

    // Xóa lịch sử gọi mock trước mỗi test
    jest.clearAllMocks();
  });
  it('Defined AuthGuard', () => {
    expect(guard).toBeDefined();
  });

  it(`Should return true for open api route '/api/auth/login'`, async () => {
    const rq = mockRequest('/api/auth/login', 'POST'),
      ctx = mockExecutionContext(rq),
      result = await guard.canActivate(ctx);

    expect(result).toBe(true);
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    expect(redisService.get).not.toHaveBeenCalled();
  });

  it(`Should return true for open api route '/api/streamer'`, async () => {
    const rq = mockRequest('/api/streamer', 'GET'),
      ctx = mockExecutionContext(rq),
      result = await guard.canActivate(ctx);

    expect(result).toBe(true);
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    expect(redisService.get).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if no token is found in the header', async () => {
    const request = mockRequest('/api/user/current', 'GET');
    const context = mockExecutionContext(request);

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if stored token in Redis does not match the request token', async () => {
    // ⚙️ ARRANGE
    const requestToken = 'request.token';
    const userId = 456;
    const userPayload = { id: userId, username: 'revokeduser' };
    const request = mockRequest('/api/user/current', 'GET', `Bearer ${requestToken}`);
    const context = mockExecutionContext(request);

    mockJwtService.verifyAsync.mockResolvedValue(userPayload);

    // 🎯 ASSERT (mong đợi lỗi)
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);

    expect(redisService.get).toHaveBeenCalled();
    expect((request as any)['user']).toBeUndefined();
  });
});
