import { ValidationPipe } from '@nestjs/common';

export const TransformParams = () => new ValidationPipe({ transform: true });
