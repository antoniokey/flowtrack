import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

import { Finance } from '@flowtrack/types';
import { FINANCE_MICROSERVICE } from '@flowtrack/constants';

import { Observable } from 'rxjs';

@Injectable()
export class FinanceService {
  constructor(
    @Inject(FINANCE_MICROSERVICE)
    private readonly financeMicroservice: ClientRMQ,
  ) { }

  getFinance(): Observable<Finance[]> {
    return this.financeMicroservice.send('getFinance', { empty: true });
  }
}
