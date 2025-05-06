import { Server as __Server, type ServerErrorResponse, type ServerOptions as __ServerOptions, type UntypedServiceImplementation } from "@grpc/grpc-js";
import type { ServiceDefinition } from "@grpc/proto-loader";
/**
 * gRPC format error.
 */
export type GrpcFormatError = (e: unknown) => ServerErrorResponse;
/**
 * gRPC logger.
 */
export type GrpcLogger = {
    debug: (message: string) => void;
    error: (e: unknown, message: string) => void;
    info: (message: string) => void;
    warn: (message: string) => void;
};
/**
 * gRPC server options.
 */
export interface ServerOptions extends __ServerOptions {
    formatError?: GrpcFormatError;
    logger?: GrpcLogger;
}
/**
 * gRPC server.
 *
 */
export declare class Server extends __Server {
    private formatError?;
    private logger?;
    /**
     * Constructor.
     */
    constructor(options?: ServerOptions);
    /**
     * Add a service to the gRPC server.
     */
    addService(service: ServiceDefinition, implementation: UntypedServiceImplementation): void;
    /**
     * Handle the gRPC call.
     */
    private handler;
}
//# sourceMappingURL=index.d.ts.map