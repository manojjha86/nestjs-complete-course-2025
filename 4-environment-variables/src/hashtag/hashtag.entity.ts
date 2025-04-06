import { Tweet } from "src/tweet/tweet.entity";
import { Column, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Hashtag{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        nullable: false,
        unique: true
    })
    name: string;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToMany(() => Tweet, (tweet) => tweet.hashtags, { onDelete: 'CASCADE'})
    tweets: Tweet[];
}