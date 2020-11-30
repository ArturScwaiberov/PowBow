import React, { useEffect, useState } from 'react'
import {
	StyleSheet,
	View,
	Text,
	SafeAreaView,
	ScrollView,
	TextInput,
	Button,
	KeyboardAvoidingView,
	Alert,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import Colors from '../../constants/Colors'
import * as feedbackActions from '../../store/actions/feedback'

const FeedbackScreen = (props) => {
	const localUserData = useSelector((state) => state.auth.userSelfData[0])
	const { phone } = localUserData
	const [message, setMessage] = useState('')
	const [userPhone, setUserPhone] = useState(phone ? phone : '')
	const [error, setError] = useState()
	const dispatch = useDispatch()

	useEffect(() => {
		if (error) {
			Alert.alert('Упс.. ошибка', error, [{ text: 'Ок' }])
		}
	}, [error])

	const sendFeedback = async () => {
		setError(null)

		try {
			await dispatch(feedbackActions.sendFeedback(userPhone, message))
			setMessage('')
			Alert.alert('Ваше сообщение отправлено', 'В ближайшее время с Вами свяжется специалист', [
				{ text: 'Ок', onPress: () => props.navigation.navigate('Categories') },
			])
		} catch (err) {
			setError(err.message)
		}
	}

	return (
		<KeyboardAvoidingView behavior='position' keyboardVerticalOffset={90}>
			<SafeAreaView style={styles.screen}>
				<ScrollView style={styles.holder}>
					<Text style={styles.text}>
						Ваше мнение очень важно для нас, пожалуйста оставьте контактные данные и сообщение.
					</Text>
					<Text style={styles.header}>Форма обратной связи</Text>
					<View style={styles.formControl}>
						<Text style={styles.label}>Ваш котактный номер</Text>
						<TextInput
							style={styles.input}
							clearButtonMode='always'
							keyboardType='number-pad'
							value={userPhone}
							onChangeText={(text) => setUserPhone(text)}
							/* onChangeText={textChangeHandler}
				onBlur={lostFocusHandler} */
						/>
						<Text style={styles.label}>Сообщение</Text>
						<TextInput
							style={styles.textArea}
							keyboardType='default'
							multiline
							numberOfLines={6}
							value={message}
							onChangeText={(text) => setMessage(text)}
						/>
						<View style={styles.buttonContainer}>
							{userPhone.trim().length === 0 || message.trim().length === 0 ? (
								<Text style={styles.textInfo}>Для отправки необходимо заполнить все поля.</Text>
							) : (
								<Button
									title={'Отправить'}
									color={Colors.primary}
									disabled={userPhone.trim().length === 0 || message.trim().length === 0}
									onPress={sendFeedback}
								/>
							)}
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	screen: { paddingHorizontal: 10 },
	holder: { marginVertical: 10 },
	header: {
		fontFamily: 'open-sans-bold',
		fontSize: 22,
		paddingLeft: 10,
		paddingVertical: 10,
		color: Colors.primary,
	},
	text: { fontFamily: 'open-sans' },
	textInfo: { fontFamily: 'open-sans', textAlign: 'center' },
	formControl: { width: '100%' },
	label: { fontFamily: 'open-sans-bold', marginVertical: 8 },
	input: {
		paddingVertical: 5,
		paddingHorizontal: 2,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
	},
	textArea: {
		paddingVertical: 5,
		paddingHorizontal: 2,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
		height: 108,
	},
	buttonContainer: { marginTop: 15 },
})

export default FeedbackScreen
