import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({ url, onClose }) {
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  if (!url || url.startsWith('memory://')) return <div className="p-6 text-xs text-gray-500">CV demo (chưa upload Cloudinary) — <a href={url} className="text-blue-600 underline">{url}</a>. Hãy cấu hình CLOUDINARY_* để xem PDF thật. <button onClick={onClose} className="ml-2 px-2 py-1 bg-white border rounded-lg">Đóng</button></div>;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto p-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <b className="text-sm">Xem CV</b>
          <div className="flex items-center gap-2">
            {pages > 1 && <><button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-2 py-1 text-xs border rounded-lg disabled:opacity-40">‹</button><span className="text-xs">{page}/{pages}</span><button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="px-2 py-1 text-xs border rounded-lg disabled:opacity-40">›</button></>}
            <a href={url} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 underline">Mở tab mới</a>
            <button onClick={onClose} className="px-3 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-bold">Đóng</button>
          </div>
        </div>
        <Document file={url} onLoadSuccess={({ numPages }) => setPages(numPages)} loading={<p className="text-xs text-gray-400 p-6">Đang tải PDF...</p>} error={<p className="text-xs text-red-600 p-6">Không tải được PDF. <a href={url} target="_blank" rel="noreferrer" className="underline">Mở trực tiếp</a></p>}>
          <Page pageNumber={page} width={720} renderTextLayer={false} />
        </Document>
      </div>
    </div>
  );
}
