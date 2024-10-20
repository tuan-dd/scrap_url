// import { Strategy } from 'passport-local';
// import { PassportStrategy } from '@nestjs/passport';
// import { BadRequestException, Injectable } from '@nestjs/common';
// import { AuthService } from '../auth.service';
// import { validate } from 'class-validator';
// import { UserLoginDto } from '@auth/dto/UserLoginDto';
// import { plainToClass } from 'class-transformer';
// import { ERROR_MSG } from '@common/constants/error-code';
// import { ErrorCode } from '@common/enums';
// import { ContextService } from '@providers/context.service';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService) {
//     super({ usernameField: 'phone' });
//   }

//   async validate(phone: string, password: string): Promise<any> {
//     const objInstance = plainToClass(UserLoginDto, { phone, password });

//     const errors = await validate(objInstance);

//     if (errors.length > 0) {
//       throw new BadRequestException(ERROR_MSG[ErrorCode.INVALID_REQUEST]);
//     }
//     const { id, roleId } = await this.authService.signIn(objInstance);

//     ContextService.setRoleId(roleId);
//     ContextService.setAuthUser(id);
//     return true;
//   }
// }
