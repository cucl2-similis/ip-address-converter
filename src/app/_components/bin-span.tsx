"use client";

/**
 * 2進数情報コンポーネント
 * 
 * 指定されたインデックスで2進数IPアドレスを区切り、  
 * 太字フォントとセカンダリテキストを適用した  
 * 2進数情報表示用`span`要素を返却する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.binIpAddress 2進数IPアドレス
 * @param props.endIndexForBold 太字フォント適用文字列終了インデックス
 * @param props.endIndexForSecondary セカンダリテキスト適用文字列終了インデックス
 * @returns 2進数情報表示用`span`要素
 */
export function BinSpan({
  binIpAddress,
  endIndexForBold,
  endIndexForSecondary
}: Readonly<{
  binIpAddress: string;
  endIndexForBold: number;
  endIndexForSecondary: number;
}>): JSX.Element {
  return (
    <>
      <span className="text-secondary">
        <span className="fw-bold">{binIpAddress.substring(0, endIndexForBold)}</span>
        {binIpAddress.substring(endIndexForBold, endIndexForSecondary)}
      </span>
      <span>{binIpAddress.substring(endIndexForSecondary)}</span>
    </>
  );
}
