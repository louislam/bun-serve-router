import { describe, expect, test, beforeAll } from "bun:test";
import {Router} from "./router.ts";

beforeAll(() => {
    // setup tests
});

describe("Test router", () => {

    test("normal case", async () => {
        const request = new Request("https://example.com", {
            method: "GET",
        });

        const router = new Router();

        router.add("GET", "/", (request, params) => {
            return new Response("Hello!!!!");
        });

        const response = router.match(request);

        expect(response).toBeInstanceOf(Response);

        if (response) {
            expect(response.status).toBe(200);
            expect(await response.text()).toBe("Hello!!!!");
        }
    });

    test("normal case with params", async () => {

        const request = new Request("https://example.com/foo/bar", {
            method: "GET",
        });

        const router = new Router();

        router.add("GET", "/foo/:id", (request, params) => {
            return new Response(params.id);
        });

        const response = router.match(request);

        expect(response).toBeInstanceOf(Response);

        if (response) {
            expect(response.status).toBe(200);
            expect(await response.text()).toBe("bar");
        }
    });

    test("Test not match", async () => {
            const request = new Request("https://example.com/foo22222", {
                method: "GET",
            });

            const router = new Router();

            router.add("GET", "/foo", (request, params) => {
                return new Response("Hello!!!!");
            });

            const response = router.match(request);

            expect(response).toBeUndefined();
    });

    test("Test match, but return 404", async () => {
            const request = new Request("https://example.com", {
                method: "GET",
            });

            const router = new Router();

            router.add("GET", "/", (request, params) => {
                return new Response("Hello!!!! Sorry not found!", {
                    status: 404,
                });
            });

            const response = router.match(request);

            expect(response).toBeInstanceOf(Response);

            if (response) {
                expect(response.status).toBe(404);
                expect(await response.text()).toBe("Hello!!!! Sorry not found!");
            }
    });

    test("Test match pattern, but different method", async () => {
        const request = new Request("https://example.com", {
            method: "GET",
        });

        const router = new Router();

        router.add("POST", "/", (request, params) => {
            return new Response("You should not see this!");
        });

        const response = router.match(request);

        expect(response).toBeUndefined();
    });

    test("Test match same pattern, multiple methods", async () => {
        const request = new Request("https://example.com", {
            method: "GET",
        });

        const request2 = new Request("https://example.com", {
            method: "POST",
        });

        const router = new Router();

        router.add("GET", "/", (request, params) => {
            return new Response("1");
        });

        router.add("POST", "/", (request, params) => {
            return new Response("2");
        });

        const response = router.match(request);

        expect(response).toBeInstanceOf(Response);

        if (response) {
            expect(response.status).toBe(200);
            expect(await response.text()).toBe("1");
        }

        const response2 = router.match(request2);

        expect(response2).toBeInstanceOf(Response);

        if (response2) {
            expect(response2.status).toBe(200);
            expect(await response2.text()).toBe("2");
        }

    });
});
