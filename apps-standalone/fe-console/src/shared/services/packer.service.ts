import { Packr, Unpackr } from 'msgpackr';

export class Packer {
  readonly packer = new Packr({
    structuredClone: true,
    useRecords: false, // cache key → giảm size 30-50%
    // useFloat32: ,         // nếu bạn dùng Float32Array (game, 3D)
    // bundleStrings: false,  // chỉ bật khi dùng stream
  });

  readonly unpacker = new Unpackr({
    structuredClone: true,
    useRecords: false,
  });
}

export const packr = new Packer();
const $unpack = packr.unpacker.unpack;
const $pack = packr.packer.pack;
export { $unpack, $pack };
