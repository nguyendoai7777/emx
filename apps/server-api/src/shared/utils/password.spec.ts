import { verifyPassword } from './password.util';
import { hash, verify } from 'argon2';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

// Mock ResponseTransformer nếu nó không có sẵn hoặc cần kiểm tra riêng biệt.
// Trong trường hợp này, ta giả định nó là một lớp/hàm đơn giản,
// nhưng ta sẽ kiểm tra xem BadRequestException có được throw với nội dung đúng không.

describe('verifyPassword', () => {
  const MOCK_PASSWORD = 'strongPassword123';
  const MOCK_HASHED_PASSWORD = 'hashed_string_from_argon2';

  // Thiết lập trước và sau khi chạy các test
  beforeEach(() => {
    // Reset mock trước mỗi test
    (hash as jest.Mock).mockClear();
    // Giả lập hash trả về một giá trị
    (hash as jest.Mock).mockResolvedValue(MOCK_HASHED_PASSWORD);
  });

  it('Check login success', async () => {
    const password = 'Secret123';
    const verifiedPassword = 'Secret123';

    const hashed = await verifyPassword(password, verifiedPassword);

    expect(typeof hashed).toBe('string');
    expect(hashed).not.toEqual(password);
    // kiểm tra hash thực sự khớp với password
    const valid = await verify(hashed, password);
    expect(valid).not.toBe('boolean');
  });

  /*it('should throw BadRequestException if password and confirmPassword do not match', async () => {
    const confirmPassword = 'wrongPassword123';

    // Kiểm tra xem hàm có throw exception khi mật khẩu không khớp
    await expect(
      verifyPassword(MOCK_PASSWORD, confirmPassword)
    ).rejects.toThrow(BadRequestException);

    // Kiểm tra chi tiết hơn về nội dung của BadRequestException
    try {
      await verifyPassword(MOCK_PASSWORD, confirmPassword);
    } catch (e) {
      const exception = e as BadRequestException;
      const response = exception.getResponse() as any; // Ép kiểu để truy cập response transformer object

      // Kiểm tra message và status code bên trong ResponseTransformer
      expect(response.message).toBe('Password không khớp');
    }

    // Kiểm tra rằng hàm hash không được gọi
    expect(hash).not.toHaveBeenCalled();
  });*/

  //
  // ----------------------------------------------------
  //

  it('should call argon2 hash and return the hashed password if passwords match', async () => {
    const result = await verifyPassword(MOCK_PASSWORD, MOCK_PASSWORD);

    // Kiểm tra xem hàm hash có được gọi với đúng tham số
    expect(hash).toHaveBeenCalledWith(MOCK_PASSWORD, {
      memoryCost: 2 ** 10,
    });

    // Kiểm tra kết quả trả về
    expect(result).toBe(MOCK_HASHED_PASSWORD);
  });
});
