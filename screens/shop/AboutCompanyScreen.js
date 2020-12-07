import React, { useState } from 'react'
import { StyleSheet, Text, Image, ScrollView, SafeAreaView } from 'react-native'
import { useTranslation } from 'react-i18next'

import Colors from '../../constants/Colors'

const AboutCompanyScreen = (props) => {
	const { t, i18n } = useTranslation()

	return (
		<ScrollView style={styles.screen}>
			<SafeAreaView style={styles.holder}>
				<Text style={styles.header}>{t('about.header1')}</Text>
				<Text style={styles.text}>{t('about.introText1')}</Text>
				<Text style={styles.header}>{t('about.header2')}</Text>
				<Image
					style={styles.image}
					source={{ uri: 'http://toyboss.kg/media/uploads/certificates/06.jpg' }}
				/>
				<Text style={styles.text}>{t('about.introText2')}</Text>
				<Text style={styles.header}>{t('about.header3')}</Text>
				<Image
					style={styles.image}
					source={{
						uri: 'https://i.pinimg.com/originals/01/7d/92/017d923fbbf1e3ffd319c063f3a5f959.jpg',
					}}
				/>
				<Text style={styles.text}>{t('about.introText3')}</Text>
			</SafeAreaView>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, paddingHorizontal: 10 },
	holder: { marginBottom: 15 },
	header: {
		fontFamily: 'open-sans-bold',
		fontSize: 22,
		paddingLeft: 10,
		paddingVertical: 10,
		color: Colors.primary,
	},
	text: { fontFamily: 'open-sans' },
	image: { height: 260, resizeMode: 'contain', margin: 5 },
})

export default AboutCompanyScreen
