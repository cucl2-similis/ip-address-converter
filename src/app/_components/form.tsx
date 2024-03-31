"use client";

import { Dispatch, MutableRefObject, SetStateAction, useRef } from "react";
import { ResultDto } from "../_lib/result-dto";
import { Controller } from "../_lib/controller";

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

  const controller = new Controller();
  const inputElementRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

  return (
    <form onSubmit={formEvent => formEvent.preventDefault()}>
      <div className="my-3 p-3 border">
        <h4>Form</h4>
        <div className="row g-3">
          <div className="col-md-3 col-lg-2">
            <label className="col-form-label" htmlFor="ip-address">IP Address / CIDR</label>
          </div>
          <div className="col-8 col-md-4 col-lg-3">
            <input ref={inputElementRef} id="ip-address" className="form-control" type="text" placeholder="0.0.0.0/0" required />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary"
                    type="submit"
                    onClick={() => controller.convert(inputElementRef.current, setResultDto)}>
              Convert
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
