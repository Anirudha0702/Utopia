import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD');

    this.client = new Redis({
      host,
      port,
      password,
    });
  }

  /** Basic set with optional TTL */
  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  /** Basic get */
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  /** Push to a list */
  async lpush(key: string, value: string, ttlSeconds?: number) {
    await this.client
      .multi()
      .lpush(key, value)
      .expire(key, ttlSeconds ?? 3600)
      .exec();
  }

  /** Get range from list */
  async lrange(key: string, start = 0, end = -1): Promise<string[]> {
    return await this.client.lrange(key, start, end);
  }

  /** Remove a key */
  async del(key: string) {
    await this.client.del(key);
  }

  /** Check if key exists */
  async exists(key: string): Promise<boolean> {
    const res = await this.client.exists(key);
    return res === 1;
  }
  async ltrim(key: string, maxLength = 100) {
    // Keeps only the newest `maxLength` elements
    await this.client.ltrim(key, 0, maxLength - 1);
  }
}
