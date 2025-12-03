import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { MsgPackr } from '@services';

@Injectable()
export class MessagePackPipe implements PipeTransform {
  constructor(private readonly packr: MsgPackr) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log({ metadata, value });
    if (metadata.type === 'body') {
      try {
        return this.packr.unpacker.unpack(value);
      } catch (error) {
        throw new BadRequestException('Invalid MessagePack format');
      }
    }
    return value;
  }
}
