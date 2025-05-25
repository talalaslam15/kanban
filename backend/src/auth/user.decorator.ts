import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IGetUserAuthInfoRequest extends Request {
  user: {
    userId: string;
    email?: string;
  };
}

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IGetUserAuthInfoRequest>();
    return request.user;
  },
);
