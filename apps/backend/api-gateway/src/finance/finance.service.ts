import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

import { Finance } from '@flowtrack/types';

import { Observable } from 'rxjs';

import { FINANCE_MICROSERVICE } from '../core/constants/microservices';

@Injectable()
export class FinanceService {
  constructor(
    @Inject(FINANCE_MICROSERVICE)
    private readonly financeMicroservice: ClientRMQ,
  ) {}

  getFinance(): Observable<Finance[]> {
    return this.financeMicroservice.send('getFinance', { empty: true });
  }
}
