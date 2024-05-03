"use client";

import { useState } from "react";
import { AddressBlock, AddressClass, Char, Radio } from "../_lib/const";
import { ResultDto } from "../_lib/result-dto";
import { BinSpan } from "./bin-span";
import { RadioButton } from "./radio-button";

/**
 * IPアドレス表（アコーディオン）コンポーネント  
 * IPアドレス表（アコーディオン）用`div`要素を返却する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.resultDto 変換結果DTO state変数
 * @returns IPアドレス表（アコーディオン）用`div`要素
 */
export function IpTable({
  resultDto
}: Readonly<{
  resultDto: ResultDto | null;
}>): JSX.Element {

  const [radio, setRadio] = useState<Radio>(Radio.DEC);

  return (
    <SingleItemAccordion displayNameOnHeader="Simple IP Address Table">

      <div className="pb-3 d-flex justify-content-end border-bottom">
        <RadioButton prefix="ip-table" radio={radio} setRadio={setRadio} />
      </div>

      <div className="table-responsive">
        <table className="table table-sm">
          <tbody>
            <tr>
              <AddressClassTd resultDto={resultDto} addressClass={AddressClass.A} rowSpan={3} />
              <AddressRangeTd radio={radio} resultDto={resultDto} addressBlock={AddressBlock.A_PUBLIC_FORMER} />
            </tr>
            <tr>
              <AddressRangeTd radio={radio} resultDto={resultDto} addressBlock={AddressBlock.A_PRIVATE_BLOCK} />
            </tr>
            <tr>
              <AddressRangeTd radio={radio} resultDto={resultDto} addressBlock={AddressBlock.A_PUBLIC_LATTER} />
            </tr>
            <tr>
              <AddressClassTd resultDto={resultDto} addressClass={AddressClass.LOCALHOST} />
              <AddressRangeTd radio={radio} resultDto={resultDto} addressBlock={AddressBlock.LOCALHOST_BLOCK} />
            </tr>
            <tr>
              <AddressClassTd resultDto={resultDto} addressClass={AddressClass.B} rowSpan={3} />
              <AddressRangeTd radio={radio} resultDto={resultDto} addressBlock={AddressBlock.B_PUBLIC_FORMER} />
            </tr>
            <tr>
              <AddressRangeTd radio={radio} resultDto={resultDto} addressBlock={AddressBlock.B_PRIVATE_BLOCK} />
            </tr>
            <tr>
              <AddressRangeTd radio={radio} resultDto={resultDto} addressBlock={AddressBlock.B_PUBLIC_LATTER} />
            </tr>
            <tr>
              <AddressClassTd resultDto={resultDto} addressClass={AddressClass.C} rowSpan={3} />
              <AddressRangeTd radio={radio} resultDto={resultDto} addressBlock={AddressBlock.C_PUBLIC_FORMER} />
            </tr>
            <tr>
              <AddressRangeTd radio={radio} resultDto={resultDto} addressBlock={AddressBlock.C_PRIVATE_BLOCK} />
            </tr>
            <tr>
              <AddressRangeTd radio={radio} resultDto={resultDto} addressBlock={AddressBlock.C_PUBLIC_LATTER} />
            </tr>
          </tbody>
        </table>
      </div>
    </SingleItemAccordion>
  );
}

/**
 * アドレスクラス表データセル要素コンポーネント  
 * アドレスクラス`td`要素を返却する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.resultDto 変換結果DTO state変数
 * @param props.addressClass アドレスクラス
 * @param props.rowSpan 行結合`rowspan`属性（デフォルト値：`1`）
 * @returns アドレスクラス`td`要素
 */
function AddressClassTd({
  resultDto,
  addressClass,
  rowSpan = 1
}: Readonly<{
  resultDto: ResultDto | null;
  addressClass: AddressClass;
  rowSpan?: number;
}>): JSX.Element {

  const addressClassName = addressClass === AddressClass.LOCALHOST
                           ? addressClass.name
                           : "Class" + Char.SPACE + addressClass.name;

  const tableInfo = resultDto != null && resultDto.getAddressClass() === addressClass
                    ? "table-info" + Char.SPACE
                    : Char.EMPTY;

  return (
    <td className={tableInfo + "fw-bold"} rowSpan={rowSpan}>{addressClassName}</td>
  );
}

/**
 * アドレス範囲表データセル要素コンポーネント  
 * アドレス範囲`td`要素を返却する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.radio ラジオボタン選択肢 state変数
 * @param props.resultDto 変換結果DTO state変数
 * @param props.addressBlock アドレスブロック
 * @returns アドレス範囲`td`要素
 */
function AddressRangeTd({
  radio,
  resultDto,
  addressBlock
}: Readonly<{
  radio: Radio;
  resultDto: ResultDto | null;
  addressBlock: AddressBlock;
}>): JSX.Element {

  const tableInfo = resultDto != null && resultDto.getAddressBlock() === addressBlock
                    ? "table-info" + Char.SPACE
                    : Char.EMPTY;

  return (
    <>
      <td className={tableInfo}>{addressBlock.scope}</td>
      <td className={tableInfo + "font-monospace"}>
        {radio === Radio.DEC ? addressBlock.addressRange.decFirst
                             : <BinSpan binIpAddress={addressBlock.addressRange.binFirst}
                                        endIndexForBold={addressBlock.addressClass.index}
                                        endIndexForSecondary={addressBlock.addressClass.subnetIndex} />}
      </td>
      <td className={tableInfo}>-</td>
      <td className={tableInfo + "font-monospace"}>
        {radio === Radio.DEC ? addressBlock.addressRange.decLast
                             : <BinSpan binIpAddress={addressBlock.addressRange.binLast}
                                        endIndexForBold={addressBlock.addressClass.index}
                                        endIndexForSecondary={addressBlock.addressClass.subnetIndex} />}
      </td>
    </>
  );
}

/**
 * 単一アイテムアコーディオンコンポーネント
 * 
 * 指定された表示名のヘッダと子要素を内容とする  
 * 単一のアイテムを折りたたむアコーディオン用`div`要素を返却する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.displayNameOnHeader ヘッダ表示名
 * @param props.children 子要素
 * @returns 指定のヘッダ名と子要素を単一のアイテムに持つアコーディオン用`div`要素
 */
function SingleItemAccordion({
  displayNameOnHeader,
  children
}: Readonly<{
  displayNameOnHeader: string;
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <div className="accordion mb-3 pb-3" id="single-item-accordion">
      <div className="accordion-item">
        <div className="accordion-header">
          <button className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#single-item-accordion-item"
                  aria-controls="single-item-accordion-item">
            <h5>{displayNameOnHeader}</h5>
          </button>
        </div>
        <div id="single-item-accordion-item"
             className="accordion-collapse collapse"
             data-bs-parent="#single-item-accordion">
          <div className="accordion-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
