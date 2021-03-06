import "@testing-library/jest-dom/extend-expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

import { Authorized } from "./Authorized";
import { useUser } from "./AuthProvider";

jest.mock("./AuthProvider");

const useUserMock = useUser as jest.MockedFunction<typeof useUser>;

afterEach(cleanup);

describe("Authorized", () => {
    test("should render children when user is signed in", async () => {
        // Arrange
        useUserMock.mockImplementation(() => ({
            id: "id",
            accessToken: "some token",
            name: "some name",
            email: "some@email.com",
            role: "some role",
        }));
        const content = "hello, world";

        // Act
        render(
            <Authorized><p data-testid="assert">{content}</p></Authorized>
        );

        // Assert
        expect(await screen.findByTestId("assert")).toHaveTextContent(content);
    });

    test("should render children when user is signed in and the given role does match", async () => {
        // Arrange
        const role = "some role";
        useUserMock.mockImplementation(() => ({
            id: "id",
            accessToken: "some token",
            name: "some name",
            email: "some@email.com",
            role,
        }));
        const content = "hello, world";

        // Act
        render(
            <Authorized role={role}><p data-testid="assert">{content}</p></Authorized>
        );

        // Assert
        expect(await screen.findByTestId("assert")).toHaveTextContent(content);
    });

    test("should not render children when user is signed in but the given role doesn't match", () => {
        // Arrange
        useUserMock.mockImplementation(() => ({
            id: "id",
            accessToken: "some token",
            name: "some name",
            email: "some@email.com",
            role: "some role",
        }));

        // Act
        render(
            <Authorized role="some other role"><p data-testid="assert">hello, world</p></Authorized>
        );

        // Assert
        expect(screen.queryByTestId("assert")).toBeNull();
    });

    test("should not render children when user is signed out", () => {
        // Arrange
        useUserMock.mockImplementation(() => false);

        // Act
        render(
            <Authorized><p data-testid="assert">hello, world</p></Authorized>
        );

        // Assert
        expect(screen.queryByTestId("assert")).toBeNull();
    });

    test("should not render children when user is signing in or out", () => {
        // Arrange
        useUserMock.mockImplementation(() => undefined);

        // Act
        render(
            <Authorized><p data-testid="assert">hello, world</p></Authorized>
        );

        // Assert
        expect(screen.queryByTestId("assert")).toBeNull();
    });
});
