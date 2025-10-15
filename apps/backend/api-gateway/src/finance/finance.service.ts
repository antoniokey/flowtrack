import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

import { Observable } from 'rxjs';

import { FINANCE_MICROSERVICE } from 'src/core/microservices';
import { Finance } from 'src/types/finance';

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
