"use client";

import { ResultDto } from "../_lib/result-dto";

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
  return (
    <div className="my-3 p-3 pe-0 border">
      <div className="row">
        <h4>Result</h4>
      </div>
      <div className="row">
        <div className="col-md-3 col-lg-2 fw-bold text-md-end">IP</div>
        <div className="col-md-3 col-lg-2 font-monospace">
          {resultDto == null ? "---.---.---.---" : resultDto.getDecIpAddress()}
        </div>
      </div>
    </div>
  );
}
