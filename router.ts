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

    async match(request : Request) {
        for (const route of this.routeList) {
            if (request.method === route.method) {
                const result = route.urlPattern.exec(request.url);
                if (result) {
                    let r = route.handler(request, result.pathname.groups, result);

                    if (r instanceof Response) {
                        return r;
                    } else {
                        return await r;
                    }
                }
            }
        }
    }
}

export type URLPatternResultParams = { [key: string]: string | undefined; };
type Handler = (request : Request, params : URLPatternResultParams, urlPatternResult : URLPatternResult) => Response | Promise<Response>

class Route {
    constructor(
        public method : string,
        public urlPattern : URLPattern,
        public handler : Handler
    ) {}
}
