import { status, Server as __Server, } from "@grpc/grpc-js";
/**
 * gRPC server.
 *
 */
export class Server extends __Server {
    formatError;
    logger;
    /**
     * Constructor.
     */
    constructor(options) {
        const { formatError, logger, ...serverOptions } = options || {};
        super(serverOptions);
        this.formatError = formatError;
        this.logger = logger;
    }
    /**
     * Add a service to the gRPC server.
     */
    addService(service, implementation) {
        const proxies = {};
        for (const key in implementation) {
            proxies[key] = async (call, callback) => {
                await this.handler(call, callback, implementation[key]);
            };
        }
        super.addService(service, proxies);
    }
    /**
     * Handle the gRPC call.
     */
    async handler(call, callback, implementation) {
        try {
            await Promise.resolve(implementation(call, (e, ...args) => {
                let formattedError = e;
                this.logger?.error(formattedError, "An error occurred while handling the gRPC call.");
                if (this.formatError) {
                    formattedError = this.formatError(e);
                }
                callback(e, ...args);
            }));
        }
        catch (e) {
            let formattedError = e;
            this.logger?.error(formattedError, "An error occurred while handling the gRPC callç");
            if (this.formatError) {
                formattedError = this.formatError(e);
            }
            callback(formattedError, null);
        }
    }
}
//# sourceMappingURL=index.js.map