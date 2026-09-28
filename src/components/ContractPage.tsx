import { useState, useRef } from 'react';
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
  
  const [pdfUrl] = useState<string>('/Contrato_REISM_King_Cinema_Profissional_v2.pdf');
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature1Data, setSignature1Data] = useState('');
  const [signature2Data, setSignature2Data] = useState('');
  const [contractUrl, setContractUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showCanvas1, setShowCanvas1] = useState(false);
  const [showCanvas2, setShowCanvas2] = useState(false);
  
  const canvasRef1 = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);

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

  const handleDownload = () => {
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
      // Download do PDF original
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `contrato_${contractData.nome.replace(/\s+/g, '_')}.pdf`;
      link.click();
      
      // Gerar URL do contrato
      const contractUrlGenerated = generateContractUrl();
      setContractUrl(contractUrlGenerated);

    } catch (err) {
      console.error('Erro ao baixar PDF:', err);
      setError('Erro ao baixar o contrato. Tente novamente.');
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
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-rose-600 hover:text-rose-800 underline"
            >
              Abrir em nova aba
            </a>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <iframe
              src={pdfUrl}
              className="w-full"
              style={{ height: '80vh', minHeight: '600px', border: 'none' }}
              title="Contrato PDF"
            />
          </div>
          
          <p className="text-sm text-gray-500 mt-2 text-center">
            Se o PDF não carregar, clique em "Abrir em nova aba"
          </p>
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
