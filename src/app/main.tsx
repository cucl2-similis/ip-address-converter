"use client";

import { useState } from "react";
import { Form } from "./_components/form";
import { ResultDto } from "./_lib/result-dto";
import { Result } from "./_components/result";

/**
 * IP Address Converter コンポーネント  
 * メイン要素 `<div class="container">・・・</div>` を返却する。
 * @returns メイン要素 `<div class="container">・・・</div>`
 */
export function IpAddressConverter(): JSX.Element {

  const [resultDto, setResultDto] = useState<ResultDto | null>(null);

  return (
    <div className="container">
      <div className="my-3">
        <h2>IP Address Converter</h2>
      </div>
      <Form setResultDto={setResultDto} />
      <Result resultDto={resultDto} />
    </div>
  );
}
