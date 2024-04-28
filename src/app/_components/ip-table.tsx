"use client";

import { useState } from "react";
import { AddressClass, IpAddress, Radio } from "../_lib/const";
import { BinSpan } from "./bin-span";
import { RadioButton } from "./radio-button";

/**
 * IPアドレス表（アコーディオン）コンポーネント  
 * IPアドレス表（アコーディオン）用`div`要素を返却する。
 * @returns IPアドレス表（アコーディオン）用`div`要素
 */
export function IpTable(): JSX.Element {

  const [radio, setRadio] = useState<Radio>(Radio.DEC);

  const secondaryIndexForClassA = IpAddress.OCTET_DIGITS * 1;     // オクテット1ブロックの桁数 × 1
  const secondaryIndexForClassB = IpAddress.OCTET_DIGITS * 2 + 1; // オクテット1ブロックの桁数 × 2 +「.」1つ分
  const secondaryIndexForClassC = IpAddress.OCTET_DIGITS * 3 + 2; // オクテット1ブロックの桁数 × 3 +「.」2つ分

  return (
    <SingleItemAccordion displayNameOnHeader="Simple IP Address Table">

      <div className="pb-3 d-flex justify-content-end border-bottom">
        <RadioButton prefix="ip-table" radio={radio} setRadio={setRadio} />
      </div>

      <div className="table-responsive">
        <table className="table table-sm">
          <tbody>
            <tr>
              <td rowSpan={3}><h6>Class A</h6></td>
              <td>Public</td>
              {radio === Radio.DEC ? <IpRangeTd first="1.0.0.0" last="9.255.255.255" />
                                   : <IpRangeTd first="00000001.00000000.00000000.00000000" last="00001001.11111111.11111111.11111111"
                                                endIndexForBold={AddressClass.A.index} endIndexForSecondary={secondaryIndexForClassA} />}
            </tr>
            <tr>
              <td>Private</td>
              {radio === Radio.DEC ? <IpRangeTd first="10.0.0.0" last="10.255.255.255" />
                                   : <IpRangeTd first="00001010.00000000.00000000.00000000" last="00001010.11111111.11111111.11111111"
                                                endIndexForBold={AddressClass.A.index} endIndexForSecondary={secondaryIndexForClassA} />}
            </tr>
            <tr>
              <td>Public</td>
              {radio === Radio.DEC ? <IpRangeTd first="11.0.0.0" last="126.255.255.255" />
                                   : <IpRangeTd first="00001011.00000000.00000000.00000000" last="01111110.11111111.11111111.11111111"
                                                endIndexForBold={AddressClass.A.index} endIndexForSecondary={secondaryIndexForClassA} />}
            </tr>
            <tr>
              <td className="fw-bold">localhost</td>
              <td></td>
              {radio === Radio.DEC ? <IpRangeTd first="127.0.0.0" last="127.255.255.255" />
                                   : <IpRangeTd first="01111111.00000000.00000000.00000000" last="01111111.11111111.11111111.11111111" />}
            </tr>
            <tr>
              <td rowSpan={3}><h6>Class B</h6></td>
              <td>Public</td>
              {radio === Radio.DEC ? <IpRangeTd first="128.0.0.0" last="172.15.255.255" />
                                   : <IpRangeTd first="10000000.00000000.00000000.00000000" last="10101100.00001111.11111111.11111111"
                                                endIndexForBold={AddressClass.B.index} endIndexForSecondary={secondaryIndexForClassB} />}
            </tr>
            <tr>
              <td>Private</td>
              {radio === Radio.DEC ? <IpRangeTd first="172.16.0.0" last="172.31.255.255" />
                                   : <IpRangeTd first="10101100.00010000.00000000.00000000" last="10101100.00011111.11111111.11111111"
                                                endIndexForBold={AddressClass.B.index} endIndexForSecondary={secondaryIndexForClassB} />}
            </tr>
            <tr>
              <td>Public</td>
              {radio === Radio.DEC ? <IpRangeTd first="172.32.0.0" last="191.255.255.255" />
                                   : <IpRangeTd first="10101100.00100000.00000000.00000000" last="10111111.11111111.11111111.11111111"
                                                endIndexForBold={AddressClass.B.index} endIndexForSecondary={secondaryIndexForClassB} />}
            </tr>
            <tr>
              <td rowSpan={3}><h6>Class C</h6></td>
              <td>Public</td>
              {radio === Radio.DEC ? <IpRangeTd first="192.0.0.0" last="192.167.255.255" />
                                   : <IpRangeTd first="11000000.00000000.00000000.00000000" last="11000000.10100111.11111111.11111111"
                                                endIndexForBold={AddressClass.C.index} endIndexForSecondary={secondaryIndexForClassC} />}
            </tr>
            <tr>
              <td>Private</td>
              {radio === Radio.DEC ? <IpRangeTd first="192.168.0.0" last="192.168.255.255" />
                                   : <IpRangeTd first="11000000.10101000.00000000.00000000" last="11000000.10101000.11111111.11111111"
                                                endIndexForBold={AddressClass.C.index} endIndexForSecondary={secondaryIndexForClassC} />}
            </tr>
            <tr>
              <td>Public</td>
              {radio === Radio.DEC ? <IpRangeTd first="192.169.0.0" last="223.255.255.255" />
                                   : <IpRangeTd first="11000000.10101001.00000000.00000000" last="11011111.11111111.11111111.11111111"
                                                endIndexForBold={AddressClass.C.index} endIndexForSecondary={secondaryIndexForClassC} />}
            </tr>
          </tbody>
        </table>
      </div>
    </SingleItemAccordion>
  );
}

/**
 * IPアドレス範囲用表データセル要素コンポーネント  
 * IPアドレス範囲用`td`要素を返却する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.first 開始IPアドレス
 * @param props.last 終了IPアドレス
 * @param props.endIndexForBold 太字フォント適用文字列終了インデックス（デフォルト値：`0`）
 * @param props.endIndexForSecondary セカンダリテキスト適用文字列終了インデックス（デフォルト値：`0`）
 * @returns IPアドレス範囲用`td`要素
 */
function IpRangeTd({
  first,
  last,
  endIndexForBold = 0,
  endIndexForSecondary = 0
}: Readonly<{
  first: string;
  last: string;
  endIndexForBold?: number;
  endIndexForSecondary?: number;
}>): JSX.Element {

  const isDecimal = endIndexForSecondary === 0 && endIndexForBold === 0;

  return (
    <>
      <td className="font-monospace">
        {isDecimal ? first : <BinSpan binIpAddress={first} endIndexForBold={endIndexForBold} endIndexForSecondary={endIndexForSecondary} />}
      </td>
      <td>-</td>
      <td className="font-monospace">
        {isDecimal ? last : <BinSpan binIpAddress={last} endIndexForBold={endIndexForBold} endIndexForSecondary={endIndexForSecondary} />}
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
