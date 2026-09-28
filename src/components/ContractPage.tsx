import { useState, useRef, useEffect } from 'react';
import { FileText, Download, Send, PenTool, Check, AlertCircle, ArrowLeft } from 'lucide-react';

interface ContractData {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
}

export default function ContractPage() {
  const [contractData, setContractData] = useState<ContractData>({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
  });
  
  const [pdfUrl, setPdfUrl] = useState<string>('/Contrato_REISM_King_Cinema_Profissional_v2.pdf');
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature1Data, setSignature1Data] = useState('');
  const [signature2Data, setSignature2Data] = useState('');
  const [contractUrl, setContractUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showCanvas1, setShowCanvas1] = useState(false);
  const [showCanvas2, setShowCanvas2] = useState(false);
  const [useIframe, setUseIframe] = useState(false);
  
  const canvasRef1 = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carregar PDF usando pdf.js
    const loadPdf = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`;
        
        console.log('Tentando carregar PDF:', pdfUrl);
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        console.log('PDF carregado com sucesso, páginas:', pdf.numPages);
        setNumPages(pdf.numPages);
        
        // Renderizar primeira página
        renderPage(pdf, 1);
      } catch (err) {
        console.error('Erro ao carregar PDF:', err);
        setError('Erro ao carregar o PDF do contrato. Verifique se o arquivo existe.');
      }
    };

    loadPdf();
  }, [pdfUrl]);

  const renderPage = async (pdf: any, pageNum: number) => {
    try {
      const page = await pdf.getPage(pageNum);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      
      await page.render(renderContext).promise;
      
      if (pdfContainerRef.current) {
        pdfContainerRef.current.innerHTML = '';
        pdfContainerRef.current.appendChild(canvas);
      }
    } catch (err) {
      console.error('Erro ao renderizar página:', err);
    }
  };

  const setupCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>, signature: 'signature1' | 'signature2') => {
    setIsDrawing(true);
    const canvas = signature === 'signature1' ? canvasRef1.current : canvasRef2.current;
    if (!canvas) return;
    
    setupCanvas(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = (e.target as HTMLCanvasElement);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = (signature: 'signature1' | 'signature2') => {
    if (!isDrawing) return;
    
    const canvas = signature === 'signature1' ? canvasRef1.current : canvasRef2.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL();
    if (signature === 'signature1') {
      setSignature1Data(dataUrl);
    } else {
      setSignature2Data(dataUrl);
    }
    
    setIsDrawing(false);
  };

  const clearSignature = (signature: 'signature1' | 'signature2') => {
    const canvas = signature === 'signature1' ? canvasRef1.current : canvasRef2.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (signature === 'signature1') {
      setSignature1Data('');
    } else {
      setSignature2Data('');
    }
  };

  const generateContractUrl = () => {
    const contractId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    const baseUrl = window.location.origin;
    return `${baseUrl}/contrato/${contractId}`;
  };

  const handleDownload = async () => {
    if (!signature1Data || !signature2Data) {
      setError('Por favor, assine o contrato em ambos os campos.');
      return;
    }

    if (!contractData.nome || !contractData.cpf) {
      setError('Por favor, preencha nome e CPF.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Usar pdf-lib para modificar o PDF original
      const { PDFDocument, rgb } = await import('pdf-lib');
      const pdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Converter assinaturas para imagens e adicionar ao PDF
      const pngImage1 = await pdfDoc.embedPng(signature1Data);
      const pngImage2 = await pdfDoc.embedPng(signature2Data);
      
      // Adicionar assinaturas nas posições apropriadas
      const pages = pdfDoc.getPages();
      
      // Assinatura 1 (página de dados)
      if (pages.length > 0) {
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
        firstPage.drawImage(pngImage1, {
          x: width - 150,
          y: 50,
          width: 100,
          height: 40,
        });
      }
      
      // Assinatura 2 (última página)
      if (pages.length > 0) {
        const lastPage = pages[pages.length - 1];
        const { width, height } = lastPage.getSize();
        lastPage.drawImage(pngImage2, {
          x: width - 150,
          y: 50,
          width: 100,
          height: 40,
        });
      }
      
      // Salvar PDF modificado
      const pdfBytesModified = await pdfDoc.save();
      const blob = new Blob([pdfBytesModified], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Download do PDF
      const link = document.createElement('a');
      link.href = url;
      link.download = `contrato_${contractData.nome.replace(/\s+/g, '_')}.pdf`;
      link.click();
      
      // Gerar URL do contrato
      const contractUrlGenerated = generateContractUrl();
      setContractUrl(contractUrlGenerated);
      
      // Limpar URL temporária
      setTimeout(() => URL.revokeObjectURL(url), 100);

    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      setError('Erro ao gerar o contrato. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (!contractUrl) {
      setError('Primeiro gere o contrato para criar o link.');
      return;
    }

    const message = `Olá! Assinei o contrato de modelo.\n\nNome: ${contractData.nome}\nCPF: ${contractData.cpf}\nTelefone: ${contractData.telefone}\nE-mail: ${contractData.email}\n\nLink do contrato: ${contractUrl}`;
    const whatsappUrl = `https://wa.me/5571993559126?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const goBack = () => {
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Assinatura de Contrato
            </h1>
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input
                type="text"
                value={contractData.nome}
                onChange={(e) => setContractData({...contractData, nome: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input
                type="text"
                value={contractData.cpf}
                onChange={(e) => setContractData({...contractData, cpf: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="text"
                value={contractData.telefone}
                onChange={(e) => setContractData({...contractData, telefone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={contractData.email}
                onChange={(e) => setContractData({...contractData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Visualizador de PDF */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Contrato</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {currentPage} de {numPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                disabled={currentPage === numPages}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
          
          <div className="flex justify-center border border-gray-200 rounded-lg p-4 bg-gray-50" style={{ minHeight: '600px' }}>
            {useIframe ? (
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                style={{ minHeight: '600px', border: 'none' }}
                title="Contrato PDF"
              />
            ) : (
              <div 
                ref={pdfContainerRef}
                className="w-full h-full"
                style={{ minHeight: '600px' }}
              />
            )}
          </div>
          
          {error && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setUseIframe(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Tentar visualizador nativo
              </button>
            </div>
          )}
        </div>

        {/* Áreas de assinatura */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PenTool className="w-5 h-5" />
              Assinatura - Página de Dados
            </h3>
            <button
              onClick={() => setShowCanvas1(!showCanvas1)}
              className="w-full mb-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              {showCanvas1 ? 'Ocultar área de assinatura' : 'Mostrar área de assinatura'}
            </button>
            
            {showCanvas1 && (
              <>
                <canvas
                  ref={canvasRef1}
                  width={400}
                  height={150}
                  className="border-2 border-gray-300 rounded-lg bg-white cursor-crosshair w-full"
                  onMouseDown={(e) => startDrawing(e, 'signature1')}
                  onMouseMove={draw}
                  onMouseUp={() => stopDrawing('signature1')}
                  onMouseLeave={() => stopDrawing('signature1')}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => clearSignature('signature1')}
                    className="text-sm text-rose-600 hover:text-rose-800"
                  >
                    Limpar
                  </button>
                  {signature1Data && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Assinado
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PenTool className="w-5 h-5" />
              Assinatura - Final do Contrato
            </h3>
            <button
              onClick={() => setShowCanvas2(!showCanvas2)}
              className="w-full mb-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              {showCanvas2 ? 'Ocultar área de assinatura' : 'Mostrar área de assinatura'}
            </button>
            
            {showCanvas2 && (
              <>
                <canvas
                  ref={canvasRef2}
                  width={400}
                  height={150}
                  className="border-2 border-gray-300 rounded-lg bg-white cursor-crosshair w-full"
                  onMouseDown={(e) => startDrawing(e, 'signature2')}
                  onMouseMove={draw}
                  onMouseUp={() => stopDrawing('signature2')}
                  onMouseLeave={() => stopDrawing('signature2')}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => clearSignature('signature2')}
                    className="text-sm text-rose-600 hover:text-rose-800"
                  >
                    Limpar
                  </button>
                  {signature2Data && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Assinado
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin">⏳</span>
                Gerando...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Baixar Contrato Assinado
              </>
            )}
          </button>

          <button
            onClick={handleSendWhatsApp}
            disabled={!contractUrl}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            Enviar via WhatsApp
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {contractUrl && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium mb-2">Contrato gerado com sucesso!</p>
            <p className="text-sm text-green-600 break-all">Link do contrato: {contractUrl}</p>
          </div>
        )}
      </div>
    </div>
  );
}
