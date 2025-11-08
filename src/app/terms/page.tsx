import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | 株レンズ",
  description: "株レンズの利用規約",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-base-darker text-white">
      <div className="mx-auto w-full max-w-4xl px-6 py-16">
        <h1 className="mb-8 text-4xl font-semibold">利用規約</h1>
        <div className="space-y-8 text-base leading-relaxed text-white/80">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">第1条（適用）</h2>
            <p>
              本利用規約（以下「本規約」といいます。）は、株レンズ（以下「当サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下「ユーザー」といいます。）には、本規約に従って、当サービスをご利用いただきます。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">第2条（利用登録）</h2>
            <ol className="ml-6 list-decimal space-y-2">
              <li>当サービスへの利用登録を希望する者は、本規約に同意の上、Googleアカウントによる認証を行い、当サービスの定める方法によって利用登録を申請するものとします。</li>
              <li>当サービスは、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
                <ul className="ml-6 mt-2 list-disc space-y-1">
                  <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                  <li>本規約に違反したことがある者からの申請である場合</li>
                  <li>その他、当サービスが利用登録を相当でないと判断した場合</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">第3条（ユーザーIDおよびパスワードの管理）</h2>
            <ol className="ml-6 list-decimal space-y-2">
              <li>ユーザーは、自己の責任において、Googleアカウントの情報を適切に管理するものとします。</li>
              <li>ユーザーIDおよびパスワードが第三者に使用されたことによって生じた損害は、当サービスに故意または重大な過失がある場合を除き、当サービスは一切の責任を負わないものとします。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">第4条（利用料金および支払方法）</h2>
            <p>
              当サービスは、現時点において無料で提供しています。ただし、将来有料化する可能性があり、その場合は事前に通知いたします。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">第5条（禁止事項）</h2>
            <p className="mb-2">ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。</p>
            <ol className="ml-6 list-decimal space-y-2">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当サービスの内容等、当サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為</li>
              <li>当サービス、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
              <li>当サービスによって得られた情報を商業的に利用する行為</li>
              <li>当サービスの運営を妨害するおそれのある行為</li>
              <li>不正アクセス、不正な方法による情報の取得を試みる行為</li>
              <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
              <li>不正な目的を持って当サービスを利用する行為</li>
              <li>当サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為</li>
              <li>その他、当サービスが不適切と判断する行為</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">第6条（当サービスの提供の停止等）</h2>
            <ol className="ml-6 list-decimal space-y-2">
              <li>当サービスは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく当サービスの全部または一部の提供を停止または中断することができるものとします。
                <ul className="ml-6 mt-2 list-disc space-y-1">
                  <li>当サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                  <li>地震、落雷、火災、停電または天災などの不可抗力により、当サービスの提供が困難となった場合</li>
                  <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                  <li>その他、当サービスが当サービスの提供が困難と判断した場合</li>
                </ul>
              </li>
              <li>当サービスは、当サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">第7条（保証の否認および免責）</h2>
            <ol className="ml-6 list-decimal space-y-2">
              <li>当サービスは、当サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。</li>
              <li>当サービスは、当サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。ただし、当サービスとユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。</li>
              <li>前項ただし書に定める場合であっても、当サービスは、当サービスの過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害（当サービスまたはユーザーが損害発生につき予見し、または予見し得た場合を含みます。）について一切の責任を負いません。また、当サービスの過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害の賠償は、ユーザーから当該損害が発生した月に受領した利用料の額を上限とします。</li>
              <li>当サービスは、当サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">第8条（サービス内容の変更等）</h2>
            <p>
              当サービスは、ユーザーに通知することなく、当サービスの内容を変更しまたは当サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">第9条（利用規約の変更）</h2>
            <ol className="ml-6 list-decimal space-y-2">
              <li>当サービスは以下の場合には、ユーザーの個別の同意なく、本規約を変更することができるものとします。
                <ul className="ml-6 mt-2 list-disc space-y-1">
                  <li>本規約の変更がユーザーの一般の利益に適合するとき。</li>
                  <li>本規約の変更が当サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき。</li>
                </ul>
              </li>
              <li>当サービスはユーザーに対し、前項による本規約の変更にあたり、事前に、本規約を変更する旨および変更後の本規約の内容並びにその効力発生時期を通知いたします。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">第10条（個人情報の取扱い）</h2>
            <p>
              当サービスは、ユーザーの個人情報については、当サービスが別途定めるプライバシーポリシーに従い、適切に取り扱うものとします。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">第11条（通知または連絡）</h2>
            <p>
              ユーザーと当サービスとの間の通知または連絡は、当サービスの定める方法によって行うものとします。当サービスは、ユーザーから、当サービスが別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">第12条（権利義務の譲渡の禁止）</h2>
            <p>
              ユーザーは、当サービスの書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">第13条（準拠法・裁判管轄）</h2>
            <ol className="ml-6 list-decimal space-y-2">
              <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
              <li>当サービスに関して紛争が生じた場合には、当サービスの本店所在地を管轄する裁判所を専属的合意管轄とします。</li>
            </ol>
          </section>

          {/* <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">第14条（お問い合わせ窓口）</h2>
            <p>
              本規約に関するお問い合わせ、利用者情報の開示・訂正・削除の請求、その他当サービスへの連絡は、support@stock-journal.app までメールでご連絡ください。内容確認後、合理的な期間内に回答いたします。
            </p>
          </section> */}
        </div>
      </div>
    </main>
  );
}
