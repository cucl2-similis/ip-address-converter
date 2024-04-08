"use client";

import { Dispatch, SetStateAction } from "react";
import { Radio } from "../_lib/const";

/**
 * ラジオボタンコンポーネント  
 * ラジオボタン用ボタングループ`div`要素を返却する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.radio ラジオボタン選択肢 state変数
 * @param props.setRadio ラジオボタン選択肢用 stateセッタ関数
 * @returns ラジオボタン用ボタングループ`div`要素
 */
export function RadioButton({
  radio,
  setRadio
}: Readonly<{
  radio: Radio;
  setRadio: Dispatch<SetStateAction<Radio>>;
}>): JSX.Element {
  return (
    <div className="btn-group btn-group-sm d-md-none" role="group" aria-label="Decimal and Binary radio toggle button group">
      <input type="radio" className="btn-check" name="btn-radio" id="btn-radio-dec" autoComplete="off" checked={radio === Radio.DEC} onChange={() => setRadio(Radio.DEC)} />
      <label className="btn btn-outline-secondary" htmlFor="btn-radio-dec">DEC</label>
      <input type="radio" className="btn-check" name="btn-radio" id="btn-radio-bin" autoComplete="off" checked={radio === Radio.BIN} onChange={() => setRadio(Radio.BIN)} />
      <label className="btn btn-outline-secondary" htmlFor="btn-radio-bin">BIN</label>
    </div>
  );
}
