import RequestService from "./requestService";

class UserService {

	static getUsersList(url, offset, limit, currentOptions) {
		const options = {
			offset,
			limit,
			...currentOptions
		};
		return RequestService.get(options.point, options);
	}
}

export default UserService;