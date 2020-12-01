import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { useDispatch } from 'react-redux'
import i18n from 'i18next';

import * as authActions from '../store/actions/auth'
import * as userRealtimeActions from '../store/actions/users'
import { withTranslation  } from "react-i18next";
/* import Loading from '../components/UI/Loading' */

const StartupScreen = (props) => {
	/* const [isLoading, setIsLoading] = useState() */
	const dispatch = useDispatch()

	useEffect(() => {
		const tryLogin = async () => {
			const userData = await AsyncStorage.getItem('userData')
			if (!userData) {
				props.navigation.navigate('Welcome')
				return
			}
			const transformedData = JSON.parse(userData)
			const { token, userId, expiryDate } = transformedData
			const expirationDate = new Date(expiryDate)

			if (expirationDate <= new Date() || !token || !userId) {
				dispatch(authActions.logout())
				props.navigation.navigate('AdminNavigator')
				return
			}
			const expirationTime = expirationDate.getTime() - new Date().getTime()

			await dispatch(authActions.authenticate(userId, token, expirationTime))
			await dispatch(userRealtimeActions.fetchUserData())
			props.navigation.navigate('ProductsNavigator')
		}

		tryLogin()
	}, [dispatch])

	/* if (isLoading) {
		return <Loading />
	} */

	return (
		<View style={styles.screen}>
			<Button
				title='Сменить язык'
				onPress={() => {
					i18n.changeLanguage(i18n.language === 'ru' ? 'en' : 'ru');
				}}
			/>
			<Text>Welcome Screen</Text>
			<Button
				title={i18n.t('welcome.goToMagazine')}
				onPress={() => {
					props.navigation.navigate('ProductsNavigator')
				}}
			/>
			<Button
				title={i18n.t('welcome.signIn')}
				onPress={() => {
					props.navigation.navigate('AdminNavigator')
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})

export default withTranslation()(StartupScreen);
