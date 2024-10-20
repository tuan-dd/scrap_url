// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { ActionEnum, EntityEnum, METHODS } from '@common/enums';
// import { IS_PUBLIC_KEY } from '@decorators/public.decorator';
// import { Reflector } from '@nestjs/core';
// import { Request } from 'express';
// import { ContextService } from '@providers/context.service';
// import { ScopeEntity } from '@auth/scope/scope.entity';
// import { UserService } from '@user/user.service';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(
//     private readonly userService: UserService,
//     private readonly reflector: Reflector,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     // Check public API
//     const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
//     if (isPublic) return true;

//     let isPassed = false;
//     const request = context.switchToHttp().getRequest() as Request;
//     isPassed = await this.checkUserPermission(request);
//     return isPassed;
//   }

//   async checkUserPermission(request: Request): Promise<boolean> {
//     const { method, route } = request;
//     let action = null;

//     // Get entity based on route path
//     const entity = route?.path.split('/')?.[1];

//     switch (method) {
//       case METHODS.GET: {
//         action = ActionEnum.READ;
//         break;
//       }

//       case METHODS.POST: {
//         // if (SPECIAL_PATHS_FOR_ACTION_READ.includes(route?.path)) {
//         //   action = ActionEnum.READ;
//         // } else {
//         action = route?.path.includes('/restore')
//           ? ActionEnum.RESTORE
//           : ActionEnum.CREATE;
//         // }
//         break;
//       }

//       case METHODS.PUT:
//       case METHODS.PATCH: {
//         action = ActionEnum.UPDATE;
//         break;
//       }

//       case METHODS.DELETE: {
//         action = ActionEnum.DELETE;
//         break;
//       }

//       default:
//         return false;
//     }

//     return await this.checkPermissionByAction(entity, request, action);
//   }

//   async checkPermissionByAction(entity: EntityEnum, request: any, action: ActionEnum) {
//     const { params, query, body } = request;
//     let roleIds = null;
//     if (entity === EntityEnum.USER) {
//       // CASE: Create or Update user
//       if ([ActionEnum.CREATE, ActionEnum.UPDATE].includes(action)) {
//         roleIds = body.roleIds;
//       }

//       // CASE: Get, Delete or Restore user
//       else if (params?.id) {
//         const user = await this.userService.findOne({
//           where: { id: params.id },
//           relations: { role: true },
//         });
//       }

//       // CASE: Get user by query
//       else {
//         roleIds = query.roleIds || [];
//       }
//     }
//     const scopes = this.getScopesFromRequest();
//     return this.checkRolePermission(entity, action, roleIds, scopes);
//   }

//   getScopesFromRequest(): ScopeEntity[] {
//     const scopes = ContextService.getScopePermissions();
//     return scopes;
//   }

//   checkRolePermission(
//     entity: EntityEnum,
//     action: ActionEnum,
//     roleIds: number[] | null,
//     authScopes: ScopeEntity[],
//   ): boolean {
//     // Check permission based on entity & action
//     const isValidScopeBasedOnEntity = authScopes?.some(
//       (scope) => scope.entity === entity && scope.action === action,
//     );

//     // CASE: entity === EntityEnum.USERS
//     // if (roleIds) {
//     //   const isValidScopeBasedRoles = roleIds.every((roleId) =>
//     //     authScopes.some(
//     //       (scope) => scope.roleId === +roleId && scope.entity === entity && scope.action === action,
//     //     ),
//     //   );

//     //   return isValidScopeBasedOnEntity && isValidScopeBasedRoles;
//     // }

//     return isValidScopeBasedOnEntity;
//   }
// }
