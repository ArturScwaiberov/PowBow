import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, TouchableOpacity, Platform, TouchableNativeFeedback, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

import CategoryItem from '../../components/shop/CategoryItem'
import ErrorMessage from '../../components/UI/ErrorMessage'
import Slider from '../../components/UI/Slider'
import * as categoriesActions from '../../store/actions/categories'
import * as userRealtimeActions from '../../store/actions/users'

const CategoriesOverviewScreen = (props) => {
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [error, setError] = useState()
	const lang = i18next.language
	const categories = useSelector((state) => state.categories.availableCategories)
	const dispatch = useDispatch()
	const { t, i18n } = useTranslation()
	const viewCategoryHandler = (id, title, titleKg, lang) => {
		props.navigation.navigate('Home', {
			categoryId: id,
			categoryTitle: title,
			categoryTitleKg: titleKg,
			lang,
		})
	}

	let TouchableCmp = TouchableOpacity

	if (Platform.OS === 'android' && Platform.Version >= 21) {
		TouchableCmp = TouchableNativeFeedback
	}

	const loadCategories = useCallback(async () => {
		setError(null)
		setIsRefreshing(true)

		try {
			await dispatch(categoriesActions.fetchCategories(t('categories.errorMessageFetch')))
			await dispatch(userRealtimeActions.fetchUserData(t('categories.errorMessageFetchUser')))
			setIsRefreshing(false)
		} catch (err) {
			setError(err)
			setIsRefreshing(false)
		}
	}, [])

	useEffect(() => {
		const willFocusSub = props.navigation.addListener('focus', () => {
			loadCategories()
		})

		return willFocusSub
	}, [])

	if (error) {
		Alert.alert(t('categories.errorTitle'), t('categories.errorMessageFetchUser'), [{ text: 'Ок' }])
		setError(null)
		return <ErrorMessage onReload={loadCategories} />
	}

	return (
		<>
			<FlatList
				onRefresh={loadCategories}
				refreshing={isRefreshing}
				columnWrapperStyle={{ paddingHorizontal: 2 }}
				data={categories}
				horizontal={false}
				numColumns={2}
				keyExtractor={(item) => item.id}
				renderItem={(itemData) => (
					<CategoryItem
						item={itemData.item}
						lang={lang}
						onSelect={() => {
							viewCategoryHandler(
								itemData.item.id,
								itemData.item.title,
								itemData.item.titleKg,
								lang
							)
						}}
					/>
				)}
				ListHeaderComponent={<Slider navigation={props.navigation} />}
			/>
		</>
	)
}

export default CategoriesOverviewScreen
