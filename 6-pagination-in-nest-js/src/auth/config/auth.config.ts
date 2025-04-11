import { registerAs } from "@nestjs/config";

export default registerAs('auth', () => ({
    sharedSecret: process.env.SECRET_KEY
}))