class User {
	constructor(catId, id, email, phone, adress, role) {
		this.catId = catId
		this.id = id
		this.email = email
		this.phone = phone ? phone : null
		this.adress = adress ? adress : null
		this.role = role
	}
}

export default User
