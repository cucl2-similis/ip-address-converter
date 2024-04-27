"use client";

import { Dispatch, SetStateAction } from "react";
import { Radio, Symbol } from "../_lib/const";

/**
 * ラジオボタンコンポーネント  
 * ラジオボタン用ボタングループ`div`要素を返却する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.prefix ラジオボタングループを識別するための接頭辞
 * @param props.radio ラジオボタン選択肢 state変数
 * @param props.setRadio ラジオボタン選択肢用 stateセッタ関数
 * @param props.optionalClass オプション`class`属性（デフォルト値：`""`）
 * @returns ラジオボタン用ボタングループ`div`要素
 */
export function RadioButton({
  prefix,
  radio,
  setRadio,
  optionalClass = Symbol.EMPTY
}: Readonly<{
  prefix: string;
  radio: Radio;
  setRadio: Dispatch<SetStateAction<Radio>>;
  optionalClass?: string;
}>): JSX.Element {
  return (
    <div className={"btn-group btn-group-sm" + Symbol.SPACE + optionalClass} role="group" aria-label={prefix + " Decimal and Binary radio toggle button group"}>
      <input type="radio" className="btn-check" name={prefix + "-btn-radio"} id={prefix + "-btn-radio-dec"} autoComplete="off" checked={radio === Radio.DEC} onChange={() => setRadio(Radio.DEC)} />
      <label className="btn btn-outline-secondary" htmlFor={prefix + "-btn-radio-dec"}>DEC</label>
      <input type="radio" className="btn-check" name={prefix + "-btn-radio"} id={prefix + "-btn-radio-bin"} autoComplete="off" checked={radio === Radio.BIN} onChange={() => setRadio(Radio.BIN)} />
      <label className="btn btn-outline-secondary" htmlFor={prefix + "-btn-radio-bin"}>BIN</label>
    </div>
  );
}
