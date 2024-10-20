import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';
import { EnvironmentVariablesBase } from 'node-common';
import configuration from './configuration';

class EnvironmentVariables extends EnvironmentVariablesBase {
  @IsString()
  @IsNotEmpty()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  ACCESS_TOKEN_TTL: string;

  @IsString()
  @IsNotEmpty()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  REFRESH_TOKEN_TTL: string;

  @IsString()
  @IsNotEmpty()
  TOKEN_VERSION: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const message = errors
      .flatMap(({ constraints }) =>
        Object.keys(constraints).flatMap((key) => constraints[key]),
      )
      .join('\n');
    console.error(`ENV Missing:\n${message}`);
    throw new Error('ENV missing');
  }
  return configuration(validatedConfig);
}
