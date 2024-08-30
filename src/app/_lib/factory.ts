import { Dispatch, SetStateAction } from "react";
import { Controller } from "./controller";
import { Converter } from "./converter";
import { ResultDto } from "./result-dto";
import { Validator } from "./validator";
import { View } from "./view";

/**
 * ファクトリー（インスタンス生成）
 */
export class Factory {

    /** コントローラ（ボタンイベント管理） */
    private readonly controller: Controller;

    /** コンバータ（変換ロジック） */
    private readonly converter: Converter;

    /** バリデータ（入力チェック） */
    private readonly validator: Validator;

    /** ビュー（画面表示制御） */
    private readonly view: View;

    /**
     * ファクトリー（インスタンス生成）
     * @param controller コントローラ（ボタンイベント管理）
     * @param converter コンバータ（変換ロジック）
     * @param validator バリデータ（入力チェック）
     * @param view ビュー（画面表示制御）
     */
    private constructor(controller: Controller,
                        converter: Converter,
                        validator: Validator,
                        view: View) {
        this.controller = controller;
        this.converter = converter;
        this.validator = validator;
        this.view = view;
    }

    /**
     * コントローラ取得
     * @returns コントローラ
     */
    public getController(): Controller {
        return this.controller;
    }

    /**
     * ビュー取得
     * @returns ビュー
     */
    public getView(): View {
        return this.view;
    }

    /**
     * ファクトリー生成
     * @param setWasValidated `was-validated`クラス設定要否boolean用 stateセッタ関数
     * @param setInvalidFeedback `invalid-feedback`クラス要素内容文字列用 stateセッタ関数
     * @param setDefaultCidr CIDRブロックデフォルト値用 stateセッタ関数
     * @param setResultDto 変換結果DTO用 stateセッタ関数
     * @returns ファクトリー
     */
    public static createFactory(setWasValidated: Dispatch<SetStateAction<boolean>>,
                                setInvalidFeedback: Dispatch<SetStateAction<string>>,
                                setDefaultCidr: Dispatch<SetStateAction<string>>,
                                setResultDto: Dispatch<SetStateAction<ResultDto | null>>): Factory {

        const view = new View(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);
        const validator = new Validator();
        const converter = new Converter();
        const controller = new Controller(converter, validator, view);

        return new Factory(controller, converter, validator, view);
    }
}
