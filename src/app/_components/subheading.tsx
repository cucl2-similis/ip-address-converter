"use client";

/**
 * 小見出しコンポーネント  
 * 小見出し用`div`要素を返却する。
 * @param props コンポーネント間の情報連携用プロパティ
 * @param props.children 子要素
 * @returns 小見出し用`div`要素
 */
export function Subheading({
  children
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return <div className="col-md-3 col-lg-2 fw-bold text-md-end">{children}</div>;
}
