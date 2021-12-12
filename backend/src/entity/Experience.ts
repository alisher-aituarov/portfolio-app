import { BeforeInsert } from "typeorm";

const { Entity, PrimaryGeneratedColumn, Column } = require("typeorm");

@Entity()
export class Experience {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  position: string;

  @Column()
  city: string;

  @Column()
  company?: string;

  @Column()
  from: Date;

  @Column({
    nullable: true,
  })
  to!: Date;

  @Column("boolean", { default: false })
  current?: boolean = false;

  @Column()
  description_ru: string;

  @Column()
  description_en: string;

  @Column()
  description_de: string;

  @BeforeInsert()
  beforeInsertAction() {
    if (!this.to) {
      this.current = true;
    }
  }
}
