import { Smartphone } from "lucide-react";

export function MobileMockup({ loading }: { loading: boolean }) {
  return (
    <div className="mx-auto w-[290px] rounded-[32px] border border-zinc-700 bg-zinc-950 p-3 shadow-2xl">
      <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-zinc-700" />
      <div className="overflow-hidden rounded-[24px] border border-zinc-800 bg-black" style={{ height: 520 }}>
        {loading ? (
          <div className="flex h-full animate-pulse items-center justify-center text-zinc-500">
            Generating preview...
          </div>
        ) : (
          <iframe
            title="Playable preview"
            className="h-full w-full"
            srcDoc={`
              <html>
                <body style="margin:0;display:flex;align-items:center;justify-content:center;height:100%;background:#111;color:#fff;font-family:Inter,sans-serif">
                  <div style="text-align:center">
                    <h3 style="margin:0 0 8px 0;color:#F97316">Playable Preview</h3>
                    <p style="margin:0;font-size:12px;color:#A1A1AA">HTML5 ad sandbox</p>
                  </div>
                </body>
              </html>
            `}
          />
        )}
      </div>
      <div className="mx-auto mt-3 w-fit rounded-full border border-zinc-700 p-1.5">
        <Smartphone className="h-3 w-3 text-zinc-500" />
      </div>
    </div>
  );
}
