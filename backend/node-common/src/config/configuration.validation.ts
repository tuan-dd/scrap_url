import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { Environment } from '~/enums';

export class ServerCachingConfig {
  @IsNumber()
  MAX: number;
  @IsNumber()
  TTL: number;
  @IsNumber()
  MAX_SIZE: number;
}

export abstract class EnvironmentVariablesBase {
  @IsString()
  TZ: string;

  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  SERVER_NAME: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  PUBSUB_EXAMPLE_SUBSCRIPTION: string;

  @IsString()
  PUBSUB_EXAMPLE_TOPIC: string;

  @IsString()
  @IsOptional()
  CHAT_SPACE: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o?.CHAT_SPACE !== undefined && o?.CHAT_SPACE !== '')
  CHAT_KEY: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o?.CHAT_SPACE !== undefined && o?.CHAT_SPACE !== '')
  CHAT_TOKEN: string;

  @IsNumber()
  @IsOptional()
  CACHE_MAX = 1000;

  @IsNumber()
  @IsOptional()
  CACHE_TTL = 1000;

  @IsNumber()
  @IsOptional()
  CACHE_MAX_SIZE = 1000;

  @IsEnum(['error', 'warn', 'info', 'debug', 'verbose', 'silly'])
  @IsOptional()
  LOG_LEVEL = 'info';
}
