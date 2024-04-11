"use client";

import { useState } from "react";
import { Radio } from "../_lib/const";
import { ResultDto } from "../_lib/result-dto";
import { BinInfo } from "./bin-info";
import { DecInfo } from "./dec-info";
import { RadioButton } from "./radio-button";
import { Subheading } from "./subheading";

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
    <div className="my-3 p-3 pe-0 border">
      <div className="row">
        <div className="row">
          <div className="d-flex justify-content-between">
            <h4>Result</h4>
            <RadioButton radio={radio} setRadio={setRadio} />
          </div>
        </div>
        <div className="row">
          <Subheading>IP</Subheading>
          <DecInfo radio={radio} resultDto={resultDto} getDecInfoFrom={resultDto => resultDto.getDecIpAddress()} />
          <BinInfo radio={radio} resultDto={resultDto} getBinInfoFrom={resultDto => resultDto.getBinIpAddress()} />
        </div>
      </div>
      <div className="row">
        <h5 className="mt-3">Subnet info</h5>
        <div className="row mt-1 mt-md-0">
          <Subheading>Subnet mask</Subheading>
          <DecInfo radio={radio} resultDto={resultDto} getDecInfoFrom={resultDto => resultDto.getDecSubnetMask()} />
          <BinInfo radio={radio} resultDto={resultDto} getBinInfoFrom={resultDto => resultDto.getBinSubnetMask()} />
        </div>
      </div>
    </div>
  );
}
