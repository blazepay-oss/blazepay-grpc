import {
  Server as __Server,
  type ServerErrorResponse,
  type ServerOptions as __ServerOptions,
  type UntypedHandleCall,
  type UntypedServiceImplementation,
} from "@grpc/grpc-js";
import type { ServiceDefinition } from "@grpc/proto-loader";

/**
 * gRPC format error.
 */
export type GrpcFormatError = (
  e: Readonly<ServerErrorResponse>
) => ServerErrorResponse;

/**
 * gRPC logger.
 */
export type GrpcLogger = {
  debug: (message: string) => void;
  error: (e: ServerErrorResponse, message: string) => void;
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
export class Server extends __Server {
  private formatError?: GrpcFormatError;
  private logger?: GrpcLogger;

  /**
   * Constructor.
   */
  constructor(options?: ServerOptions) {
    const { formatError, logger, ...serverOptions } = options || {};

    super(serverOptions);
    this.formatError = formatError;
    this.logger = logger;
  }

  /**
   * Add a service to the gRPC server.
   */
  addService(
    service: ServiceDefinition,
    implementation: UntypedServiceImplementation
  ): void {
    const proxies: UntypedServiceImplementation = {};

    for (const key in implementation) {
      proxies[key] = async (call: any, callback: any) => {
        await this.handler(call, callback, implementation[key]);
      };
    }

    this.logger?.debug(`Adding service ${service} to gRPC server`);
    super.addService(service, proxies);
  }

  /**
   * Handle the gRPC call.
   */
  private async handler(
    call: any,
    callback: any,
    implementation: UntypedHandleCall
  ) {
    try {
      await Promise.resolve(
        implementation(call, (e: any, ...args: [any]) => {
          if (e instanceof Error) {
            let formattedError: ServerErrorResponse = { ...e, code: 13 };

            this.logger?.error(
              formattedError,
              "An error occurred while handling the gRPC call"
            );

            if (this.formatError) {
              formattedError = this.formatError(e);
            }
          }

          callback(e, ...args);
        })
      );
    } catch (e) {
      let formattedError: ServerErrorResponse = { ...(e as Error), code: 13 };

      this.logger?.error(
        formattedError,
        "An error occurred while handling the gRPC call"
      );

      if (this.formatError) {
        formattedError = this.formatError(e as Error);
      }

      callback(formattedError, null);
    }
  }
}
