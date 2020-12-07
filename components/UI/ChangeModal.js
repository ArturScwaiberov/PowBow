import AsyncStorage from '@react-native-community/async-storage'
import React, { useEffect, useState } from 'react'
import {
	Image,
	Modal,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	TouchableOpacity,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import Colors from '../../constants/Colors'

const ChangeModal = (props) => {
	const [modalVisible, setModalVisible] = useState(false)
	const [currentLang, setCurrentLang] = useState('')
	const ru = require('../../data/images/russia_100.png')
	const kg = require('../../data/images/kyrgyzstan_100.png')
	const { t, i18n } = useTranslation()

	useEffect(() => {
		let cleanupFunction = false
		const getLanguage = async () => {
			try {
				const lang = await AsyncStorage.getItem('lang')

				if (!cleanupFunction) setCurrentLang(lang)
			} catch (e) {
				console.log(e)
			}
		}

		getLanguage()

		return () => (cleanupFunction = true)
	})

	const changeLang = async () => {
		const lang = currentLang === 'ru' ? 'kg' : 'ru'
		i18n.changeLanguage(lang)
		await AsyncStorage.setItem('lang', lang)
		setModalVisible(!modalVisible)
	}

	return (
		<View>
			<Modal animationType='slide' transparent={true} visible={modalVisible}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>{t('welcome.chooseLanguage')}</Text>

						<TouchableHighlight
							style={{ ...styles.openButton, backgroundColor: Colors.primary }}
							underlayColor='#999'
							onPress={() => {
								changeLang()
							}}
						>
							<Text style={styles.textStyle}>
								{currentLang === 'ru' ? t('welcome.kyrgyz') : t('welcome.russian')}
							</Text>
						</TouchableHighlight>

						<TouchableHighlight
							style={{ ...styles.openButton, backgroundColor: '#999' }}
							underlayColor='#999'
							onPress={() => {
								setModalVisible(!modalVisible)
							}}
						>
							<Text style={styles.textStyle}>{t('welcome.cancel')}</Text>
						</TouchableHighlight>
					</View>
				</View>
			</Modal>

			<TouchableOpacity
				style={styles.flagHolder}
				onPress={() => {
					setModalVisible(true)
				}}
			>
				<View style={styles.flagContainer}>
					<Image source={currentLang === 'ru' ? ru : kg} style={styles.flag} />
				</View>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	centeredIcon: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 10,
		backgroundColor: '#ccc',
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		backgroundColor: 'white',
		borderRadius: 10,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	openButton: {
		borderRadius: 10,
		padding: 13,
		elevation: 2,
		margin: 10,
	},
	textStyle: {
		color: 'white',
		fontFamily: 'open-sans-bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 10,
		textAlign: 'center',
		fontFamily: 'open-sans-bold',
		fontSize: 16,
	},
	flagHolder: { flexDirection: 'column', justifyContent: 'center' },
	flagContainer: { marginLeft: 12, marginTop: 11 },
	flag: { width: 30, height: 20 },
})

export default ChangeModal
