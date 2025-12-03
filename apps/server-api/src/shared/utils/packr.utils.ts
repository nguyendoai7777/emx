import { Packr, Unpackr } from 'msgpackr';

export class MsgPackr {
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

  constructor() {
    console.log(`@@ MsgPackr inited`);
  }
}

export const packr = new MsgPackr();
const $unpack = packr.unpacker.unpack;
const $pack = packr.packer.pack;
export { $unpack, $pack };
