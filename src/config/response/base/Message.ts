export default class Message {
	OK_MESSAGE = "Successfully.";
	DELETED_MESSAGE = "Deleted Successfully.";
	UPDATED_MESSAGE = "Updated Successfully.";
	CREATED_MESSAGE = "Successfully Created.";
	NO_CONTENT_MESSAGE = "No Content Found";
	FAILED_MESSAGE = "Failed";
	FAILURE_MESSAGE = "Failure";
	UNAUTHORIZED_MESSAGE = "Failed";
	INVALID_TYPE_MESSAGE = "Invalid Type of field";
	TOKEN_EXPIRED_MESSAGE = "The token provided has been expired.";
	FORBIDDEN_MESSAGE = "You do not have permission to do this action.";
	PERMISSION_MESSAGE = {
		PATCH: function (field) {
			return "You do not have permission to update `" + field + "` field.";
		}
	};
	FIELD_EMPTY            = 'The value of the field cannot be empty';
	REQUEST_FIELDS_EMPTY   = 'This action requires resource parameters (i.e.; resource fields) to be specified';
	RESOURCE_NOT_FOUND_MESSAGE     = 'Resource does not exist or has been removed';
	ACTION_FAILED          = 'The server failed to perform this action for unknown internal reason';
	AUTHENTICATION_FAILED  = 'Used authentication credentials are invalid';
	AUTHORIZATION_REQUIRED = 'Performing this action on this resource requires authorization';
	DELETION_FAILED        = 'The resource could not be deleted';
	FIELD_DUPLICATE        = 'The value of the field is already used for another resource';
	FORMAT_NOT_ACCEPTABLE  = 'Server is not capable of returning the requested format (only JSON is supported)';
	HTTPS_REQUIRED         = 'Sensitive information is to be sent - server requires HTTPS';
	METHOD_NOT_SUPPORTED   = 'HTTP method is not supported or is not allowed for the resource';
	RATE_LIMIT_REACHED     = 'The rate limit for this action was reached';
	URL_VERSION_MISSING    = 'Base URL must include REST API version';

	TOO_MANY_REQUEST_MESSAGE = "The rate limit for this action was reached.";
	NOT_FOUND_MESSAGE = "Resource does not exist or has been removed.";
	MASTER_SERVICE_ERROR_MESSAGE = "The resource you tried config is not available in master.";
	BAD_REQUEST_MESSAGE = "Something went wrong!! please try again.";
	FIELD_REQUIRED_MESSAGE = "This action requires the field to be specified.";
	FIELD_INVALID_MESSAGE = "The value of the field is invalid.";
	GENERIC_MESSAGE = "Something went wrong. Please try again or contact support.";
	FIELD_DUPLICATE_MESSAGE = "The value of the field is already used for another resource.";
	NOT_FOUND_SLUG_MESSAGE = "The request requires slug or orchestrator_url to be specified.";
	CONSENT_PENDING_MESSAGE = "The resource has not yet received the required action.";

	BUGSNAG_API_KEY_NOT_FOUND_MESSAGE = "BUGSNAG_API_KEY is required to initialize BUGSNAG.";

	SUCCESS_MESSAGE: any = {
		GET: this.OK_MESSAGE,
		POST: this.CREATED_MESSAGE,
		DELETE: this.DELETED_MESSAGE,
		PATCH: this.UPDATED_MESSAGE,
		PUT: this.OK_MESSAGE
	};
}
