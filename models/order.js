import moment from 'moment'
import 'moment/locale/ru'

class Order {
	constructor(id, items, totalAmount, date, status) {
		this.id = id
		this.items = items
		this.totalAmount = totalAmount
		this.date = date
		this.status = status
	}

	get readableDate() {
		/* return this.date.toLocaleDateString('ru-Ru', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}) */
		moment.locale('ru')
		return moment(this.date).format('LLL')
	}
}

export default Order
