const { Entity, PrimaryGeneratedColumn, Column } = require("typeorm");

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  link: string;

  @Column()
  iconPath: string;
}
