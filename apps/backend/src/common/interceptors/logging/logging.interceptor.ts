import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';

interface SafeError {
  message: string;
  status?: number | string;
  name?: string;
  stackPreview?: string;
}

@Injectable()
export class LoggingInterceptor<T> implements NestInterceptor<T, T> {
  private logFilePath = path.join(process.cwd(), 'logs/api.log');

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest<Request>();
    const { method, url, body } = req;

    this.appendLog(
      `➡ [${new Date().toISOString()}] ${method} ${url}\nRequest Body: ${JSON.stringify(
        body,
      )}\n`,
    );

    return next.handle().pipe(
      tap((response: T) => {
        this.appendLog(
          `⬅ [${new Date().toISOString()}] SUCCESS ${method} ${url} | ${
            Date.now() - now
          }ms\nResponse: ${JSON.stringify(response)}\n\n`,
        );
      }),
      catchError((error: unknown) => {
        const safeError = this.sanitizeError(error);
        this.appendLog(
          `❌ [${new Date().toISOString()}] ERROR ${method} ${url} | ${
            Date.now() - now
          }ms\n${JSON.stringify(safeError, null, 2)}\n\n`,
        );
        return throwError(() => error);
      }),
    );
  }

  private sanitizeError(error: unknown): SafeError {
    const safeError: SafeError = {
      message: 'Unknown error',
    };

    if (error instanceof Error) {
      safeError.message = error.message;
      safeError.name = error.name;
      if ('status' in error && typeof (error as any).status !== 'undefined') {
        safeError.status = (error as any).status;
      }
      if (error.stack) {
        safeError.stackPreview = error.stack.split('\n').slice(0, 2).join('\n');
      }
    } else if (typeof error === 'object' && error !== null) {
      // handle structured error (like HttpException)
      const e = error as Record<string, unknown>;
      safeError.message =
        typeof e['message'] === 'string'
          ? e['message']
          : 'Unknown error object';
      if (typeof e['status'] === 'number' || typeof e['status'] === 'string') {
        safeError.status = e['status'];
      }
      if (typeof e['name'] === 'string') {
        safeError.name = e['name'];
      }
    }

    return safeError;
  }

  private appendLog(log: string) {
    fs.mkdirSync(path.dirname(this.logFilePath), { recursive: true });
    fs.appendFileSync(this.logFilePath, log, { encoding: 'utf8' });
  }
}
