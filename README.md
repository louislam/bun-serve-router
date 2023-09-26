# bun-serve-router

A very simple router implementation for `bun.serve()` using [URL Pattern API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern). 

No fancy, just works.

- Supports URL patterns such as `/user/:id`
- Using the standard API:
  - [URL Pattern API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern) to match your routes
  - [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - `Request` and `Response`

## How to Use

Install the dependency:

```bash
bun add bun-serve-router
```

Import and add your routes:

```typescript
import {Router} from "bun-serve-router";
const router = new Router();
router.add("GET", "/", (request, params) => {
    return new Response("Hello World!");
})
```

In the `fetch` handler of `Bun.server()`, you can match your routes like this:

```typescript
const response = router.match(request);
```

Since it is possible that no route matches, you should check if `response` is not `underfined` before returning it:

```typescript
if (response) {
    return response;
}
```

## Full Examples

```typescript
import {Router} from "bun-serve-router";

const router = new Router();

// Add your routes
router.add("GET", "/", (request, params) => {
    return new Response("Hello World!");
})

Bun.serve({
    fetch(request) {
        // Match here
        const response = router.match(request);
        if (response) {
            return response;
        }

        // Return 404 if no route matches
        return new Response("404 Not Found", { status: 404 });
    },
});
```

## Advanced Usage

### Params

```typescript
router.add("GET", "/hello/:myName", (request, params) => {
    return new Response("Hello " + params.myName);
})
```

### URLPatternResult

The third parameter is the `URLPatternResult` object.

Check the [URL Pattern API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern) for more information.

```typescript
router.add("GET", "/hello/:myName", (request, params, urlPatternResult) => {
    return new Response("Hello " + params.myName);
})
```

### Others

It is actually a very standalone router. It is actually not limited to `bun.serve()`. As long as your application is using the Fetch API, it should be working too. 

