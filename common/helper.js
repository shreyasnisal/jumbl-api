
exports.shuffle = function (arr) {
	for (let i = 0; i < 100; i++) {
		const moveDirection = Math.floor(Math.random() * 4)

		if (moveDirection == 0) {
			// try swapping empty tile up
			if (arr.indexOf(0) - 4 < 0) {
				i--
				continue
			}

			arr = swap(arr, arr.indexOf(0), arr.indexOf(0) - 4)
		}

		else if (moveDirection == 1) {
			// try swapping empty tile down
			if (arr.indexOf(0) + 4 > 15) {
				i--
				continue
			}

			arr = swap(arr, arr.indexOf(0), arr.indexOf(0) + 4)
		}

		else if (moveDirection == 2) {
			// try swapping empty tile left
			if (arr.indexOf(0) % 4 - 1 < 0) {
				i--
				continue
			}

			arr = swap(arr, arr.indexOf(0), arr.indexOf(0) - 1)
		}

		else if (moveDirection == 3) {
			// try swapping empty tile right
			if (arr.indexOf(0) % 4 + 1 > 3) {
				i--
				continue
			}

			arr = swap(arr, arr.indexOf(0), arr.indexOf(0) + 1)
		}
	}

	// move empty tile to bottom right
	while (arr.indexOf(0) != 15) {
		while (arr.indexOf(0) % 4 + 1 < 4) {
			arr = swap(arr, arr.indexOf(0), arr.indexOf(0) + 1)
		}

		while (arr.indexOf(0) + 4 < 16) {
			arr = swap(arr, arr.indexOf(0), arr.indexOf(0) + 4)
		}
	}

	return arr
}

function swap(arr, src, dest) {
	const resultArr = [...arr];
	[resultArr[src], resultArr[dest]] = [resultArr[dest], resultArr[src]]
	return resultArr
}