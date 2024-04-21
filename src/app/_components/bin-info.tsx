"use client";

import { IpAddress, Radio, Symbol } from "../_lib/const";
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
 * @param props.getEndIndexForBoldFrom 太字フォント適用文字列終了インデックス取得関数（デフォルト戻り値：`0`）
 * @returns 2進数情報表示用`div`要素
 */
export function BinInfo({
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
    <div className={"col-md-6 col-lg-8 font-monospace" + (radio === Radio.BIN ? Symbol.EMPTY : Symbol.SPACE + "d-none d-md-block")}>
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
