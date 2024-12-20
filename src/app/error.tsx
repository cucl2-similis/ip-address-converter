"use client";

export default function Error({
  error,
  reset
}: Readonly<{
  error: Error;
  reset: () => void;
}>) {

  if (process.env.NODE_ENV === "production") {
    console.error = () => {};
  }

  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }

  return (
    <div className="container">
      <div className="px-4 py-5 my-5 text-center">
        <i className="bi bi-exclamation-triangle text-warning display-3" />
        <h1 className="mb-4">Something went wrong.</h1>
        <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
          <button type="button" className="btn btn-primary" onClick={reset}>Retry</button>
          <button type="button" className="btn btn-outline-primary" onClick={() => location.reload()}>Reload</button>
        </div>
      </div>
    </div>
  );
}
