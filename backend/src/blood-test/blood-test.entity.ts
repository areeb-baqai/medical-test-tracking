import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../auth/auth.entity';

@Entity()
export class BloodTest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  testType: string;

  @Column('float')
  testValue: number;

  @Column({ type: 'date' })
  testDate: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
