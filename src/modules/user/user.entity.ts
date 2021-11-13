import { Table, Model, Column, DataType, Unique, IsEmail, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';


@Table({
    tableName: 'users',
})
export class User extends Model<User>{
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @Unique
    @IsEmail
    @Column({
        allowNull: false,
        unique: true,
    })
    email: string;

    @Column({
        allowNull: false
    })
    password: string;

    @Column({
        allowNull: false
    })
    name: string;

    @Column({
        allowNull: false
    })
    surname: string;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false
    })
    birthday: Date;

    @Column({
        type: DataType.TEXT,
        defaultValue: 'defaultAvatar'
    })
    avatar: string

    @Column({ type: DataType.ARRAY(DataType.INTEGER), defaultValue: [] })
    friends: number[];

    // @Column({ type: DataType.ARRAY(DataType.INTEGER), defaultValue: [] })
    // posts: number[];

    // @Column({ type: DataType.ARRAY(DataType.INTEGER), defaultValue: [] })
    // recipes: number[];

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    account_access: number;

    @Column({
        type: DataType.STRING
    })
    status: string;

    @Column({
        type: DataType.ENUM,
        values: ["unapproved", "approved", "banned"],
        defaultValue: 'unapproved'
    })
    accountStatus: "unapproved" | "approved" | "banned";

    @Column({
        type: DataType.STRING
    })
    approvedHash: string;

    @Column({
        type: DataType.INTEGER
    })
    approvedCode: number;

    @Column({
        field: 'active_at'
    })
    activeAt: Date;

    @CreatedAt
    @Column({
        field: 'created_at'
    })
    createdAt: Date;

    @UpdatedAt
    @Column({
        field: 'updated_at'
    })
    updatedAt: Date;

}