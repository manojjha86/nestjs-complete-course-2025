import { Hashtag } from "src/hashtag/hashtag.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Tweet{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        nullable: false
    })
    text: string;

    @Column({
        type: 'text',
        nullable: true
    })
    image?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.tweets)
    user: User;

    @ManyToMany(() => Hashtag, (hashtag) => hashtag.tweets)
    @JoinTable()
    hashtags: Hashtag[];
}