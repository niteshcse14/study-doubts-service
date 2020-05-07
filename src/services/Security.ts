import crypto from "crypto";

export default class Security {

	algorithm: string = 'aes-256-cbc';
	key: any = crypto.randomBytes(32);
	iv: any = crypto.randomBytes(16);

	randomHex(num: Number = 64) {
		return crypto.randomBytes(Math.ceil(+num / 2)).toString('hex')
	}

	randomBase64(num: Number = 64) {
		return crypto
			.randomBytes(Math.ceil((+num * 3) / 4))
			.toString('base64')
			.slice(0, +num)
			.replace(/\+/g, '0')
			.replace(/\//g, '0')
	}

	encrypt(text) {
		let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.key), this.iv);
		let encrypted = cipher.update(text);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		return { iv: this.iv.toString('hex'), encryptedData: encrypted.toString('hex') };
	}

	decrypt(text) {
		let iv = Buffer.from(text.iv, 'hex');
		let encryptedText = Buffer.from(text.encryptedData, 'hex');
		let decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), this.iv);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString();
	}
}
