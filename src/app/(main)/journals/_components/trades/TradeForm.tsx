export default function TradeForm() {
  return (
    <div>
      <p>売買記録</p>
      <form>
        <label>
          <span>売買日</span>
          <input type="date" name="tradedDate" />
        </label>
        <label>
          <span>売買区分</span>
          <select name="side" id="side">
            <option value="BUY">買い</option>
            <option value="SELL">売り</option>
          </select>
        </label>
        <label>
          <span>売買単価</span>
          <input type="number" name="priceValue" />
        </label>
        <label>
          <span>数量</span>
          <input type="number" name="quantityValue" />
        </label>
        <label>
          <span>売買理由</span>
          <textarea name="reason" />
        </label>
        <label>
          <span>メモ</span>
          <textarea name="memo" />
        </label>
        <button type="button">削除</button>
      </form>
    </div>
  );
}