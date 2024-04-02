"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Symbol } from "../_lib/const";
import { Controller } from "../_lib/controller";
import { ResultDto } from "../_lib/result-dto";

/**
 * フォームコンポーネント  
 * 入力フォーム要素 `<form>・・・</form>` を返却する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.setResultDto 変換結果DTO用 stateセッタ関数
 * @returns 入力フォーム要素 `<form>・・・</form>`
 */
export function Form({
  setResultDto
}: Readonly<{
  setResultDto: Dispatch<SetStateAction<ResultDto | null>>;
}>): JSX.Element {

  const formElementRef = useRef<HTMLFormElement>(null);
  const inputElementRef = useRef<HTMLInputElement>(null);

  const [wasValidated, setWasValidated] = useState(false);
  const [invalidFeedback, setInvalidFeedback] = useState(Symbol.EMPTY);

  const controller = new Controller(setWasValidated, setInvalidFeedback, setResultDto);

  return (
    <form ref={formElementRef}
          className={"needs-validation" + (wasValidated && Symbol.SPACE + "was-validated")}
          onSubmit={formEvent => formEvent.preventDefault()}
          noValidate>
      <div className="my-3 p-3 border">
        <h4>Form</h4>
        <div className="row g-3">
          <div className="col-md-3 col-lg-2">
            <label className="col-form-label" htmlFor="ip-address">IP Address / CIDR</label>
          </div>
          <div className="col-8 col-md-4 col-lg-3">
            <input ref={inputElementRef} id="ip-address" className="form-control" type="text" placeholder="0.0.0.0/0" />
            <div className="valid-feedback">OK</div>
            <div className="invalid-feedback">{invalidFeedback}</div>
          </div>
          <div className="col-auto">
            <button className="btn btn-primary"
                    type="submit"
                    onClick={() => controller.convert(formElementRef.current, inputElementRef.current)}>
              Convert
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
