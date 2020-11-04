import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'

const SearchBar = (props) => {
	return (
		<View style={styles.barHolder}>
			<TextInput
				autoCapitalize='none'
				autoCorrect={false}
				clearButtonMode='always'
				value={props.searchValue}
				onChangeText={props.onSearch}
				placeholder='Быстрый поиск в разделе..'
				style={styles.input}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	barHolder: {
		backgroundColor: '#fff',
		padding: 10,
		marginTop: 10,
		marginHorizontal: 10,
		borderRadius: 14,
	},
	input: { backgroundColor: '#fff', paddingHorizontal: 10 },
})

export default SearchBar
