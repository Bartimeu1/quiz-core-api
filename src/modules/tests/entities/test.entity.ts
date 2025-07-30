import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Question } from '../../questions/entities/question.entity';

@Entity()
export class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Question, (question) => question.test)
  questions: Question[];
}
