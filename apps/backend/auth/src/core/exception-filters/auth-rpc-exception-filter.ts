import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class AuthRpcExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException): Observable<any> {
    console.error('Microservice error:', exception.getError());

    return throwError(() => exception);
  }
}
