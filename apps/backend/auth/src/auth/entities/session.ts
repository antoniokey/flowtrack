import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  refreshToken: string;

  @Column()
  ip: string;

  @CreateDateColumn()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
