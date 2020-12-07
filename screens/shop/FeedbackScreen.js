import React, { useEffect, useState } from 'react'
import {
	StyleSheet,
	View,
	Text,
	SafeAreaView,
	ScrollView,
	TextInput,
	Button,
	Alert,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Colors from '../../constants/Colors'
import * as feedbackActions from '../../store/actions/feedback'

const FeedbackScreen = (props) => {
	const localUserData = useSelector((state) => {
		state.auth.userSelfData
	})
	const phone = localUserData?.phone ?? ''
	const [message, setMessage] = useState('')
	const [userPhone, setUserPhone] = useState(phone ? phone : '')
	const [error, setError] = useState('')
	const dispatch = useDispatch()
	const { t, i18n } = useTranslation()

	useEffect(() => {
		if (error) {
			Alert.alert(t('feedback.errorTitle'), error, [{ text: 'Ок' }])
		}
		setError('')
	}, [error])

	const sendFeedback = async () => {
		setError(null)

		try {
			await dispatch(feedbackActions.sendFeedback(userPhone, message, t('feedback.errorDesc')))
			setMessage('')
			Alert.alert(t('feedback.alertTitle'), t('feedback.alertDesc'), [
				{ text: 'Ок', onPress: () => props.navigation.navigate('Categories') },
			])
		} catch (err) {
			setError(err.message)
		}
	}

	return (
		<SafeAreaView style={styles.screen}>
			<ScrollView style={styles.holder}>
				<Text style={styles.text}>{t('feedback.introText')}</Text>
				<Text style={styles.header}>{t('feedback.header')}</Text>
				<View style={styles.formControl}>
					<Text style={styles.label}>{t('feedback.phone')}</Text>
					<TextInput
						style={styles.input}
						clearButtonMode='always'
						keyboardType='number-pad'
						value={userPhone}
						onChangeText={(text) => setUserPhone(text)}
						/* onChangeText={textChangeHandler}
				onBlur={lostFocusHandler} */
					/>
					<Text style={styles.label}>{t('feedback.message')}</Text>
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
							<Text style={styles.textInfo}>{t('feedback.requirements')}</Text>
						) : (
							<Button
								title={t('feedback.send')}
								color={Colors.primary}
								disabled={userPhone.trim().length === 0 || message.trim().length === 0}
								onPress={sendFeedback}
							/>
						)}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1 },
	holder: { flex: 1, marginVertical: 10, paddingHorizontal: 10 },
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
