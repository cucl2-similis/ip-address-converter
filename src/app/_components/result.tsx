"use client";

import { useState } from "react";
import { Radio, Symbol } from "../_lib/const";
import { ResultDto } from "../_lib/result-dto";
import { RadioButton } from "./radio-button";

/**
 * 変換結果コンポーネント  
 * 変換結果表示用`div`要素を返却する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.resultDto 変換結果DTO state変数
 * @returns 変換結果表示用`div`要素
 */
export function Result({
  resultDto
}: Readonly<{
  resultDto: ResultDto | null;
}>): JSX.Element {

  const [radio, setRadio] = useState<Radio>(Radio.DEC);

  return (
    <div className="my-3 p-3 pe-0 border">
      <div className="row">
        <div className="row">
          <div className="d-flex justify-content-between">
            <h4>Result</h4>
            <RadioButton radio={radio} setRadio={setRadio} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 col-lg-2 fw-bold text-md-end">IP</div>
          <div className={"col-md-3 col-lg-2 font-monospace" + (radio === Radio.DEC ? Symbol.EMPTY : Symbol.SPACE + "d-none d-md-block")}>
            {resultDto == null ? "---.---.---.---" : resultDto.getDecIpAddress()}
          </div>
          <div className={"col-md-6 col-lg-8 font-monospace" + (radio === Radio.BIN ? Symbol.EMPTY : Symbol.SPACE + "d-none d-md-block")}>
            {resultDto == null ? "--------.--------.--------.--------" : resultDto.getBinIpAddress()}
          </div>
        </div>
      </div>
    </div>
  );
}
