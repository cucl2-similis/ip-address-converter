"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Char, IpAddress } from "../_lib/const";
import { Factory } from "../_lib/factory";
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
  const inputIpv4Ref = useRef<HTMLInputElement>(null);
  const inputCidrRef = useRef<HTMLInputElement>(null);

  const [wasValidated, setWasValidated] = useState(false);
  const [invalidFeedback, setInvalidFeedback] = useState(Char.EMPTY);
  const [defaultCidr, setDefaultCidr] = useState(IpAddress.BIT_STR_ZERO);

  const factory = Factory.createFactory(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);
  const controller = factory.getController();
  const view = factory.getView();

  return (
    <form ref={formElementRef}
          className={"needs-validation" + (wasValidated ? Char.SPACE + "was-validated" : Char.EMPTY)}
          onSubmit={formEvent => formEvent.preventDefault()}
          noValidate>
      <div className="my-3 p-3 border rounded">
        <h4>Form</h4>
        <div className="row gy-2">
          <div className="col-md-3 col-lg-2">
            <label className="col-form-label" htmlFor="ipv4">IP Address</label>
            <span> / </span>
            <label className="col-form-label" htmlFor="cidr">CIDR</label>
          </div>
          <div className="col-9 col-md-4 col-lg-3 px-md-0">
            <div className="input-group has-validation">
              <input onInput={() => view.updateDefaultCidrBasedOn(inputIpv4Ref.current?.value)}
                     ref={inputIpv4Ref} id="ipv4" className="form-control w-50" type="text" placeholder="0.0.0.0" />
              <span className="input-group-text">/</span>
              <input ref={inputCidrRef} id="cidr" className="form-control" type="text" placeholder={defaultCidr} />
              {invalidFeedback === Char.EMPTY ? <div className="valid-feedback">OK</div>
                                              : <div className="invalid-feedback">{invalidFeedback}</div>}
            </div>
          </div>
          <div className="col-auto pt-2 pt-md-0">
            <div className="d-flex gap-3 gap-md-2">
              <button className="btn btn-primary"
                      type="submit"
                      onClick={() => controller.convert(formElementRef.current, inputIpv4Ref.current, inputCidrRef.current, defaultCidr)}>
                Convert
              </button>
              <button className="btn btn-outline-primary"
                      type="button"
                      onClick={() => controller.clear(inputIpv4Ref.current, inputCidrRef.current)}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
