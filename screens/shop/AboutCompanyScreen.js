import React, { useState } from 'react'
import { StyleSheet, Text, Image, ScrollView, SafeAreaView } from 'react-native'

import Colors from '../../constants/Colors'

const AboutCompanyScreen = (props) => {
	return (
		<ScrollView style={styles.screen}>
			<SafeAreaView style={styles.holder}>
				<Text style={styles.header}>Eva Mall</Text>
				<Text style={styles.text}>
					Предлагает широкий ассортимент товаров с доставкой прямо до двери!
				</Text>
				<Text style={styles.header}>Наши сертификаты</Text>
				<Image
					style={styles.image}
					source={{ uri: 'http://toyboss.kg/media/uploads/certificates/06.jpg' }}
				/>
				<Text style={styles.text}>
					Мы реализуем только качественный товар, только лицензированный - для вас!
				</Text>
				<Text style={styles.header}>Наши курьеры</Text>
				<Image
					style={styles.image}
					source={{
						uri: 'https://i.pinimg.com/originals/01/7d/92/017d923fbbf1e3ffd319c063f3a5f959.jpg',
					}}
				/>
				<Text style={styles.text}>
					Мы реализуем только качественный товар, только лицензированный - для вас!
				</Text>
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
