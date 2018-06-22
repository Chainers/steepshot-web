class DateFormatter {
	static converISOtoCustom(date) {
		date = new Date(date);
		return formatDate(date)
	}
}

export default DateFormatter;

function formatDate(date) {
	let monthNames = [
		"Jan", "Feb", "Mar",
		"Apr", "May", "Jun", "Jul",
		"Aug", "Sept", "Oct",
		"Nov", "Dec"
	];

	let day = date.getDay();
	let monthIndex = date.getMonth();
	let year = date.getFullYear();

	return day + ' ' + monthNames[monthIndex] + ' ' + year;
}