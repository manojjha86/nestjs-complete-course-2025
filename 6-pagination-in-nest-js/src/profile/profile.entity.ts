import { User } from "src/users/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: true,
        length: 100
    })
    firstName: string;

    @Column({
        type: 'varchar',
        nullable: true,
        length: 100
    })
    lastName: string;

    @Column({
        type: 'varchar',
        nullable: true,
        length: 10
    })
    gender: string;

    @Column({
        type: 'timestamp',
        nullable: true
    })
    dateOfBirth: Date;

    @Column({
        type: 'text',
        nullable: true
    })
    bio: string;

    @Column({type: 'text', nullable: true})
    profileImage: string;

    @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;
}