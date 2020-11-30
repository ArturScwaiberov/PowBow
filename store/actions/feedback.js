export const sendFeedback = (phone, message) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token
		const response = await fetch(
			`https://shopapp-6f444.firebaseio.com/feedback.json?auth=${token}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					phone,
					message,
				}),
			}
		)

		if (!response.ok) {
			throw new Error('При отправке сообщения произошла ошибка...')
		}
	}
}
