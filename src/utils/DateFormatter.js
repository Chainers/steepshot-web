class DateFormatter {
	static convertISOtoCustom(date) {
		let monthNames = ["",
			"Jan", "Feb", "Mar",
			"Apr", "May", "Jun", "Jul",
			"Aug", "Sept", "Oct",
			"Nov", "Dec"
		];

		let result = date.split('T')[0].split('-');

		return result[2] + ' ' + monthNames[parseInt(result[1], 10)] + ' ' + result[0]
	}
}

export default DateFormatter;