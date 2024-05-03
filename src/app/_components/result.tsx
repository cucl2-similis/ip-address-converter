"use client";

import { useState } from "react";
import { Char, IpAddress, Radio } from "../_lib/const";
import { ResultDto } from "../_lib/result-dto";
import { BinSpan } from "./bin-span";
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
          <DecResult radio={radio} resultDto={resultDto} getDecResultFrom={resultDto => resultDto.getDecIpAddress()} />
          <BinResult radio={radio} resultDto={resultDto} getBinResultFrom={resultDto => resultDto.getBinIpAddress()} getEndIndexForBoldFrom={resultDto => resultDto.getAddressClass().index} />
        </div>
        <div className="row mt-1 mt-md-2">
          <Subheading>Class</Subheading>
          <div className="col-md-9 col-lg-10">
            <span>{resultDto == null ? "-" : resultDto.getAddressClass().name}</span>
            {resultDto == null || resultDto.getAddressBlock().scope == null ? Char.EMPTY
                                                                            : <span className="text-secondary"> ( {resultDto.getAddressBlock().scope} )</span>}
          </div>
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
          <DecResult radio={radio} resultDto={resultDto} getDecResultFrom={resultDto => resultDto.getDecSubnetMask()} />
          <BinResult radio={radio} resultDto={resultDto} getBinResultFrom={resultDto => resultDto.getBinSubnetMask()} />
        </div>
        <div className="row mt-1 mt-md-0">
          <Subheading>Network address</Subheading>
          <DecResult radio={radio} resultDto={resultDto} getDecResultFrom={resultDto => resultDto.getDecNetworkAddress()} />
          <BinResult radio={radio} resultDto={resultDto} getBinResultFrom={resultDto => resultDto.getBinNetworkAddress()} />
        </div>
        <div className="row mt-1 mt-md-0">
          <Subheading>Broadcast address</Subheading>
          <DecResult radio={radio} resultDto={resultDto} getDecResultFrom={resultDto => resultDto.getDecBroadcastAddress()} />
          <BinResult radio={radio} resultDto={resultDto} getBinResultFrom={resultDto => resultDto.getBinBroadcastAddress()} />
        </div>
        <div className="row mt-1 mt-md-2">
          <Subheading>Available range</Subheading>
          <DecResult radio={radio} resultDto={resultDto} getDecResultFrom={resultDto => resultDto.getDecFirstAvailableIpAddress()} />
          <BinResult radio={radio} resultDto={resultDto} getBinResultFrom={resultDto => resultDto.getBinFirstAvailableIpAddress()} />
        </div>
        <div className="row">
          <div className={"lh-1 fst-italic d-md-none"}>to</div>
          <div className={"lh-1 fst-italic d-none d-md-block col-md-3 offset-md-3 col-lg-2 offset-lg-2"}>to</div>
          <div className={"lh-1 fst-italic d-none d-md-block col-md-6 col-lg-4"}>to</div>
        </div>
        <div className="row">
          <DecResult radio={radio} resultDto={resultDto} getDecResultFrom={resultDto => resultDto.getDecLastAvailableIpAddress()} optionalClass="offset-md-3 offset-lg-2" />
          <BinResult radio={radio} resultDto={resultDto} getBinResultFrom={resultDto => resultDto.getBinLastAvailableIpAddress()} />
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
 * 10進数変換結果情報コンポーネント  
 * 10進数変換結果情報表示用`div`要素を返却する。
 * 
 * `resultDto`が`null`の場合は初期表示、そうでない場合は  
 * `getDecResultFrom(resultDto)`で取得した文字列を表示する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.radio ラジオボタン選択肢 state変数
 * @param props.resultDto 変換結果DTO state変数
 * @param props.getDecResultFrom 10進数変換結果情報取得関数
 * @param props.optionalClass オプション`class`属性（デフォルト値：`""`）
 * @returns 10進数変換結果情報表示用`div`要素
 */
function DecResult({
  radio,
  resultDto,
  getDecResultFrom,
  optionalClass = Char.EMPTY
}: Readonly<{
  radio: Radio;
  resultDto: ResultDto | null;
  getDecResultFrom: (resultDto: ResultDto) => string;
  optionalClass?: string;
}>): JSX.Element {
  return (
    <div className={"col-md-3 col-lg-2 font-monospace"
                    + (radio === Radio.DEC ? Char.EMPTY : Char.SPACE + "d-none d-md-block")
                    + Char.SPACE + optionalClass}>
      {resultDto == null ? "---.---.---.---" : getDecResultFrom(resultDto)}
    </div>
  );
}

/**
 * 2進数変換結果情報コンポーネント  
 * 2進数変換結果情報表示用`div`要素を返却する。
 * 
 * `resultDto`が`null`の場合は初期表示、そうでない場合は  
 * `getBinResultFrom(resultDto)`で取得した文字列を表示する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.radio ラジオボタン選択肢 state変数
 * @param props.resultDto 変換結果DTO state変数
 * @param props.getBinResultFrom 2進数変換結果情報取得関数
 * @param props.getEndIndexForBoldFrom 太字フォント適用文字列終了インデックス取得関数（デフォルト戻り値：`0`）
 * @returns 2進数変換結果情報表示用`div`要素
 */
function BinResult({
  radio,
  resultDto,
  getBinResultFrom,
  getEndIndexForBoldFrom = resultDto => 0
}: Readonly<{
  radio: Radio;
  resultDto: ResultDto | null;
  getBinResultFrom: (resultDto: ResultDto) => string;
  getEndIndexForBoldFrom?: (resultDto: ResultDto) => number;
}>): JSX.Element {
  return (
    <div className={"col-md-6 col-lg-8 font-monospace" + (radio === Radio.BIN ? Char.EMPTY : Char.SPACE + "d-none d-md-block")}>
      {resultDto == null ? "--------.--------.--------.--------"
                         : <BinSpan binIpAddress={getBinResultFrom(resultDto)}
                                    endIndexForBold={getEndIndexForBoldFrom(resultDto)}
                                    endIndexForSecondary={resultDto.getBinSubnetMask()                 // 2進数サブネットマスクのうち、
                                                                   .lastIndexOf(IpAddress.BIT_STR_ONE) // ビットが「1」となっている最後の桁の、
                                                                   + 1} />                             // 次の位置を終了インデックスとする。
      }
    </div>
  );
}
