//@ts-ignore
import { promisify } from "util";
//@ts-ignore
import { scrypt, randomBytes } from "crypto"; 

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex'); 
    //@ts-ignore
    const buf = (await scryptAsync(password, salt, 64)) as Buffer; 

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    //@ts-ignore
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}