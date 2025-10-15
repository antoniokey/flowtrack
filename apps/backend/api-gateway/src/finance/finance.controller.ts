import { Controller, Get } from '@nestjs/common';

import { Observable } from 'rxjs';

import { Finance } from 'src/types/finance';

import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get()
  getFinance(): Observable<Finance[]> {
    return this.financeService.getFinance();
  }
}
