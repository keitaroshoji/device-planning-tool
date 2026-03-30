import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex flex-col items-center justify-center px-4 text-white">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Logo / Brand */}
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm font-medium text-blue-100 mb-6">
            <span>📱</span> Studist デバイスレンタルサービス
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            デバイスプランニング
          </h1>
          <p className="mt-3 text-blue-200 text-lg">
            あなたの事業に最適な
            <br />
            デバイスプランを診断します
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          {[
            '✅ 所要時間 約3分',
            '✅ 8つの質問に回答するだけ',
            '✅ 料金シミュレーター付き',
            '✅ 担当者から詳細ご案内',
          ].map((f) => (
            <span
              key={f}
              className="bg-white/10 backdrop-blur rounded-full px-3 py-1 text-blue-100"
            >
              {f}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link
            href="/wizard?step=1"
            className="block w-full bg-white text-blue-700 font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-blue-50 transition-all text-center"
          >
            診断スタート →
          </Link>
          <p className="text-blue-300 text-sm">
            入力した情報は担当者からのご連絡にのみ使用します
          </p>
        </div>

        {/* Value props */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-center">
          {[
            { emoji: '🚀', label: 'キッティング済み', sub: '届いた日から使える' },
            { emoji: '🔒', label: 'MDM管理込み', sub: '紛失・セキュリティ対策' },
            { emoji: '🛠️', label: '運用サポート', sub: '故障対応・交換まで' },
          ].map((v) => (
            <div key={v.label} className="space-y-1">
              <div className="text-2xl">{v.emoji}</div>
              <div className="text-xs font-semibold">{v.label}</div>
              <div className="text-xs text-blue-300">{v.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
