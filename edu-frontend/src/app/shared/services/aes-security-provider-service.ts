import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AesSecurityProviderService {
cipherKey = 'JwMDeViy9r3NUQ/sq1EIkBKh3bH0vo1n11y5DWDI2fM=';
  encrypted: any = "";
  decrypted!: string;
  constructor() { }
  // Method to encrypt a field using AES-256 encryption
  encryptUsingAES256(fieldToEncrypt: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.cipherKey);
    const encrypted = CryptoJS.AES.encrypt(fieldToEncrypt, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }
  decryptUsingAES256(fieldToDecrypt: string): string {
    try {
      const key = CryptoJS.enc.Utf8.parse(this.cipherKey);
      const decryptedBytes = CryptoJS.AES.decrypt(fieldToDecrypt, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedText) {
        throw new Error('Decryption failed. Result is empty.');
      }
      return decryptedText;
    } catch (error:any) {
      console.error('Decryption error:', error?.message);
      return '*****2134';
    }
  }
}

