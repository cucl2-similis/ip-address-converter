"use client";

/**
 * フッターコンポーネント  
 * フッター要素 `<footer>・・・</footer>` を返却する。
 * @returns フッター要素 `<footer>・・・</footer>`
 */
export function Footer(): JSX.Element {
  return (
    <footer className="my-3">
      <div className="text-center">
        <i className="bi bi-github" />
        <a className="link-secondary         link-underline-secondary
                      link-opacity-75        link-underline-opacity-0
                      link-opacity-100-hover link-underline-opacity-100-hover"
           href="https://github.com/cucl2-similis/ip-address-converter">
          <span> Repository</span>
        </a>
      </div>
    </footer>
  );
}
