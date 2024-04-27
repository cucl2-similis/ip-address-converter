"use client";

import { useState } from "react";
import { Char, IpAddress, Radio } from "../_lib/const";
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
    <div className="my-3 p-3 pe-0 border rounded">
      <div className="row">
        <div className="row">
          <div className="d-flex justify-content-between">
            <h4>Result</h4>
            <RadioButton prefix="result" radio={radio} setRadio={setRadio} optionalClass="d-md-none" />
          </div>
        </div>
        <div className="row">
          <Subheading>IP</Subheading>
          <DecInfo radio={radio} resultDto={resultDto} getDecInfoFrom={resultDto => resultDto.getDecIpAddress()} />
          <BinInfo radio={radio} resultDto={resultDto} getBinInfoFrom={resultDto => resultDto.getBinIpAddress()} getEndIndexForBoldFrom={resultDto => resultDto.getAddressClass().index} />
        </div>
        <div className="row mt-1 mt-md-2">
          <Subheading>Class</Subheading>
          <div className="col-md-9 col-lg-10">{resultDto == null ? "-" : resultDto.getAddressClass().name}</div>
        </div>
        <div className="row mt-1 mt-md-0 mb-md-2">
          <Subheading>CIDR</Subheading>
          <div className="col-md-9 col-lg-10">
            <span className="font-monospace">/{resultDto == null ? "--" : resultDto.getCidr()}</span>
            <span className="text-secondary"> ( <span className="font-monospace">{resultDto == null ? "--" : resultDto.getNumberOfAvailableIps()}</span> IPs )</span>
          </div>
        </div>
        <div className="row mt-1 mt-md-0">
          <Subheading>Subnet mask</Subheading>
          <DecInfo radio={radio} resultDto={resultDto} getDecInfoFrom={resultDto => resultDto.getDecSubnetMask()} />
          <BinInfo radio={radio} resultDto={resultDto} getBinInfoFrom={resultDto => resultDto.getBinSubnetMask()} />
        </div>
        <div className="row mt-1 mt-md-0">
          <Subheading>Network address</Subheading>
          <DecInfo radio={radio} resultDto={resultDto} getDecInfoFrom={resultDto => resultDto.getDecNetworkAddress()} />
          <BinInfo radio={radio} resultDto={resultDto} getBinInfoFrom={resultDto => resultDto.getBinNetworkAddress()} />
        </div>
        <div className="row mt-1 mt-md-0">
          <Subheading>Broadcast address</Subheading>
          <DecInfo radio={radio} resultDto={resultDto} getDecInfoFrom={resultDto => resultDto.getDecBroadcastAddress()} />
          <BinInfo radio={radio} resultDto={resultDto} getBinInfoFrom={resultDto => resultDto.getBinBroadcastAddress()} />
        </div>
        <div className="row mt-1 mt-md-2">
          <Subheading>Available range</Subheading>
          <DecInfo radio={radio} resultDto={resultDto} getDecInfoFrom={resultDto => resultDto.getDecFirstAvailableIpAddress()} />
          <BinInfo radio={radio} resultDto={resultDto} getBinInfoFrom={resultDto => resultDto.getBinFirstAvailableIpAddress()} />
        </div>
        <div className="row">
          <div className={"lh-1 fst-italic d-md-none"}>to</div>
          <div className={"lh-1 fst-italic d-none d-md-block col-md-3 offset-md-3 col-lg-2 offset-lg-2"}>to</div>
          <div className={"lh-1 fst-italic d-none d-md-block col-md-6 col-lg-4"}>to</div>
        </div>
        <div className="row">
          <DecInfo radio={radio} resultDto={resultDto} getDecInfoFrom={resultDto => resultDto.getDecLastAvailableIpAddress()} optionalClass="offset-md-3 offset-lg-2" />
          <BinInfo radio={radio} resultDto={resultDto} getBinInfoFrom={resultDto => resultDto.getBinLastAvailableIpAddress()} />
        </div>
      </div>
    </div>
  );
}

/**
 * 小見出しコンポーネント  
 * 小見出し用`div`要素を返却する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.children 子要素
 * @returns 小見出し用`div`要素
 */
function Subheading({
  children
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return <div className="col-md-3 col-lg-2 fw-bold text-md-end">{children}</div>;
}

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
function DecInfo({
  radio,
  resultDto,
  getDecInfoFrom,
  optionalClass = Char.EMPTY
}: Readonly<{
  radio: Radio;
  resultDto: ResultDto | null;
  getDecInfoFrom: (resultDto: ResultDto) => string;
  optionalClass?: string;
}>): JSX.Element {
  return (
    <div className={"col-md-3 col-lg-2 font-monospace"
                    + (radio === Radio.DEC ? Char.EMPTY : Char.SPACE + "d-none d-md-block")
                    + Char.SPACE + optionalClass}>
      {resultDto == null ? "---.---.---.---" : getDecInfoFrom(resultDto)}
    </div>
  );
}

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
 * @param props.getEndIndexForBoldFrom 太字フォント適用文字列終了インデックス取得関数（デフォルト戻り値：`0`）
 * @returns 2進数情報表示用`div`要素
 */
function BinInfo({
  radio,
  resultDto,
  getBinInfoFrom,
  getEndIndexForBoldFrom = resultDto => 0
}: Readonly<{
  radio: Radio;
  resultDto: ResultDto | null;
  getBinInfoFrom: (resultDto: ResultDto) => string;
  getEndIndexForBoldFrom?: (resultDto: ResultDto) => number;
}>): JSX.Element {
  return (
    <div className={"col-md-6 col-lg-8 font-monospace" + (radio === Radio.BIN ? Char.EMPTY : Char.SPACE + "d-none d-md-block")}>
      {resultDto == null ? "--------.--------.--------.--------"
                         : <ConvertedBinInfo resultDto={resultDto} binInfo={getBinInfoFrom(resultDto)} endIndexForBold={getEndIndexForBoldFrom(resultDto)} />}
    </div>
  );
}

/**
 * 変換済2進数情報コンポーネント
 * 
 * 2進数結果表示テキストを調整するための、  
 * 2進数情報コンポーネント（`BinInfo`）内部呼び出し用privateコンポーネントとして、  
 * 変換済2進数情報を分割した`span`要素を返却する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.resultDto 変換結果DTO state変数
 * @param props.binInfo 2進数情報
 * @param props.endIndexForBold 太字フォント適用文字列終了インデックス
 * @returns 変換済2進数情報表示用`span`要素
 */
function ConvertedBinInfo({
  resultDto,
  binInfo,
  endIndexForBold
}: Readonly<{
  resultDto: ResultDto;
  binInfo: string;
  endIndexForBold: number;
}>): JSX.Element {

  // セカンダリテキスト適用文字列終了インデックス
  const endIndexForSecondary = resultDto.getBinSubnetMask()                 // 2進数サブネットマスクのうち、
                                        .lastIndexOf(IpAddress.BIT_STR_ONE) // ビットが「1」となっている最後の桁の、
                                        + 1;                                // 次の位置を終了インデックスとする。
  return (
    <>
      <span className="text-secondary">
        <span className="fw-bold">{binInfo.substring(0, endIndexForBold)}</span>
        {binInfo.substring(endIndexForBold, endIndexForSecondary)}
      </span>
      <span>{binInfo.substring(endIndexForSecondary)}</span>
    </>
  );
}
