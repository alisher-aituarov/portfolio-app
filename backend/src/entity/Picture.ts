const { Entity, PrimaryGeneratedColumn, Column } = require("typeorm");

@Entity()
export class Picture {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  is_main: boolean;
}
