import { createCipheriv, createDecipheriv, createHmac } from 'crypto';
import jwt from 'jsonwebtoken';
import * as crypto from 'node:crypto';
import { v1 as uuidV1, v4 as uuid, v5 as uuid5 } from 'uuid';
import CryptoJS from 'crypto-js';
import { createId } from '@paralleldrive/cuid2';
import { alphaNumeric, alphaNumericUppercase, numericCharacters } from '@enums';
export class GeneratorService {
  static verifyJwtToken = <T>(token: string, keySecret: string, options?: jwt.VerifyOptions): T =>
    jwt.verify(token, keySecret, options) as T;

  static createToken = <T = any>(payload: T, keySecret: string, option?: jwt.SignOptions): string =>
    jwt.sign(payload as any, keySecret, option);

  static uuidV4(): string {
    return uuid();
  }

  static uuid5(namespace: string, name: string): string {
    return uuid5(namespace, name);
  }

  static uuidV1(): string {
    return uuidV1();
  }
  static cuid(): string {
    return createId();
  }

  static async makeHash(value: string): Promise<string> {
    return CryptoJS.SHA256('' + value).toString();
  }

  // static async makeEncryption(value: string, key?: string): Promise<string> {
  //   if (key && key !== '') {
  //     const customEncryption = new Encryption({
  //       secret: key,
  //     });
  //     return customEncryption.encrypt(value);
  //   }
  //   return encryption.encrypt(value);
  // }

  static fileName(ext: string): string {
    return this.uuidV4() + '.' + ext;
  }

  static generateForCustomCharacters(length: number, characters: string[]): string {
    const charactersLength = characters.length;
    const maxValidSelector = Math.floor(0x10000 / charactersLength) * charactersLength - 1;
    const entropyLength = 2 * Math.ceil(1.1 * length);
    let result = '';
    let resultLength = 0;

    while (resultLength < length) {
      const entropy = crypto.randomBytes(entropyLength);
      let entropyPosition = 0;

      while (entropyPosition < entropyLength && resultLength < length) {
        const entropyValue = entropy.readUInt16LE(entropyPosition);

        entropyPosition += 2;

        if (entropyValue > maxValidSelector) {
          continue;
        }

        result += characters[entropyValue % charactersLength];
        resultLength++;
      }
    }

    return result;
  }

  /**
   * Generate ID by length
   * @param length length of ID
   * @param withUppercase If true, ID will be generated with uppercase alpha and numeric characters, else lowercase alpha
   * @returns ID as string
   */
  static generateUidByLength(length: number, withUppercase = false): string {
    const listCharacters = withUppercase ? alphaNumericUppercase : alphaNumeric;

    return this.generateForCustomCharacters(length, listCharacters);
  }

  /**
   * Generate Kit serial number (xxxx-xxxx-xxxx)
   */
  static generateString16(prefix?: string): string {
    const part1 = this.generateUidByLength(4);
    const part2 = this.generateUidByLength(4);
    const part3 = this.generateUidByLength(4);

    return `${prefix || part1}-${part2}-${part3}`;
  }

  static generateString4(): string {
    const str = this.generateUidByLength(4);
    const firstCharacter = str.split('')[0];

    if (!Number.isNaN(+firstCharacter)) {
      return this.generateString4();
    }

    return str;
  }

  static generateAnalysisString16(prefix?: string): string {
    const part1 = this.generateString4();
    const part2 = this.generateUidByLength(4);
    const part3 = this.generateUidByLength(4);
    const part4 = this.generateUidByLength(4);

    return `${prefix || part1}${part2}${part3}${part4}`;
  }

  static generateNumericPassword(length: number): string {
    return this.generateForCustomCharacters(length, numericCharacters);
  }

  static generateFriendlyIdByPrefix(length: number, prefix = '', characters?: string[]): string {
    const generatedStr = this.generateForCustomCharacters(
      length - prefix.length,
      characters || alphaNumericUppercase,
    );

    return prefix + generatedStr;
  }

  /**
   * Generate friendly ID (XXXX-XXXX-XXXX)
   */
  static generateFriendlyId(): string {
    const part1 = this.generateUidByLength(4, true);
    const part2 = this.generateUidByLength(4, true);
    const part3 = this.generateUidByLength(4, true);

    return `${part1}-${part2}-${part3}`;
  }

  static generateHumanReadableID(number = 17): string {
    return this.generateUidByLength(number, true);
  }

  private static calculateLuhnChecksum(number: string): number {
    let sum = 0;
    let isDouble = true;
    for (let i = number.length - 1; i >= 0; i--) {
      let value = isDouble ? +number.charAt(i) * 2 : +number.charAt(i);

      if (value.toString().length > 1) {
        value = value
          .toString()
          .split('')
          .reduce((acc, val) => acc + +val, 0);
      }

      isDouble = !isDouble;
      sum += value;
    }

    return 10 - (sum % 10 || 10);
  }

  static generate16DigitLuhn(prefix = 384): string {
    const completeNumber =
      prefix + this.generateForCustomCharacters(15 - prefix.toString().length, numericCharacters);

    return completeNumber + this.calculateLuhnChecksum(completeNumber);
  }
}
