"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeParser = exports.pendingConfirmationResponse = exports.failureResponse = exports.successResponse = exports.customResponse = void 0;
const bson_1 = require("bson");
const logger_1 = require("./logger");
const constants_1 = require("../../constants");
const logger = (0, logger_1.createLogger)({ fileName: "Response" });
/**
 * sending custom response
 * @param res
 * @param status
 * @param body
 */
const customResponse = (res, status, body) => {
    return res.status(status).send((0, exports.safeParser)(Object.assign(Object.assign({}, body), { data: (body === null || body === void 0 ? void 0 : body.data) || {} })));
};
exports.customResponse = customResponse;
/**
 * send success response
 * @param resInfo
 */
const successResponse = (resInfo) => {
    logger.debug('Sending success response');
    return (0, exports.customResponse)(resInfo.res, resInfo.status || 200, resInfo.body || {});
};
exports.successResponse = successResponse;
/**
 * sending error response
 * @param resInfo
 */
const failureResponse = (resInfo) => {
    var _a;
    logger.debug('Sending error response');
    return (0, exports.customResponse)(resInfo.res, resInfo.status || 500, Object.assign(Object.assign({}, resInfo.body), { message: ((_a = resInfo === null || resInfo === void 0 ? void 0 : resInfo.body) === null || _a === void 0 ? void 0 : _a.message) || constants_1.ERROR_MESSAGES.UNEXPECTED_PROCESSING_ERROR }));
};
exports.failureResponse = failureResponse;
const pendingConfirmationResponse = (resInfo) => {
    logger.debug('Sending accepted response.Need to fulfill more actions to complete the main action.');
    return (0, exports.customResponse)(resInfo.res, resInfo.status || 202, resInfo.body || {});
};
exports.pendingConfirmationResponse = pendingConfirmationResponse;
/**
 * safe parsing the response body
 */
const safeParser = (body) => {
    return bson_1.EJSON.parse(bson_1.EJSON.stringify(body));
};
exports.safeParser = safeParser;
