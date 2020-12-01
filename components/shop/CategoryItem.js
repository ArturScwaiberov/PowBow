import React from 'react'
import {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableOpacity,
	Platform,
	TouchableNativeFeedback,
} from 'react-native'
import { useSelector } from 'react-redux'

import Card from '../UI/Card'

const CategoryItem = (props) => {
	const { imageUrl, title, price, ownerId } = props.item

	let TouchableCmp = TouchableOpacity

	if (Platform.OS === 'android' && Platform.Version >= 21) {
		TouchableCmp = TouchableNativeFeedback
	}

	return (
		<Card style={styles.product}>
			<View style={styles.touchable}>
				<TouchableCmp onPress={props.onSelect} useForeground>
					<View>
						<View style={styles.imageContainer}>
							<Image style={styles.image} source={{ uri: imageUrl }} />
							<Text style={styles.title}>{title}</Text>
						</View>
					</View>
				</TouchableCmp>
			</View>
		</Card>
	)
}

const styles = StyleSheet.create({
	product: { flex: 1, marginHorizontal: 2, marginVertical: 2, height: 180 },
	touchable: { borderRadius: 10, overflow: 'hidden' },
	imageContainer: {
		width: '100%',
		height: '100%',
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		overflow: 'hidden',
	},
	image: { width: '100%', height: '100%' },
	title: {
		fontFamily: 'open-sans-bold',
		fontSize: 18,
		position: 'absolute',
		paddingTop: 3,
		paddingBottom: 3,
		backgroundColor: 'rgba(255,255,255,0.5)',
		width: '100%',
		textAlign: 'center',
	},
})

export default CategoryItem
