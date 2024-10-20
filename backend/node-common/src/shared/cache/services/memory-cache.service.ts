import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class MemoryCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly caching: Cache) {}

  async setNumber(key: string, value: number, ttl: number = 10 /*milliseconds*/) {
    return this.caching.set(key, value, ttl);
  }
  async setString(key: string, value: string, ttl: number = 10 /*milliseconds*/) {
    return this.caching.set(key, value, ttl);
  }

  async setArray<T>(key: string, value: T[], ttl: number = 10 /*milliseconds*/) {
    return this.caching.set(key, value, ttl);
  }

  async setObject<T>(key: string, value: T, ttl: number = 10 /*milliseconds*/) {
    return this.caching.set(key, value, ttl);
  }

  async subtractNumber(key: string, unit: number) {
    const value = await this.caching.get<number>(key);
    if (typeof value !== 'number') throw new Error('value not found');
    return this.caching.set(key, value - unit);
  }
  async plusNumber(key: string, unit: number) {
    const value = await this.caching.get<number>(key);
    if (typeof value !== 'number') throw new Error('value not found');
    return this.caching.set(key, value + unit);
  }

  async delete(key: string) {
    return this.caching.del(key);
  }
}
