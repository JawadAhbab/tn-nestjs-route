## Server

### `HelloController.ts`

```ts
class BodySuper {
  @RouteBody() one: string
  @RouteBody() two: number
}

@Route('user')
class HelloRoute {
  @RouteParam() username: string
  @RouteParam() age: number
  @RouteBody() count: number
  @RouteBody({ type: BodySuper }) super: BodySuper
  @RouteBody({ type: [BodySuper] }) supermore: BodySuper[]
  @RouteFile() file: Express.Multer.File
  @RouteFile() files: Express.Multer.File[]
}

class ResultSuper {
  @RouteResult() rone: string
  @RouteResult() rtwo: string
}

class HelloResult {
  @RouteResult() resone: string
  @RouteResult() restwo: string
  @RouteResult({ type: ResultSuper }) super: ResultSuper
}

@Controller()
export class HelloController {
  @RouteGet(HelloRoute, HelloResult)
  hello(@RouteFields() fields: HelloRoute): HelloResult {
    return { ... }
  }
}
```

### `Routes.ts`

```ts
@Controller()
export class RoutesController {
  @Get('/routes') routes() {
    return routeSchemaCreator(controllers)
  }
}
```

## Client

### `routes.json`

```json
{
  "site": "http://localhost:0000/",
  "schema": "http://localhost:0000/routes",
  "outpath": "..."
}
```

### Generate Routes

`routegen`
