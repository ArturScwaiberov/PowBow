import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import Colors from '../../constants/Colors'

const ErrorMessage = (props) => {
	return (
		<View style={styles.screen}>
			<Text>404 Произошла ошибка.. </Text>
			{props.onReload && (
				<Button title='Обновить' onPress={props.onReload} color={Colors.primary} />
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})

export default ErrorMessage
