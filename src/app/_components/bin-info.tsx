"use client";

import { Radio, Symbol } from "../_lib/const";
import { ResultDto } from "../_lib/result-dto";

/**
 * 2進数情報コンポーネント  
 * 2進数情報表示用`div`要素を返却する。
 * 
 * `resultDto`が`null`の場合は初期表示、そうでない場合は  
 * `getBinInfoFrom(resultDto)`で取得した文字列を表示する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.radio ラジオボタン選択肢 state変数
 * @param props.resultDto 変換結果DTO state変数
 * @param props.getBinInfoFrom 2進数情報取得関数
 * @returns 2進数情報表示用`div`要素
 */
export function BinInfo({
  radio,
  resultDto,
  getBinInfoFrom
}: Readonly<{
  radio: Radio;
  resultDto: ResultDto | null;
  getBinInfoFrom: (resultDto: ResultDto) => string;
}>): JSX.Element {
  return (
    <div className={"col-md-6 col-lg-8 font-monospace" + (radio === Radio.BIN ? Symbol.EMPTY : Symbol.SPACE + "d-none d-md-block")}>
      {resultDto == null ? "--------.--------.--------.--------" : getBinInfoFrom(resultDto)}
    </div>
  );
}
