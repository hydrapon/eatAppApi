import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Index("uni_users_email", ["email"], { unique: true })
@Index("users_pkey", ["id"], { unique: true })
@Entity("users", { schema: "public" })
export class UsersEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "email", length: 255 })
  email: string;

  @Column("character varying", { name: "password", length: 60 })
  password: string;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", { name: "surname", length: 255 })
  surname: string;

  @Column("character varying", { name: "birthday", length: 255 })
  birthday: string;

  @Column("character varying", { name: "avatar", length: 255, default: 'defaultAvatar' })
  avatar: string;

  @Column("character varying", { name: "approved_hash", length: 32, nullable: true })
  approvedHash: string;

  @Column("character varying", { name: "approved_code", length: 6, nullable: true })
  approvedCode: string;

  @Column("enum", {
    name: "status",
    enum: ["unapproved", "approved", "deleted"],
    default: () => "unapproved",
  })
  status: "unapproved" | "approved" | "deleted";

  @Column("enum", {
    name: "access",
    enum: ["open", "close", "subscribers"],
    default: () => "open",
  })
  access: "open" | "close" | "subscribers";

  @Column("timestamp without time zone", {
    name: "reg_date",
    default: () => "now()",
  })
  regDate: Date;

  @Column("timestamp without time zone", { name: "updated_at", nullable: true })
  updatedAt: Date | null;
}
