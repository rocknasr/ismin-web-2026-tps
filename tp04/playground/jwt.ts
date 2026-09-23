import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import jwt from 'jsonwebtoken'; 

//import { hashPassword } from '../src/auth/password.js';

// Lancer : npx tsx playground/exemple.ts
// Copiez ce fichier, renommez-le, et écrivez votre exemple dedans.


//const hash1 = hashPassword('secret')
//console.log('hash1', hash1)
//const hash2 = hashPassword('secret')
//console.log('\n\nhash2', hash2)

const secret = process.env.JWT_SECRET;

if(!secret){
    throw new Error('JWT_SECRET is not set');
}

const jwtService = new JwtService({secret});
const token = jwt.sign({
    sub: 'alice', 
    role: 'admin'
}, secret, {expiresIn: '2s'});

console.log(jwt.verify(token, secret));

setTimeout(() => {
    try {
        jwt.verify(token,secret);
    }catch
        (err: any){
            console.log(err.name, err.message);
        }
    try {
        jwt.verify(token, 'wrong');
    } catch (err: any) {
        console.log(err.name, err.message);
    }
}, 3000);
