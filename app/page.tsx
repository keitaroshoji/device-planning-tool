import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex flex-col">
      {/* Nav */}
      <nav className="max-w-[1800px] mx-auto w-full px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="text-white font-semibold tracking-wide">Studist DRS</span>
        </div>
        <span className="text-blue-200 text-sm">デバイスレンタルサービス</span>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex items-center">
        <div className="max-w-[1800px] mx-auto w-full px-10 py-10 grid grid-cols-2 gap-16 items-center">

          {/* Left: Copy */}
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium text-blue-100">
                <span>⏱</span> 所要時間 約3分
              </div>
              <h1 className="text-5xl font-extrabold text-white leading-tight">
                デバイスプランニング
                <br />
                <span className="text-blue-200">診断ツール</span>
              </h1>
              <p className="text-blue-100 text-xl leading-relaxed">
                5つの質問に答えるだけで、
                <br />
                貴社に最適なデバイス活用プランと
                <br />
                現状とのギャップを可視化します。
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/wizard?step=1"
                className="inline-flex items-center gap-3 bg-white text-blue-700 font-bold text-lg px-10 py-4 rounded-2xl shadow-xl hover:bg-blue-50 hover:scale-[1.02] transition-all"
              >
                診断スタート →
              </Link>
              <p className="text-blue-300 text-sm">
                入力情報はプランご提案の目的にのみ使用します
              </p>
            </div>

            {/* Step preview */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                '業種',
                '業務の課題',
                '活用シーン',
                'マニュアル品質',
                '運用スタイル',
              ].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs text-blue-100">
                    <span className="w-4 h-4 rounded-full bg-blue-400 text-white text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {s}
                  </div>
                  {i < 4 && <span className="text-blue-400 text-xs">›</span>}
                </div>
              ))}
              <div className="flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/40 rounded-full px-3 py-1 text-xs text-amber-200">
                ✨ 結果表示
              </div>
            </div>
          </div>

          {/* Right: Result preview mockup */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-1 border border-white/20 shadow-2xl">
              <div className="bg-white rounded-2xl overflow-hidden">
                {/* Mock header */}
                <div className="bg-slate-800 px-5 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 bg-slate-700 rounded-md h-5 mx-4" />
                </div>

                {/* Mock result content */}
                <div className="p-5 space-y-4">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    診断結果 — 現状 vs 理想の比較
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Current mock */}
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                      <div className="text-xs font-bold text-slate-500 mb-2">🔴 現状</div>
                      <div className="flex items-center justify-center gap-1 py-2">
                        <span className="text-2xl">🏢</span>
                      </div>
                      <div className="w-px h-4 bg-slate-300 mx-auto" />
                      <div className="flex justify-center gap-2 mt-1">
                        {['🏪','🏪','🏪'].map((s,i) => (
                          <div key={i} className="text-center">
                            <span className="text-lg">{s}</span>
                            <div className="text-xs text-slate-400 mt-0.5">0台</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-center text-xs font-bold text-red-500">端末不足</div>
                    </div>
                    {/* Ideal mock */}
                    <div className="rounded-xl bg-blue-50 border border-blue-300 p-3">
                      <div className="text-xs font-bold text-blue-500 mb-2">🔵 理想</div>
                      <div className="flex items-center justify-center gap-1 py-2">
                        <span className="text-2xl">🏢</span>
                      </div>
                      <div className="w-px h-4 bg-blue-300 mx-auto" />
                      <div className="flex justify-center gap-2 mt-1">
                        {['🏪','🏪','🏪'].map((s,i) => (
                          <div key={i} className="text-center">
                            <span className="text-lg">{s}</span>
                            <div className="text-xs text-blue-500 mt-0.5">📱×3</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-center text-xs font-bold text-blue-600">MDM管理済み</div>
                    </div>
                  </div>
                  {/* Gap badge mock */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-center text-xs font-semibold text-amber-700">
                    📦 あと9台追加で理想の運用が実現
                  </div>
                  {/* Price mock */}
                  <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-2">
                    {[['6ヶ月','¥62,820/月'],['12ヶ月','¥53,820/月']].map(([p,v]) => (
                      <div key={p} className="text-center">
                        <div className="text-xs text-slate-400">{p}</div>
                        <div className="text-sm font-bold text-slate-700">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-blue-300 text-xs text-center">
              ※ 上記はイメージです。実際の診断結果はヒアリング内容に基づきます。
            </p>
          </div>
        </div>
      </div>

      {/* Value props strip */}
      <div className="bg-black/20 backdrop-blur border-t border-white/10">
        <div className="max-w-[1800px] mx-auto px-10 py-6 grid grid-cols-4 gap-6 text-center">
          {[
            { emoji: '🚀', label: 'キッティング済み配送', sub: '届いた日から使える' },
            { emoji: '🔒', label: 'MDM管理込み', sub: '遠隔ロック・アプリ配信' },
            { emoji: '🛠️', label: '故障・代替機対応', sub: 'サポートも一括委託' },
            { emoji: '📊', label: '料金シミュレーター付き', sub: '台数・期間を自由に試算' },
          ].map((v) => (
            <div key={v.label} className="space-y-1">
              <div className="text-2xl">{v.emoji}</div>
              <div className="text-sm font-semibold text-white">{v.label}</div>
              <div className="text-xs text-blue-300">{v.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
