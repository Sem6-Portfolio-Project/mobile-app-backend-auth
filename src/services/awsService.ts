import { createLogger, CustomLogger } from "../helpers/lib/logger";

const logger: CustomLogger = createLogger({ fileName: "AwsService" });

export class AwsService {
    protected readonly client;
    protected readonly serviceName: string;

    constructor(serviceName: string, client: any) {
        this.client = client;
        this.serviceName= serviceName;
    }

    /**
     * execute the aws command
     * @param cmd
     * @param cmdName
     */
    executeCommand(cmd:any, cmdName:string) {
        logger.debug(
            "Executing %s command: %s with input: %s",
            this.serviceName,
            cmd,
            JSON.stringify(cmd.input)
        )
        return this.client.send(cmd);
    }
}