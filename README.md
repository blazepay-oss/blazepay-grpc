# 🌐 `gRPC` server for Blazepay

Designed as a drop-in replacement for `@grpc/grpc-js`.

Inspired on [grpc-middleware@1.0.0](https://www.npmjs.com/package/grpc-middleware)

## Using the package

Build your grpc server as usual. However, import like this:

```ts
import { Server } from "@blazepay-oss/blazepay-grpc";
```

The call to `grpc.ServerOptions` can now take up to two additional arguments.

```ts
const server = new Server({
  formatError: (e: Readonly<ServerErrorResponse>) => ServerErrorResponse,
  logger: {
    debug: (message: string) => console.debug(message),
    error: (e: ServerErrorResponse, message: string) => console.error(e, message),
    info: (message: string) => console.info(message),
    warn: (message: string) => console.warn(message)
  }
});
```

## Limitations

This package has only been tested with Server/Unary calls. It has not been tested with client streaming, server streaming, or bidirectional calls.
