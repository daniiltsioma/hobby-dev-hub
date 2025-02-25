import request from "supertest";
import testApp from "./testApp";

describe("GET /dummy-db-search", () => {

    test("Should return all projects when no filters are applied", async () => {
        const response = await request(testApp).get("/dummy-db-search");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(3);
    });

    test("Should filter projects by title", async () => {
        const response = await request(testApp).get("/dummy-db-search?search=project 1");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe("Project 1");
    });

    test("Should filter projects by a single tag", async () => {
        const response = await request(testApp).get("/dummy-db-search?tags=React");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2); // Project 1 and 3 have React
    });

    test("Should filter projects by multiple tags", async () => {
        const response = await request(testApp).get("/dummy-db-search?tags=React,Node.js");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2); // Project 1 and 3 have React but 1 has Node.js aswell
    });

    test("Should return an empty array when no projects match", async () => {
        const response = await request(testApp).get("/dummy-db-search?search=Nonexistent");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
    })
});
