## Server

### `HelloController.ts`

```ts
@Route('user')
class HelloRoute {
  @RouteParam() username: string
  @RouteParam() age: number
  @RouteParam() sex: string
  @RouteBody() count: number
  @RouteFile() file: Express.Multer.File
}

class HelloResult {
  @RouteResult() res: string
}

@Controller()
export class HelloController {
  @RouteGet(HelloRoute, HelloResult)
  hello(@RouteFields() fields: HelloRoute) {
    return { success: true }
  }
}
```

### `Routes.ts`

```ts
@Controller()
export class RoutesController {
  @Get('/routes')
  routes() {
    return routeSchemaCreator(controllers)
  }
}
```
