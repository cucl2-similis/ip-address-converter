"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { InvalidCallError } from "../_lib/errors";
import ErrorComponent from "../error";

/**
 * イベントハンドラ内エラー境界コンポーネント
 * 
 * 子コンポーネントのイベントハンドラ内で送出された例外を  
 * {@linkcode EventHandlerErrorPublisher}を介して検出し、再送出する。
 * 
 * Reactコンポーネントから例外を再送出することにより  
 * イベントハンドラ内エラーを {@linkcode ErrorComponent Error}(`error.tsx`) 表示の対象とする。
 */
export function EventHandlerErrorBoundary({
  children
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {

  const [error, setError] = useState<Error | null>(null);

  EventHandlerErrorBroker.setError = setError;
  if (error != null) throw error;

  return <>{children}</>;
}

/**
 * イベントハンドラ内エラー仲介者
 * 
 * エラー伝播用 stateセッタ関数 `setError` をモジュール内プライベートに保ち、  
 * {@linkcode EventHandlerErrorPublisher} と {@linkcode EventHandlerErrorBoundary} を仲介する。
 */
class EventHandlerErrorBroker {
  /** エラー伝播用 stateセッタ関数 */
  public static setError: Dispatch<SetStateAction<Error | null>> | null = null;
}

/**
 * イベントハンドラ内エラー発行者
 */
export class EventHandlerErrorPublisher {

  private constructor() { }

  /**
   * イベント発火時の動作をラップし例外処理を追加した関数を返却
   * 
   * 指定された関数内でエラーが発生した場合、  
   * {@linkcode EventHandlerErrorBoundary} に通知し、  
   * {@linkcode ErrorComponent Error}(`error.tsx`) 表示対象とする例外処理が追加される。
   * @param action イベント発火時の動作
   * @returns イベント発火時の動作をラップし例外処理を追加した関数
   */
  public static wrap(action: () => void): () => void {
    return () => {
      try {
        action();
      } catch (error) {
        EventHandlerErrorPublisher.notify(error);
      }
    };
  }

  /**
   * {@linkcode EventHandlerErrorBroker} を介して {@linkcode EventHandlerErrorBoundary} にエラーを通知
   * @param error 通知対象エラー
   * @throws :{@linkcode InvalidCallError} `EventHandlerErrorBroker.setError`が`null`（`EventHandlerErrorBoundary`未使用）の場合
   */
  private static notify(error: unknown): void {

    if (EventHandlerErrorBroker.setError == null) {
      throw new InvalidCallError("'EventHandlerErrorBroker.setError' is null.",
                                 "'EventHandlerErrorBoundary' might not wrap components.",
                                 "'EventHandlerErrorPublisher' must be called in wrapped components.");
    }

    if (error instanceof Error) {
      EventHandlerErrorBroker.setError(error);
    } else {
      EventHandlerErrorBroker.setError(new Error(String(error)));
    }
  }
}
