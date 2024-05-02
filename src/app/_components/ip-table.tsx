"use client";

import { useState } from "react";
import { AddressBlock, Radio } from "../_lib/const";
import { BinSpan } from "./bin-span";
import { RadioButton } from "./radio-button";

/**
 * IPアドレス表（アコーディオン）コンポーネント  
 * IPアドレス表（アコーディオン）用`div`要素を返却する。
 * @returns IPアドレス表（アコーディオン）用`div`要素
 */
export function IpTable(): JSX.Element {

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
              <td rowSpan={3}><h6>Class A</h6></td>
              <IpRangeTd radio={radio} addressBlock={AddressBlock.A_PUBLIC_FORMER} />
            </tr>
            <tr>
              <IpRangeTd radio={radio} addressBlock={AddressBlock.A_PRIVATE_BLOCK} />
            </tr>
            <tr>
              <IpRangeTd radio={radio} addressBlock={AddressBlock.A_PUBLIC_LATTER} />
            </tr>
            <tr>
              <td className="fw-bold">localhost</td>
              <IpRangeTd radio={radio} addressBlock={AddressBlock.LOCALHOST_BLOCK} />
            </tr>
            <tr>
              <td rowSpan={3}><h6>Class B</h6></td>
              <IpRangeTd radio={radio} addressBlock={AddressBlock.B_PUBLIC_FORMER} />
            </tr>
            <tr>
              <IpRangeTd radio={radio} addressBlock={AddressBlock.B_PRIVATE_BLOCK} />
            </tr>
            <tr>
              <IpRangeTd radio={radio} addressBlock={AddressBlock.B_PUBLIC_LATTER} />
            </tr>
            <tr>
              <td rowSpan={3}><h6>Class C</h6></td>
              <IpRangeTd radio={radio} addressBlock={AddressBlock.C_PUBLIC_FORMER} />
            </tr>
            <tr>
              <IpRangeTd radio={radio} addressBlock={AddressBlock.C_PRIVATE_BLOCK} />
            </tr>
            <tr>
              <IpRangeTd radio={radio} addressBlock={AddressBlock.C_PUBLIC_LATTER} />
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
 * @param props.radio ラジオボタン選択肢 state変数
 * @param props.addressBlock アドレスブロック
 * @returns IPアドレス範囲用`td`要素
 */
function IpRangeTd({
  radio,
  addressBlock
}: Readonly<{
  radio: Radio;
  addressBlock: AddressBlock;
}>): JSX.Element {
  return (
    <>
      <td>{addressBlock.scope}</td>
      <td className="font-monospace">
        {radio === Radio.DEC ? addressBlock.addressRange.decFirst
                             : <BinSpan binIpAddress={addressBlock.addressRange.binFirst}
                                        endIndexForBold={addressBlock.addressClass.index}
                                        endIndexForSecondary={addressBlock.addressClass.subnetIndex} />}
      </td>
      <td>-</td>
      <td className="font-monospace">
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
