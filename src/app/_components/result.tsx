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
