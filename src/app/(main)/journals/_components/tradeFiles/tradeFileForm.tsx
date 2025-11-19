'use client';

import { createTradeFileAction, getTradeFilesAction, deleteTradeFileAction } from "@/app/(main)/journals/_actions/tradeFileActions";
import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  tradeId: number;
};

export default function TradeFileForm({ tradeId }: Props) {
  const [tradeFiles, setTradeFiles] = useState<{ id: number, r2Key: string, fileUrl: string }[]>([]);

  // 取引ファイルを一覧取得
  useEffect(() => {
    const fetchTradeFiles = async () => {
      // DBから、ファイルに関する情報を取得
      const result = await getTradeFilesAction(tradeId);
      if (result.success === false) {
        return;
      }

      // DBから取得したr2Keyを使って、GETエンドポイントのURLを生成
      const fileUrls = result.fileRows.map((fileRow) => ({
        id: fileRow.id,
        r2Key: fileRow.r2Key,
        fileUrl: `/api/fileUpload?key=${encodeURIComponent(fileRow.r2Key)}`,
      }));

      setTradeFiles(fileUrls);
    };
    fetchTradeFiles();
  }, [tradeId]);

  // ファイルアップロード時の処理
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('画像ファイルのみアップロードできます');
      e.target.value = '';
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tradeId', String(tradeId));

    // Server Actionを呼び出し (R2アップロード + DB保存)
    const result = await createTradeFileAction(formData);
    
    if (!result.success) {
      console.error("Failed to upsert trade file", result.errors);
      alert("アップロードに失敗しました");
      return;
    }

    // 成功したらstateを更新
    if (result.success) {
      setTradeFiles(prev => [...prev, {
        id: result.id,
        r2Key: result.r2Key,
        fileUrl: `/api/fileUpload?key=${encodeURIComponent(result.r2Key)}`
      }]);
    }

    // inputをクリア
    e.target.value = '';
  };

  // 取引ファイルの削除処理
  const handleDelete = async (id: number, r2Key: string) => {
    const result = await deleteTradeFileAction(id, r2Key);
    if (!result.success) {
      console.error("Failed to delete trade file", result.errors);
      return;
    }
    setTradeFiles(prevTradeFiles => prevTradeFiles.filter(tradeFile => tradeFile.id !== id));
  };

  return (
    <div>
      <h1>ファイルアップロード</h1>
      <div>
        {tradeFiles.map((tradeFile) => (
          <div key={tradeFile.id}>
            <Image src={tradeFile.fileUrl} alt="tradeFile" width={100} height={100} />
            <button onClick={() => handleDelete(tradeFile.id, tradeFile.r2Key)}>削除</button>
          </div>
        ))}
        <label>
          添付ファイル
          <input type="file" name="tradeFile" onChange={handleFileChange}/>
        </label>
      </div>
    </div>
  );
}
