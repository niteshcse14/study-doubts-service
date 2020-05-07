export default class StringComparision {
	static _min(d0, d1, d2, bx, ay) {
		return d0 < d1 || d2 < d1
			? d0 > d2 ? d2 + 1 : d0 + 1
			: bx === ay ? d1 : d1 + 1;
	}

	/**
	 * compare : comparing two string
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 *  * @param stringA string
	 *  * @param stringB string
	 */
	static compare(stringA, stringB) {
		let stringALength = stringA.length;
		let stringBLength = stringB.length;
		if (stringA === stringB) return 0;
		if (stringA.length > stringB.length) {
			const temp = stringA;
			stringA = stringB;
			stringB = temp;
		}

		while (stringALength > 0 && (stringA.charCodeAt(stringALength - 1) === stringB.charCodeAt(stringBLength - 1))) {
			stringALength--;
			stringBLength--;
		}
		let offset = 0;
		while (offset < stringALength && (stringA.charCodeAt(offset) === stringB.charCodeAt(offset))) {
			offset++;
		}

		stringALength -= offset;
		stringBLength -= offset;

		if (stringALength === 0 || stringBLength < 3) {
			return stringBLength;
		}

		let x = 0, y, d0, d1, d2, d3, dd, dy, ay, bx0, bx1, bx2, bx3;
		const vector = [];

		for (y = 0; y < stringALength; y++) {
			vector.push(y + 1);
			vector.push(stringA.charCodeAt(offset + y));
		}
		const len = vector.length - 1;

		for (; x < stringBLength - 3;) {
			bx0 = stringB.charCodeAt(offset + (d0 = x));
			bx1 = stringB.charCodeAt(offset + (d1 = x + 1));
			bx2 = stringB.charCodeAt(offset + (d2 = x + 2));
			bx3 = stringB.charCodeAt(offset + (d3 = x + 3));
			dd = (x += 4);
			for (y = 0; y < len; y += 2) {
				dy = vector[y];
				ay = vector[y + 1];
				d0 = this._min(dy, d0, d1, bx0, ay);
				d1 = this._min(d0, d1, d2, bx1, ay);
				d2 = this._min(d1, d2, d3, bx2, ay);
				dd = this._min(d2, d3, dd, bx3, ay);
				vector[y] = dd;
				d3 = d2;
				d2 = d1;
				d1 = d0;
				d0 = dy;
			}
		}

		for (; x < stringBLength;) {
			bx0 = stringB.charCodeAt(offset + (d0 = x));
			dd = ++x;
			for (y = 0; y < len; y += 2) {
				dy = vector[y];
				vector[y] = dd = this._min(dy, d0, dd, bx0, vector[y + 1]);
				d0 = dy;
			}
		}
		return dd;
	};

	static distance(a, b) {
		if(a.length == 0) return b.length;
		if(b.length == 0) return a.length;

		const dp = [];
		for(let i = 0; i <= b.length; i++) dp[i] = [i];
		for(let j = 0; j <= a.length; j++) dp[0][j] = j;

		for(let i = 1; i <= b.length; i++){
			for(let j = 1; j <= a.length; j++){
				if(b.charAt(i-1) == a.charAt(j-1)) dp[i][j] = dp[i-1][j-1];
				else dp[i][j] = Math.min(dp[i-1][j-1] + 1, Math.min(dp[i][j-1] + 1, dp[i-1][j] + 1));
			}
		}
		return dp[b.length][a.length];
	}
}
