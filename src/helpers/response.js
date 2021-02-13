function createResponse(
	data,
	statusCode,
	update = false,
	disabled = false,
	error = false
) {
	if (!error) error = {};
	if (!data) data = {};
	let statusMessage = "";
	switch (statusCode) {
		case 200:
			statusMessage = "ok";
			break;
		case 201:
			statusMessage = "created";
			break;
		case 400:
			statusMessage = "bad request";
			break;
		case 401:
			statusMessage = "unauthorized";
			break;
		case 404:
			statusMessage = "not found";
			break;
		case 409:
			statusMessage = "conflict";
			break;
		case 422:
			statusMessage = "unprocessable entity";
			break;
		case 500:
			statusMessage = "internal server error";
			break;
		default:
			statusMessage = "internal server error";
	}
	return {
		data,
		statusCode,
		statusMessage,
		update,
		disabled,
		error
	};
}

exports.createResponse = createResponse;
