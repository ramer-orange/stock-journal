import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | 株レンズ",
  description: "株レンズのプライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-base-darker text-white">
      <div className="mx-auto w-full max-w-4xl px-6 py-16">
        <h1 className="mb-8 text-4xl font-semibold">プライバシーポリシー</h1>
        <div className="space-y-8 text-base leading-relaxed text-white/80">
          <section>
            <p>
              株レンズ（以下「当サービス」といいます。）は、ユーザーの個人情報の保護に関する法令を遵守し、個人情報の適切な取り扱いを実現するため、本プライバシーポリシーを定めます。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">1. 収集する情報</h2>
            <p className="mb-2">当サービスは、以下の情報を収集します。</p>
            <h3 className="mb-2 mt-4 text-xl font-semibold text-white">1.1 Google認証による情報</h3>
            <p className="mb-2">Googleアカウントによる認証を行う際に、以下の情報を取得します。</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>氏名</li>
              <li>メールアドレス</li>
              <li>GoogleアカウントID</li>
            </ul>
            <h3 className="mb-2 mt-4 text-xl font-semibold text-white">1.2 ユーザーが入力する情報</h3>
            <p className="mb-2">当サービスをご利用いただく際に、以下の情報を入力していただきます。</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>取引記録（銘柄名、証券コード、取引日、価格、数量、口座タイプ、資産クラスなど）</li>
              <li>取引に関するメモや学びの記録</li>
            </ul>
            <h3 className="mb-2 mt-4 text-xl font-semibold text-white">1.3 自動的に収集される情報</h3>
            <p className="mb-2">Cloudflare Access を利用したゼロトラスト認証およびアプリのセキュリティ監視のため、以下の技術情報を取得します。</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>アクセス元IPアドレス・タイムスタンプ・リクエストIDなどのアクセスログ（Cloudflare Access が保持するログを含みます）</li>
              <li>ブラウザや端末に関する情報（ユーザーエージェント、言語、画面サイズ等）</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">2. 情報の利用目的</h2>
            <p className="mb-2">当サービスは、収集した情報を以下の目的で利用します。</p>
            <ol className="ml-6 list-decimal space-y-2">
              <li>当サービスの提供、運営、維持、改善</li>
              <li>ユーザーからのお問い合わせへの対応</li>
              <li>ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等の案内</li>
              <li>メンテナンス、重要なお知らせなど必要に応じたご連絡</li>
              <li>利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため</li>
              <li>ユーザーにご自身の登録情報の閲覧、変更、削除、ご利用状況の閲覧を行っていただくため</li>
              <li>上記の利用目的に付随する目的</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">3. 情報の保存とセキュリティ</h2>
            <ol className="ml-6 list-decimal space-y-2">
              <li>当サービスは、Cloudflare D1データベース上で個人情報を暗号化して保存します。</li>
              <li>当サービスは、個人情報の漏洩、滅失または毀損を防止するため、セキュリティシステムの維持・管理体制の整備等、必要かつ適切な措置を講じます。</li>
              <li>当サービスは、Google認証により、許可されたアカウントのみがアクセス可能な仕組みを採用しています。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">4. 情報の第三者提供</h2>
            <p className="mb-2">当サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません。</p>
            <ol className="ml-6 list-decimal space-y-2">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難である場合</li>
              <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難である場合</li>
              <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがある場合</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">5. 個人情報の開示</h2>
            <p className="mb-2">当サービスは、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。</p>
            <ol className="ml-6 list-decimal space-y-2">
              <li>本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合</li>
              <li>当サービスの業務の適正な実施に著しい支障を及ぼすおそれがある場合</li>
              <li>その他法令に違反することとなる場合</li>
            </ol>
            <p className="mt-4">
              前項の定めにかかわらず、履歴情報および特性情報などの個人情報以外の情報については、原則として開示いたしません。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">6. 個人情報の訂正および削除</h2>
            <ol className="ml-6 list-decimal space-y-2">
              <li>ユーザーは、当サービスの保有する自己の個人情報が誤った情報である場合には、当サービスが定める手続により、当サービスに対して個人情報の訂正、追加または削除（以下「訂正等」といいます。）を請求することができます。</li>
              <li>当サービスは、ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。</li>
              <li>当サービスは、前項の規定に基づき訂正等を行った場合、または訂正等を行わない旨の決定をしたときは遅滞なく、これをユーザーに通知します。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">7. 個人情報の利用停止等</h2>
            <ol className="ml-6 list-decimal space-y-2">
              <li>当サービスは、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下「利用停止等」といいます。）を求められた場合には、遅滞なく必要な調査を行います。</li>
              <li>前項の調査結果に基づき、その請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の利用停止等を行います。</li>
              <li>当サービスは、前項の規定に基づき利用停止等を行った場合、または利用停止等を行わない旨の決定をしたときは、遅滞なく、これをユーザーに通知します。</li>
              <li>前2項にかかわらず、利用停止等に多額の費用を有する場合その他利用停止等を行うことが困難な場合であって、ユーザーの権利利益を保護するために必要なこれに代わるべき措置をとれる場合は、この代替策を講じるものとします。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">8. プライバシーポリシーの変更</h2>
            <ol className="ml-6 list-decimal space-y-2">
              <li>本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。</li>
              <li>当サービスが別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。</li>
            </ol>
          </section>

          {/* <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">9. お問い合わせ窓口</h2>
            <p>
              本ポリシーに関するお問い合わせ、個人情報の開示・訂正・利用停止等のご請求は、support@stock-journal.app までメールでお願いいたします。内容を確認のうえ、合理的な期間内に回答いたします。
            </p>
          </section> */}
        </div>
      </div>
    </main>
  );
}
