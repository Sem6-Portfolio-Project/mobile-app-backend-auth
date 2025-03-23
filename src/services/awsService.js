"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsService = void 0;
const logger_1 = require("../helpers/lib/logger");
const logger = (0, logger_1.createLogger)({ fileName: "AwsService" });
class AwsService {
    constructor(serviceName, client) {
        this.client = client;
        this.serviceName = serviceName;
    }
    /**
     * execute the aws command
     * @param cmd
     * @param cmdName
     */
    executeCommand(cmd, cmdName) {
        logger.debug("Executing %s command: %s with input: %s", this.serviceName, cmd, JSON.stringify(cmd.input));
        return this.client.send(cmd);
    }
}
exports.AwsService = AwsService;
