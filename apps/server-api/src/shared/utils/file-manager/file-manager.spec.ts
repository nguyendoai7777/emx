import { readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { deleteFileStartsWith } from './file-manager.util';

jest.mock('node:fs', () => ({
  readdir: jest.fn(),
  unlink: jest.fn(),
  readdirSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

describe('FileManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete files starting with prefix inside user folder', async () => {
    (readdirSync as jest.Mock).mockReturnValue(['avatar_1760807616179.JPG', 'banner_1760807580399.JPG']);

    const mockUnlink = unlinkSync as jest.Mock;

    const deleted = deleteFileStartsWith('avatar', 27);

    expect(mockUnlink).toHaveBeenCalledTimes(1);
    expect(mockUnlink).toHaveBeenCalledWith(
      join(__dirname, '../public', 'profile-img', '27', 'avatar_1760807616179.JPG')
    );

    expect(deleted).toEqual(['avatar_1760807616179.JPG']);
    expect(deleted).not.toContain(['banner_1760807580399.JPG']);
  });

  it('should handle missing folder gracefully', async () => {
    (readdirSync as jest.Mock).mockImplementationOnce(() => {
      const err = new Error('Folder not found') as NodeJS.ErrnoException;
      err.code = 'ENOENT';
      throw err;
    });

    const result = deleteFileStartsWith('avatar', 999);

    expect(result).toEqual([]);
  });

  // real delete

  /*  it('should delete real', async () => {

    const result = deleteFileStartsWith('avatar', 27);
    expect(result).toEqual([]);
  });*/
});
