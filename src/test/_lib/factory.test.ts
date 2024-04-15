import { Controller } from "@/app/_lib/controller";
import { Converter } from "@/app/_lib/converter";
import { Factory } from "@/app/_lib/factory";
import { Validator } from "@/app/_lib/validator";
import { View } from "@/app/_lib/view";
import { describe, expect, jest, test } from "@jest/globals";

describe("Factory", () => {

    describe("createController", () => {

        test("Controllerインスタンスを生成できること。", () => {

            const setWasValidated = jest.fn();
            const setInvalidFeedback = jest.fn();
            const setResultDto = jest.fn();

            const converter = new Converter();
            const validator = new Validator();
            const view = new View(setWasValidated, setInvalidFeedback);

            const expectedController = new Controller(converter, validator, view, setResultDto);

            const actualController = Factory.createController(setWasValidated, setInvalidFeedback, setResultDto);

            expect(actualController).toEqual(expectedController);
        });
    });
});
