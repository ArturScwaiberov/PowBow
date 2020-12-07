import React from 'react'
import {
	Platform,
	Text,
	StyleSheet,
	View,
	TouchableNativeFeedback,
	TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../../constants/Colors'

const CustomHeaderButton = (props) => {
	let TouchableCmp = TouchableOpacity

	if (Platform.OS === 'android' && Platform.Version >= 21) {
		TouchableCmp = TouchableNativeFeedback
	}

	return (
		<TouchableCmp onPress={props.onPress}>
			<View
				style={{
					paddingHorizontal: 16,
					paddingVertical: 9,
					backgroundColor: Platform.OS === 'android' ? Colors.primary : 'white',
					flexGrow: 1,
					justifyContent: 'center',
				}}
			>
				<Ionicons
					name={props.name}
					size={24}
					color={Platform.OS === 'android' ? 'white' : Colors.primary}
				/>
				<View style={props.quantityInCart ? styles.informerHolder : styles.informerHiden}>
					<Text style={styles.cartInformer}>{props?.quantityInCart ?? ''}</Text>
				</View>
			</View>
		</TouchableCmp>
	)
}

const styles = StyleSheet.create({
	rounded: { borderRadius: 30 },
	informerHolder: {
		backgroundColor: Colors.accent,
		width: 16,
		height: 16,
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
		right: 8,
	},
	informerHiden: { display: 'none' },
	cartInformer: {
		fontSize: 12,
		fontFamily: 'open-sans-bold',
		color: Colors.primary,
	},
})

export default CustomHeaderButton
