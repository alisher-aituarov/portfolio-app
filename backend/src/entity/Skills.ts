const { Entity, PrimaryGeneratedColumn, Column } = require("typeorm");

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description_ru: string;

  @Column()
  description_en: string;

  @Column()
  description_de: string;

  @Column()
  level: number;
}
