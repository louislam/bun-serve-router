import {URLPattern} from "urlpattern-polyfill";

export class Router {
    private routeList : Route[] = [];

    add(method : string, pattern : string, handler : Handler) : void {
        method = method.toUpperCase();
        const route = new Route(method, new URLPattern({
            pathname: pattern,
        }), handler);
        this.routeList.push(route);
    }

    match(request : Request) {
        for (const route of this.routeList) {
            if (request.method === route.method) {
                const result = route.urlPattern.exec(request.url);
                if (result) {
                    return route.handler(request, result.pathname.groups, result);
                }
            }
        }
    }
}

export type URLPatternResultParams = { [key: string]: string | undefined; };
type Handler = (request : Request, params : URLPatternResultParams, urlPatternResult : URLPatternResult) => Response;

class Route {
    constructor(
        public method : string,
        public urlPattern : URLPattern,
        public handler : Handler
    ) {}
}
