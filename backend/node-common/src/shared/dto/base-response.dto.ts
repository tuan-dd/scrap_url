export class BaseResponseDto<T> {
  id: T;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;
}
