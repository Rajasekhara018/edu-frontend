export enum APIPath {
    AUTH_REGISTER = "/api/auth/signup",
    COURSE_REGISTER = "/api/auth/courseSignup",
    AUTH_LOGIN = "/api/auth/signin",

    // Customer
    CUSTOMER_GETALL = "/api/dstuser/getall",
    CUSTOMER_CRE = "/api/dstuser/cre",
    CUSTOMER_SEARCH = "/api/dstuser/filterData",
    CUSTOMER_INQ = "/api/dstuser/inq",
    CUSTOMER_UPD = "/api/dstuser/upd",

    ROLE_GETALL = "/api/v1/uam/role/getAll",
    USER_GETALL = "/api/v1/uam/user/getAll",
    USER_AUTHENTICATE = "/api/v1/uam/otp/authenticate",
    FORGOT_PASSWORD = "",
    USER_EDIT = "",
    USER_CRE = "",
    FILE_UPLOAD = "",
    USER_VIEW = ""
}
