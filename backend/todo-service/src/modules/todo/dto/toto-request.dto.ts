import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { StatusTodo } from '@prisma/client';
import { BaseFilters } from 'node-common';

export class SubCreateTaskRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  content?: string;
}

export class DescriptionRequestDto {
  @IsString()
  @MaxLength(2000)
  content: string;
}
export class TotoCreateRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ValidateNested()
  @Type(() => SubCreateTaskRequestDto)
  subTask: SubCreateTaskRequestDto[];

  @ValidateNested()
  @IsString()
  @MaxLength(2000)
  @IsOptional()
  @Type(() => DescriptionRequestDto)
  description?: DescriptionRequestDto;

  @IsNumber({ maxDecimalPlaces: 0 }, { each: true })
  @IsPositive({ each: true })
  assignUserIds?: number[];
}

export class AssignUserRequestDto {
  @IsNumber({ maxDecimalPlaces: 0 }, { each: true })
  @IsPositive({ each: true })
  assignUserIds: number[];
}

export class TotoUpdateRequestDto extends PartialType(
  OmitType(TotoCreateRequestDto, ['subTask', 'assignUserIds'] as const),
) {}

export class TodoStatusUpdateRequestDto {
  @IsEnum(StatusTodo)
  status: StatusTodo;
}

export class SubTaskStatusUpdateRequestDto {
  @IsBoolean()
  isDone: boolean;
}

export class TodoFilter extends BaseFilters {
  @IsEnum(StatusTodo, { each: true })
  @IsOptional()
  status?: StatusTodo[];
}

export class SubtaskDeleteRequestDto {
  @IsNumber({ maxDecimalPlaces: 0 }, { each: true })
  @IsPositive({ each: true })
  subTaskIds: number[];
}
