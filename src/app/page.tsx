"use client";

import { EventHandlerErrorBoundary } from "./_components/error-boundary";
import { IpAddressConverter } from "./_components/main";

export default function Home() {
  return (
    <EventHandlerErrorBoundary>
      <IpAddressConverter/>
    </EventHandlerErrorBoundary>
  );
}
