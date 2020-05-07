import crypto from 'crypto';

export default class StatelessMiddleware {

	cookie: any;
	generator_algo: any;
	generator_secret: any;
	constructor(cookie, generator_algo, generator_secret) {
		this.cookie = cookie;
		this.generator_algo = generator_algo;
		this.generator_secret = generator_secret;
	}

	/**
	 * tokenAuthCommon : verifying is valid request or not
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 */
	tokenAuthCommon(req, res, next) {
		delete req.query._;
		let self = this,
			lazyUser;
		//TO LOGIN
		req.loginUser = user => {
			req.user = user;
			lazyUser = user;
			req.isAuthenticated = true;
			let token = self.encrypt(user);
			if (token instanceof Error) {
				return res.status(500).send(token);
			}
			req.token = token;
			if (self.cookie) {
				res.cookie(self.cookie, token, {
					expires: new Date(+new Date() + 3600000)
				});
			}
		};
		req.getLazyUser = () => {
			return lazyUser;
		};
		//TO LOGOUT
		req.logout = () => {
			req.user = null;
			lazyUser = null;
			req.isAuthenticated = false;
			if (self.cookie) {
				res.cookie(self.cookie, '', {
					expires: new Date(+new Date() - 3600000)
				});
			}
		};
		next();
	};

	/**
	 * _getTokenFromRequest : returning saved token
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 */
	_getTokenFromRequest(req) {
		let token = req.headers['authorization'] || req.headers['Authorization'] || req.query.token ||
			(this.cookie && req.cookies && req.cookies[this.cookie] || undefined) || undefined;
		delete req.query.token;
		return token;
	}

	/**
	 * _processToken : binding token in request
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 */
	_processToken(req, res, next, token) {
		token = token.trim().replace(/^Bearer /, '').trim();
		let session = this.decrypt(token);
		if (session instanceof Error) {
			return res.status(403).send('Invalid token defined');
		}
		req.user = session;
		req.isAuthenticated = true;
		if (this.cookie) {
			res.cookie(this.cookie, token, {
				expires: new Date(+new Date() + 3600000)
			});
		}
		return next();
	}

	/**
	 * tokenAuth : validating is request forbidden or valid
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 */
	tokenAuth(req, res, next) {
		let token = this._getTokenFromRequest(req);
		if (token) {
			this._processToken(req, res, next, token);
		} else {
			res.status(403).send({error: 'Forbidden'});
		}

	};

	tokenTryAuth(req, res, next) {
		let token = this._getTokenFromRequest(req);
		if (token) {
			this._processToken(req, res, next, token);
		} else {
			next();
		}
	};

	/**
	 * encrypt : encrypting data
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param data string
	 */
	encrypt(data) {
		let json = JSON.stringify({payload: data});
		try {
			let cipher = crypto.createCipher(this.generator_algo, this.generator_secret);
			return cipher.update(json, 'binary', 'hex') + cipher.final('hex');
		} catch (c) {
			return new Error(c);
		}
	}

	/**
	 * decrypt : decrypting data
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param cryptText string
	 */

	decrypt(cryptText) {
		let data = null;
		try {
			let decipher = crypto.createDecipher(this.generator_algo, this.generator_secret);
			// data = JSON.parse(decipher.update(cryptText, 'hex') + decipher.final());
		} catch (c) {
			c.message = "Unable to decode the cryptext. Tampered input! Or Invalid Secret! " + c.message;
			return new Error(c);
		}
		return new Error("Unable to parse. Bad data or secret.");
	}
}
