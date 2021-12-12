const { Entity, PrimaryGeneratedColumn, Column } = require("typeorm");

@Entity()
export class CV {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  path: string;
}
