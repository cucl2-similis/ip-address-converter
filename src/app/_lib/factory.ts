import { Dispatch, SetStateAction } from "react";
import { Controller } from "./controller";
import { ResultDto } from "./result-dto";
import { Validator } from "./validator";
import { View } from "./view";

/**
 * ファクトリー
 */
export class Factory {

    private constructor() { }

    /**
     * コントローラ生成
     * @param setWasValidated `was-validated`クラス設定要否boolean用 stateセッタ関数
     * @param setInvalidFeedback `invalid-feedback`クラス要素内容文字列用 stateセッタ関数
     * @param setResultDto 変換結果DTO用 stateセッタ関数
     * @returns コントローラ
     */
    public static createController(setWasValidated: Dispatch<SetStateAction<boolean>>,
                                   setInvalidFeedback: Dispatch<SetStateAction<string>>,
                                   setResultDto: Dispatch<SetStateAction<ResultDto | null>>): Controller {

        return new Controller(new Validator(),
                              new View(setWasValidated, setInvalidFeedback),
                              setResultDto);
    }
}
