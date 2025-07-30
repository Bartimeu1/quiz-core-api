import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Test } from '../../tests/entities/test.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: false })
  multiSelect: boolean;

  @Column('text', { array: true })
  options: string[];

  @Column('text', { array: true })
  correctAnswers: string[];

  @ManyToOne(() => Test, (test) => test.questions, {
    onDelete: 'CASCADE',
  })
  test: Test;
}
