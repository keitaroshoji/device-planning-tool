interface ContactCTAProps {
  companyName: string
  contactName: string
}

export function ContactCTA({ companyName, contactName }: ContactCTAProps) {
  return (
    <div className="bg-blue-600 rounded-2xl p-6 text-white text-center space-y-4">
      <div>
        <p className="text-blue-200 text-sm">
          {companyName && <span className="font-semibold">{companyName}</span>}
          {contactName && (
            <span>
              {' '}
              <span className="font-semibold">{contactName}</span> 様
            </span>
          )}
        </p>
        <h2 className="text-xl font-bold mt-1">
          担当者から詳細をご案内します
        </h2>
        <p className="text-blue-200 text-sm mt-1">
          ご入力いただいたメールアドレスに詳細資料をお送りします
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div className="bg-white/10 rounded-xl p-4">
          <p className="font-semibold text-sm mb-1">📧 メールでのご提案</p>
          <p className="text-blue-100 text-xs">
            ヒアリング内容をもとにカスタマイズされた提案書をお送りします
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <p className="font-semibold text-sm mb-1">📞 オンライン相談（無料）</p>
          <p className="text-blue-100 text-xs">
            担当者が30分でご要件を整理し、最適プランをご提案します
          </p>
        </div>
      </div>

      <p className="text-blue-200 text-xs">
        ※ 通常2営業日以内にご連絡いたします
      </p>
    </div>
  )
}
