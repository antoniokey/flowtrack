import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Finance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;
}
