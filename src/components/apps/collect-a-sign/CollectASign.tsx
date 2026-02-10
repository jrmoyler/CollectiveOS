import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Trash2, PenTool, Check, FileText, Eraser } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  status: 'pending' | 'signed';
  dataUrl?: string;
}

export function CollectASign() {
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Service Agreement - TechCorp.pdf', status: 'pending' },
    { id: '2', name: 'NDA - CloudScale.pdf', status: 'pending' },
    { id: '3', name: 'SOW - RetailMax.pdf', status: 'signed' },
  ]);
  const [activeDoc, setActiveDoc] = useState<Document | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureMode, setSignatureMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
  }, [activeDoc, signatureMode]);

  const getCanvasCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    setIsDrawing(true);
    const pos = getCanvasCoords(e);
    lastPosRef.current = pos;
  }, [getCanvasCoords]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPosRef.current = pos;
  }, [getCanvasCoords]);

  const endDraw = useCallback(() => {
    isDrawingRef.current = false;
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const applySignature = useCallback(() => {
    if (!activeDoc || !canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL();
    setDocuments(prev => prev.map(d =>
      d.id === activeDoc.id ? { ...d, status: 'signed' as const, dataUrl } : d
    ));
    setActiveDoc(prev => prev ? { ...prev, status: 'signed', dataUrl } : null);
    setSignatureMode(false);
  }, [activeDoc]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      status: 'pending',
    };
    setDocuments(prev => [...prev, newDoc]);
    setActiveDoc(newDoc);
  }, []);

  return (
    <div className="flex h-full">
      {/* Document sidebar */}
      <div
        className="w-56 flex flex-col border-r shrink-0"
        style={{ borderColor: 'rgba(52, 211, 153, 0.08)' }}
      >
        <div className="p-3 border-b" style={{ borderColor: 'rgba(52, 211, 153, 0.08)' }}>
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 cursor-pointer transition-colors text-xs text-emerald-400">
            <Upload className="w-3.5 h-3.5" />
            Upload PDF
            <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto">
          {documents.map(doc => (
            <motion.button
              key={doc.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setActiveDoc(doc); setSignatureMode(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-slate-800/50 transition-colors ${
                activeDoc?.id === doc.id ? 'bg-emerald-500/10' : ''
              }`}
            >
              <FileText className={`w-4 h-4 shrink-0 ${
                doc.status === 'signed' ? 'text-emerald-400' : 'text-slate-500'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-300 truncate">{doc.name}</div>
                <div className={`text-[10px] ${
                  doc.status === 'signed' ? 'text-emerald-400' : 'text-slate-600'
                }`}>
                  {doc.status === 'signed' ? 'Signed' : 'Pending'}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Document view / Signature area */}
      <div className="flex-1 flex flex-col">
        {activeDoc ? (
          <>
            {/* Toolbar */}
            <div
              className="flex items-center justify-between px-4 py-2 border-b shrink-0"
              style={{ borderColor: 'rgba(52, 211, 153, 0.08)' }}
            >
              <span className="text-xs text-slate-400">{activeDoc.name}</span>
              <div className="flex items-center gap-2">
                {signatureMode && (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={clearCanvas}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] bg-slate-700/50 text-slate-400 hover:bg-slate-700"
                    >
                      <Eraser className="w-3 h-3" /> Clear
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={applySignature}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    >
                      <Check className="w-3 h-3" /> Apply
                    </motion.button>
                  </>
                )}
                {!signatureMode && activeDoc.status === 'pending' && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSignatureMode(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                  >
                    <PenTool className="w-3.5 h-3.5" /> Sign
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setDocuments(prev => prev.filter(d => d.id !== activeDoc.id));
                    setActiveDoc(null);
                  }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-ruby-500/10 hover:bg-ruby-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5 text-ruby-500" />
                </motion.button>
                {activeDoc.status === 'signed' && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] bg-emerald-500/20 text-emerald-400"
                  >
                    <Download className="w-3 h-3" /> Export
                  </motion.button>
                )}
              </div>
            </div>

            {/* Document content / Signature canvas */}
            <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
              {signatureMode ? (
                <div className="w-full max-w-lg">
                  <div className="text-center mb-4">
                    <h3 className="text-sm font-medium text-emerald-400">Draw Your Signature</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Use your mouse or finger to sign below</p>
                  </div>
                  <div
                    className="relative rounded-xl overflow-hidden"
                    style={{
                      background: 'rgba(15, 23, 42, 0.5)',
                      border: '2px dashed rgba(52, 211, 153, 0.3)',
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      className="w-full h-48 cursor-crosshair touch-none"
                      onMouseDown={startDraw}
                      onMouseMove={draw}
                      onMouseUp={endDraw}
                      onMouseLeave={endDraw}
                      onTouchStart={startDraw}
                      onTouchMove={draw}
                      onTouchEnd={endDraw}
                    />
                    {!isDrawing && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                        <PenTool className="w-8 h-8 text-emerald-400" />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="w-full max-w-lg aspect-[8.5/11] rounded-xl flex flex-col items-center justify-center gap-4"
                  style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid rgba(52, 211, 153, 0.08)',
                  }}
                >
                  <FileText className="w-16 h-16 text-slate-700" />
                  <div className="text-sm text-slate-400">{activeDoc.name}</div>
                  {activeDoc.status === 'signed' && activeDoc.dataUrl && (
                    <div className="mt-4 p-2 border border-emerald-500/20 rounded-lg">
                      <img src={activeDoc.dataUrl} alt="Signature" className="h-16 object-contain" />
                      <div className="text-[10px] text-emerald-400 text-center mt-1">Signature Applied</div>
                    </div>
                  )}
                  {activeDoc.status === 'pending' && (
                    <div className="text-[10px] text-slate-600">Click "Sign" to add your signature</div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500">
            <PenTool className="w-12 h-12 text-emerald-400/20" />
            <span className="text-sm">Select or upload a document</span>
            <span className="text-[10px] text-slate-600">Upload PDF files and sign them digitally</span>
          </div>
        )}
      </div>
    </div>
  );
}
