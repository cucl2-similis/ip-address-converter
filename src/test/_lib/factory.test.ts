import { Controller } from "@/app/_lib/controller";
import { Converter } from "@/app/_lib/converter";
import { Factory } from "@/app/_lib/factory";
import { Validator } from "@/app/_lib/validator";
import { View } from "@/app/_lib/view";
import { describe, expect, jest, test } from "@jest/globals";

describe("Factory", () => {

    const setWasValidated = jest.fn();
    const setInvalidFeedback = jest.fn();
    const setDefaultCidr = jest.fn();
    const setResultDto = jest.fn();

    describe("createFactory", () => {

        test("Factoryインスタンスを生成できること。", () => {

            const factory = Factory.createFactory(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);

            expect(factory).toBeInstanceOf(Factory);
        });
    });

    describe("getController", () => {

        test("Controllerインスタンスを取得できること。", () => {

            const converter = new Converter();
            const validator = new Validator();
            const view = new View(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);
            const expectedController = new Controller(converter, validator, view);

            const factory = Factory.createFactory(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);
            const actualController = factory.getController();

            expect(actualController).toEqual(expectedController);
        });
    });

    describe("getView", () => {

        test("Viewインスタンスを取得できること。", () => {

            const expectedView = new View(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);

            const factory = Factory.createFactory(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);
            const actualView = factory.getView();

            expect(actualView).toEqual(expectedView);
        });
    });
});
