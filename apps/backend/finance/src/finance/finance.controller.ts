import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { Finance } from './entities/finance.entity';
import { FinanceService } from './finance.service';

@Controller()
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @MessagePattern('getFinance')
  getFinance(): Promise<Finance[]> {
    return this.financeService.getFinance();
  }
}
