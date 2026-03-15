export enum APIPath {
    AUTH_REGISTER = "/api/auth/signup",
    AUTH_LOGIN = "/api/auth/signin",
    AUTH_CHANGE_PASSWORD = "/api/auth/change-password",
    AUTH_FORGOT_PASSWORD = "/api/auth/forgot-password",
    AUTH_RESET_PASSWORD = "/api/auth/reset-password",

    // Customer
    CUSTOMER_GETALL = "/api/dstuser/getall",
    CUSTOMER_CRE = "/api/dstuser/cre",
    DISTRIBUTOR_GETALL = "/api/dstuser/distributors",
    CUSTOMER_SEARCH = "/api/dstuser/filterData",
    CUSTOMER_INQ = "/api/dstuser/inq",
    CUSTOMER_UPD = "/api/dstuser/upd",
    CUSTOMER_APPROVE = "/api/dstuser/approve",

    ROLE_GETALL = "/api/v1/uam/role/getAll",
    USER_GETALL = "/api/v1/uam/user/getAll",
    USER_AUTHENTICATE = "/api/v1/uam/otp/authenticate",
    FORGOT_PASSWORD = "/api/auth/forgot-password",
    USER_EDIT = "",
    USER_CRE = "",
    FILE_UPLOAD = "",
    USER_VIEW = "",

    COMMISSON_CRE = "/api/commission/cre",
    COMMISSON_INQ = "/api/commission/inq",
    COMMISSON_UPD = "/api/commission/upd",
    COMMISSON_DEL = "/api/commission/cre",
    COMMISSON_GETALL = "/api/commission/getall",
    COMMISSON_SEARCH = "/api/commission/filterData"
}
