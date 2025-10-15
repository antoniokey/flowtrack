import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Finance } from './entities/finance.entity';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Finance)
    private readonly financeRepository: Repository<Finance>,
  ) {}

  async getFinance(): Promise<Finance[]> {
    return this.financeRepository.find();
  }
}
