export enum APIPath {
    AUTH_REGISTER = "/api/auth/signup",
    AUTH_LOGIN = "/api/auth/signin",
    AUTH_CHANGE_PASSWORD = "/api/auth/change-password",
    AUTH_FORGOT_PASSWORD = "/api/auth/forgot-password",
    AUTH_RESET_PASSWORD = "/api/auth/reset-password",

    // Customer
    USER_GETALL = "/api/dstuser/getall",
    USER_CRE = "/api/dstuser/cre",
    DISTRIBUTOR_GETALL = "/api/dstuser/distributors",
    USER_SEARCH = "/api/dstuser/filterData",
    USER_INQ = "/api/dstuser/inq",
    USER_UPD = "/api/dstuser/upd",
    USER_APPROVE = "/api/dstuser/approve",

    ROLE_GETALL = "/api/v1/uam/role/getAll",
    // USER_GETALL = "/api/v1/uam/user/getAll",
    USER_AUTHENTICATE = "/api/v1/uam/otp/authenticate",
    FORGOT_PASSWORD = "/api/auth/forgot-password",
    USER_EDIT = "",
    // USER_CRE = "",
    FILE_UPLOAD = "",
    USER_VIEW = "",

    COMMISSON_CRE = "/api/commission/cre",
    COMMISSON_INQ = "/api/commission/inq",
    COMMISSON_UPD = "/api/commission/upd",
    COMMISSON_DEL = "/api/commission/cre",
    COMMISSON_GETALL = "/api/commission/getall",
    COMMISSON_SEARCH = "/api/commission/filterData",

    CARD_TRANSACTION_HISTORY = "/api/payment/getall",
    CARD_TRANSACTION_VIEW = "/api/payment/inq",
    COMMISSON_REPORT = "/api/payment/commission",
    MAKE_PAYMENT = "/api/payment/create-payment"
}
