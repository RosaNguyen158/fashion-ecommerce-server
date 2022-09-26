import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './entities/user.entity';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

/*
How to use
Ex: 
@Get()
async findOne(@GetUser() user: UserEntity) {
  console.log(user);
}

Passing Data
{
  "id": 101,
  "firstName": "Alan",
  "lastName": "Turing",
  "email": "hen@email.com",
  "roles": ["admin"]
}

*/
