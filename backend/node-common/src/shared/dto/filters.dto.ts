import { Transform  } from 'class-transformer';
import { IsInt, IsObject, IsOptional } from 'class-validator';

export class BaseFilters {
  @IsInt()
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => (Number(value) > 100 ? Number(value) : 100))
  limit?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  @IsOptional()
  @IsObject()
  searches?: Record<string, string>;

  @IsOptional()
  @IsObject()
  filters?: Record<string, string>;

  @IsOptional()
  @IsObject()
  sorts?: Record<string, 'asc' | 'desc'>;
}
