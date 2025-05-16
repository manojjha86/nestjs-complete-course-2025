import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
    public async hashPassword(password: string | Buffer): Promise<string> {
        //GENERATE A SALT
        let salt = await bcrypt.genSalt();

        //HASH THE PASSWORD
        return await bcrypt.hash(password, salt);
    }

    public async comparePassword(plainPassword: string | Buffer, hashedPassword: string | Buffer): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword); //test1234 - 
    }
}
