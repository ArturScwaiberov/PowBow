import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'

const NotFoundScreen = (props) => {
	return (
		<View style={styles.screen}>
			<Text>NotFoundScreen - 404</Text>
			<Button
				title='Home'
				onPress={() => {
					props.navigation.navigate('ProductsNavigator')
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})

export default NotFoundScreen
