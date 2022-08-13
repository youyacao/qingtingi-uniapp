import CryptoJS from "crypto-js";
// import CryptoJS from "../../node_modules/crypto-js/crypto-js.js";//一般npm以后都是这个位置
let KEY = 'tt3217834abcdefg'
let IV = 'ee34567890123456';//我感觉可以不写，反正我没有写（看你们需求）
let aestools = {
	/*aes加密*/
	setAES(str) {
		const data = CryptoJS.enc.Hex.parse(str);
		const key = CryptoJS.enc.Hex.parse(KEY);
		const iv = CryptoJS.enc.Hex.parse(IV);
		var option = {
			iv: iv,
			mode: CryptoJS.mode['CBC'],//看需求变“CBC”
			padding: CryptoJS.pad['ZeroPadding']//看需求变“ZeroPadding”
		};
		var encrypted = CryptoJS.AES.encrypt(data, key, option);
		const words = encrypted.ciphertext;
		var hex = CryptoJS.enc.Hex.stringify(words);
		return hex
	},
	/*aes解密*/
	decryptAES(str) {
		console.log("str", str)
		let data = CryptoJS.enc.Hex.parse(str);
		const key = CryptoJS.enc.Hex.parse(KEY);
		const iv = CryptoJS.enc.Hex.parse(IV);
		var option = {
			iv: iv,
			mode: CryptoJS.mode['CBC'],//看需求变“CBC”
			padding: CryptoJS.pad['ZeroPadding']//看需求变“ZeroPadding”
		};
		data = CryptoJS.enc.Base64.stringify(data);
		const words = CryptoJS.AES.decrypt(data, key, option);
		var hex = CryptoJS.enc.Hex.stringify(words);
		return hex
	}

};

export default aestools;
