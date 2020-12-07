import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Button, ImageBackground } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { useDispatch } from 'react-redux'
import i18n from 'i18next'
import { withTranslation } from 'react-i18next'

import * as authActions from '../store/actions/auth'
import * as userRealtimeActions from '../store/actions/users'
import Loading from '../components/UI/Loading'

const StartupScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false)
	const dispatch = useDispatch()

	useEffect(() => {
		let cleanupFunction = false
		setIsLoading(true)
		const tryLogin = async () => {
			const userData = await AsyncStorage.getItem('userData')
			if (!userData) {
				setIsLoading(false)
				props.navigation.navigate('Welcome')
				return
			}
			const transformedData = JSON.parse(userData)
			const { token, userId, expiryDate } = transformedData
			const expirationDate = new Date(expiryDate)

			if (!token || !userId) {
				dispatch(authActions.logout())
				setIsLoading(false)
				props.navigation.navigate('AdminNavigator')
				return
			}

			if (expirationDate <= new Date()) {
				await dispatch(authActions.refreshToken())
				setIsLoading(false)
			}

			const expirationTime = expirationDate.getTime() - new Date().getTime()

			await dispatch(authActions.authenticate(userId, token, expirationTime))
			await dispatch(userRealtimeActions.fetchUserData(i18n.t('categories.errorMessageFetchUser')))
			if (!cleanupFunction) {
				setIsLoading(false)
			}
			props.navigation.navigate('ProductsNavigator')
		}

		tryLogin()
		return () => (cleanupFunction = true)
	}, [])

	if (isLoading) {
		return <Loading />
	}

	return (
		<ImageBackground source={require('../data/images/homeScreeh.png')} style={styles.screen}>
			<View style={styles.buttonsHolder}>
				<View style={styles.button}>
					<Button
						title={i18n.t('welcome.chooseLanguage')}
						onPress={() => {
							const lang = i18n.language === 'ru' ? 'kg' : 'ru'
							i18n.changeLanguage(lang)
							AsyncStorage.setItem('lang', lang)
						}}
					/>
				</View>
				<View style={styles.button}>
					<Button
						title={i18n.t('welcome.titleDrawer')}
						onPress={() => {
							props.navigation.navigate('ProductsNavigator')
						}}
					/>
				</View>
				<View style={styles.button}>
					<Button
						title={i18n.t('welcome.toAuth')}
						onPress={() => {
							props.navigation.navigate('AdminNavigator')
						}}
					/>
				</View>
			</View>
		</ImageBackground>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
	buttonsHolder: { bottom: 15, position: 'absolute', alignSelf: 'center' },
	button: { marginTop: 8 },
})

export default withTranslation()(StartupScreen)
