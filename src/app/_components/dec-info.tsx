"use client";

import { Radio, Symbol } from "../_lib/const";
import { ResultDto } from "../_lib/result-dto";

/**
 * 10進数情報コンポーネント  
 * 10進数情報表示用`div`要素を返却する。
 * 
 * `resultDto`が`null`の場合は初期表示、そうでない場合は  
 * `getDecInfoFrom(resultDto)`で取得した文字列を表示する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.radio ラジオボタン選択肢 state変数
 * @param props.resultDto 変換結果DTO state変数
 * @param props.getDecInfoFrom 10進数情報取得関数
 * @param props.optionalClass オプション`class`属性（デフォルト値：`""`）
 * @returns 10進数情報表示用`div`要素
 */
export function DecInfo({
  radio,
  resultDto,
  getDecInfoFrom,
  optionalClass = Symbol.EMPTY
}: Readonly<{
  radio: Radio;
  resultDto: ResultDto | null;
  getDecInfoFrom: (resultDto: ResultDto) => string;
  optionalClass?: string;
}>): JSX.Element {
  return (
    <div className={"col-md-3 col-lg-2 font-monospace"
                    + (radio === Radio.DEC ? Symbol.EMPTY : Symbol.SPACE + "d-none d-md-block")
                    + Symbol.SPACE + optionalClass}>
      {resultDto == null ? "---.---.---.---" : getDecInfoFrom(resultDto)}
    </div>
  );
}
