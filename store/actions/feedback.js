export const sendFeedback = (phone, message, sendError) => {
	return async (dispatch, getState) => {
		const token = 'Рowpowtoken'
		const response = await fetch(`https://evamall.altkg.com/feedback`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				phone,
				message,
				token,
			}),
		})

		if (!response.ok) {
			throw new Error(sendError)
		}
	}
}
