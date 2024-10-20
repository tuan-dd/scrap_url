package response

const (
	OK         = 1
	CREATED    = 2
	NO_CONTENT = 3

	// error
	INTERNAL_SERVER_ERROR    = 0
	DATABASE_ERROR           = -1
	CONNECTION_SERVICE_ERROR = -2
	BAD_REQUEST_INPUT        = -3
	BAD_REQUEST_FILE_FORMAT  = -4
	BAD_REQUEST_DATE_FORMAT  = -5
	INVALID_REQUEST          = -6
	MISS_FIELD_HEADER        = -7
	UNAUTHORIZED             = -8
	INVALID_TOKEN            = -9
	TOKEN_EXPIRES            = -10
	BANNED_OR_FORBIDDEN      = -11
	IP_ADDRESS_FORBIDDEN     = -12
	NO_SERVICE               = -13
	NOT_FOUND                = -14
	ROUTE_NOT_FOUND          = -15
	DUPLICATE_DATA           = -16
)

// message

var MsgResponse = map[int]string{
	OK:         "OK",
	CREATED:    "CREATED",
	NO_CONTENT: "NO_CONTENT",

	// error
	INTERNAL_SERVER_ERROR:    "INTERNAL_SERVER_ERROR",
	DATABASE_ERROR:           "DATABASE_ERROR",
	CONNECTION_SERVICE_ERROR: "CONNECTION_SERVICE_ERROR",
	BAD_REQUEST_INPUT:        "BAD_REQUEST_INPUT",
	BAD_REQUEST_FILE_FORMAT:  "BAD_REQUEST_FILE_FORMAT",
	BAD_REQUEST_DATE_FORMAT:  "BAD_REQUEST_DATE_FORMAT",
	INVALID_REQUEST:          "INVALID_REQUEST",
	MISS_FIELD_HEADER:        "MISS_FIELD_HEADER",
	UNAUTHORIZED:             "UNAUTHORIZED",
	INVALID_TOKEN:            "INVALID_TOKEN",
	TOKEN_EXPIRES:            "TOKEN_EXPIRES",
	BANNED_OR_FORBIDDEN:      "BANNED_OR_FORBIDDEN",
	IP_ADDRESS_FORBIDDEN:     "IP_ADDRESS_FORBIDDEN",
	NO_SERVICE:               "NO_SERVICE",
	NOT_FOUND:                "NOT_FOUND",
	ROUTE_NOT_FOUND:          "ROUTE_NOT_FOUND",
	DUPLICATE_DATA:           "DUPLICATE_DATA",
}

var StatusCode = map[int]int{
	OK:         200,
	CREATED:    201,
	NO_CONTENT: 204,

	// error
	INTERNAL_SERVER_ERROR:    500,
	DATABASE_ERROR:           500,
	CONNECTION_SERVICE_ERROR: 500,
	BAD_REQUEST_INPUT:        400,
	BAD_REQUEST_FILE_FORMAT:  400,
	BAD_REQUEST_DATE_FORMAT:  400,
	INVALID_REQUEST:          400,
	MISS_FIELD_HEADER:        400,
	UNAUTHORIZED:             401,
	INVALID_TOKEN:            401,
	TOKEN_EXPIRES:            401,
	BANNED_OR_FORBIDDEN:      403,
	IP_ADDRESS_FORBIDDEN:     403,
	NOT_FOUND:                404,
	NO_SERVICE:               404,
	ROUTE_NOT_FOUND:          404,
	DUPLICATE_DATA:           409,
}