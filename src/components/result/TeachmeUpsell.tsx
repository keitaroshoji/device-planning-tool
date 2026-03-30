export function TeachmeUpsell() {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <span className="text-3xl">📚</span>
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 text-base">
            Teachme Biz とのセット導入がおすすめ
          </h3>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            デバイスレンタルと<strong>Teachme Biz（マニュアル共有SaaS）</strong>をセットにすることで、
            端末準備からマニュアル作成・共有・教育まで一気通貫で解決できます。
          </p>
          <ul className="mt-3 space-y-1">
            {[
              '現場スタッフがスマホでマニュアルを即閲覧',
              '動画・テキスト・画像を組み合わせたリッチなコンテンツ',
              '習得度テスト・進捗管理で教育効果を可視化',
              '多言語対応（外国人スタッフへの展開も容易）',
            ].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-orange-500 mt-0.5 shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
