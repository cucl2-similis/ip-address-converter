"use client";

import { useState } from "react";
import { ResultDto } from "../_lib/result-dto";
import { Form } from "./form";
import { IpTable } from "./ip-table";
import { Result } from "./result";

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
      <IpTable/>
    </div>
  );
}
