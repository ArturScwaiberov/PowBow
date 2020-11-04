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
import { Ionicons } from '@expo/vector-icons'

import Card from '../UI/Card'
import Colors from '../../constants/Colors'

const ProductItem = (props) => {
	const { imageUrl, title, price, ownerId } = props.item
	const localId = useSelector((state) => state.auth.userId)

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
							{localId === ownerId && (
								<View style={styles.ownerSign}>
									<Ionicons
										name={Platform.OS === 'android' ? 'md-bowtie' : 'ios-bowtie'}
										size={24}
										color={Colors.primary}
									/>
								</View>
							)}
							<Image style={styles.image} source={{ uri: imageUrl }} />
						</View>
						<View style={styles.details}>
							<Text style={styles.title}>{title}</Text>
							<Text style={styles.price}>{price} сом</Text>
						</View>
						<View style={styles.actions}>{props.children}</View>
					</View>
				</TouchableCmp>
			</View>
		</Card>
	)
}

const styles = StyleSheet.create({
	product: {
		height: 300,
		marginHorizontal: 20,
		marginVertical: 15,
	},
	touchable: { borderRadius: 10, overflow: 'hidden' },
	imageContainer: {
		width: '100%',
		height: '60%',
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		overflow: 'hidden',
	},
	ownerSign: { position: 'absolute', zIndex: 999, right: 10, top: 10 },
	image: { width: '100%', height: '100%' },
	details: { alignItems: 'center', height: '20%', padding: 10 },
	title: {
		fontSize: 18,
		marginVertical: 2,
		fontFamily: 'open-sans-bold',
	},
	price: { fontSize: 14, color: '#888', fontFamily: 'open-sans' },
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: '20%',
		paddingHorizontal: 20,
	},
})

export default ProductItem
