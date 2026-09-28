import { useState, useRef, useEffect } from 'react';
import { FileText, Download, Send, PenTool, Check, AlertCircle } from 'lucide-react';

interface ContractData {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  assinatura1: string;
  assinatura2: string;
  data1: string;
  data2: string;
}

export default function ContractPage() {
  const [contractData, setContractData] = useState<ContractData>({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    assinatura1: '',
    assinatura2: '',
    data1: new Date().toISOString().split('T')[0],
    data2: new Date().toISOString().split('T')[0],
  });
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentSignature, setCurrentSignature] = useState<'signature1' | 'signature2' | null>(null);
  const [signature1Data, setSignature1Data] = useState('');
  const [signature2Data, setSignature2Data] = useState('');
  const [contractUrl, setContractUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  const canvasRef1 = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const contractRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Configurar contexto do canvas
    const setupCanvas = (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    };

    setupCanvas(canvasRef1.current);
    setupCanvas(canvasRef2.current);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>, signature: 'signature1' | 'signature2') => {
    setIsDrawing(true);
    setCurrentSignature(signature);
    const canvas = signature === 'signature1' ? canvasRef1.current : canvasRef2.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentSignature) return;
    
    const canvas = currentSignature === 'signature1' ? canvasRef1.current : canvasRef2.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !currentSignature) return;
    
    const canvas = currentSignature === 'signature1' ? canvasRef1.current : canvasRef2.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL();
    if (currentSignature === 'signature1') {
      setSignature1Data(dataUrl);
    } else {
      setSignature2Data(dataUrl);
    }
    
    setIsDrawing(false);
    setCurrentSignature(null);
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
    // Gera um ID único para o contrato
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
      // Abre uma nova janela com o contrato em formato de impressão
      const contractElement = contractRef.current;
      if (!contractElement) {
        throw new Error('Elemento do contrato não encontrado');
      }

      // Cria HTML para impressão
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Não foi possível abrir janela de impressão');
      }

      const printContent = contractElement.innerHTML;
      const printStyles = `
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .bg-white { background: white; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          .text-gray-800 { color: #1f2937; }
          .text-gray-600 { color: #4b5563; }
          .text-gray-700 { color: #374151; }
          .text-xl { font-size: 1.25rem; }
          .text-lg { font-size: 1.125rem; }
          .text-sm { font-size: 0.875rem; }
          .text-xs { font-size: 0.75rem; }
          .mb-2 { margin-bottom: 0.5rem; }
          .mb-4 { margin-bottom: 1rem; }
          .mb-6 { margin-bottom: 1.5rem; }
          .mb-8 { margin-bottom: 2rem; }
          .mt-2 { margin-top: 0.5rem; }
          .mt-4 { margin-top: 1rem; }
          .mt-8 { margin-top: 2rem; }
          .mt-12 { margin-top: 3rem; }
          .p-4 { padding: 1rem; }
          .p-8 { padding: 2rem; }
          .bg-gray-50 { background: #f9fafb; }
          .bg-rose-50 { background: #fff1f2; }
          .border { border: 1px solid #e5e7eb; }
          .border-2 { border: 2px solid #e5e7eb; }
          .border-gray-200 { border-color: #e5e7eb; }
          .border-gray-300 { border-color: #d1d5db; }
          .border-rose-200 { border-color: #fecdd3; }
          .rounded-lg { border-radius: 0.5rem; }
          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .gap-4 { gap: 1rem; }
          .gap-8 { gap: 2rem; }
          .pt-4 { padding-top: 1rem; }
          .pt-8 { padding-top: 2rem; }
          .prose { max-width: 65ch; }
          .max-w-none { max-width: none; }
          canvas { border: 2px solid #d1d5db; border-radius: 0.5rem; background: white; }
        </style>
      `;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Contrato - ${contractData.nome}</title>
          ${printStyles}
        </head>
        <body>
          ${printContent}
        </body>
        </html>
      `);
      printWindow.document.close();

      // Gera URL do contrato
      const url = generateContractUrl();
      setContractUrl(url);

    } catch (err) {
      console.error('Erro ao gerar contrato:', err);
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

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Assinatura de Contrato
          </h1>
          
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

        {/* Contrato para visualização e download */}
        <div ref={contractRef} className="bg-white rounded-lg shadow-lg p-8 mb-6" style={{ minHeight: '800px' }}>
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE AGENCIAMENTO DE MODELO DIGITAL</h2>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-2">CONTRATANTE / AGÊNCIA</h3>
            <p className="text-gray-600">REIS PRODUÇÕES CINEMATOGRÁFICAS</p>
            <p className="text-gray-600">CNPJ: 69.209.066/0001-92</p>
            <p className="text-gray-600">www.querofazerlive.com</p>
          </div>

          <div className="mb-6 p-4 bg-rose-50 rounded-lg border border-rose-200">
            <h3 className="font-bold text-gray-800 mb-2">MODELO</h3>
            <p className="text-gray-600"><strong>Nome:</strong> {contractData.nome || '________________________'}</p>
            <p className="text-gray-600"><strong>CPF:</strong> {contractData.cpf || '________________________'}</p>
            <p className="text-gray-600"><strong>Telefone:</strong> {contractData.telefone || '________________________'}</p>
            <p className="text-gray-600"><strong>E-mail:</strong> {contractData.email || '________________________'}</p>
          </div>

          <div className="prose max-w-none text-gray-700 mb-8">
            <h3 className="font-bold text-lg mb-2">1. DO OBJETO</h3>
            <p className="mb-4">
              O presente contrato tem por objeto a prestação de serviços de agenciamento, divulgação, orientação e suporte operacional 
              à CONTRATADA, para realização de atividades digitais, incluindo transmissões ao vivo (lives), videochamadas e divulgação 
              de perfil em plataformas destinadas ao público em geral.
            </p>

            <h3 className="font-bold text-lg mb-2">2. DAS OBRIGAÇÕES DA CONTRATANTE</h3>
            <p className="mb-4">
              A CONTRATANTE compromete-se a: (a) cadastrar a CONTRATADA nas plataformas digitais parceiras; (b) fornecer orientação 
              técnica e suporte para realização das atividades; (c) divulgar o perfil da CONTRATADA em seus canais de comunicação; 
              (d) remunerar a CONTRATADA conforme os termos estabelecidos nas plataformas.
            </p>

            <h3 className="font-bold text-lg mb-2">3. DAS OBRIGAÇÕES DA CONTRATADA</h3>
            <p className="mb-4">
              A CONTRATADA compromete-se a: (a) realizar as atividades digitais com profissionalismo e dedicação; (b) cumprir 
              as normas e regulamentos das plataformas; (c) manter seus dados atualizados; (d) respeitar os direitos de imagem 
              e privacidade.
            </p>

            <h3 className="font-bold text-lg mb-2">4. DA REMUNERAÇÃO</h3>
            <p className="mb-4">
              A remuneração da CONTRATADA será estabelecida conforme as políticas de cada plataforma digital, sendo paga 
              diretamente pela plataforma ou conforme acordado entre as partes.
            </p>

            <h3 className="font-bold text-lg mb-2">5. DO PRAZO</h3>
            <p className="mb-4">
              O presente contrato tem prazo indeterminado, podendo ser rescindido por qualquer das partes mediante aviso prévio 
              de 30 (trinta) dias.
            </p>

            <h3 className="font-bold text-lg mb-2">6. DA CONFIDENCIALIDADE</h3>
            <p className="mb-4">
              As partes comprometem-se a manter em sigilo todas as informações confidenciais obtidas durante a vigência deste 
              contrato, não as divulgando a terceiros sem prévia autorização.
            </p>

            <h3 className="font-bold text-lg mb-2">7. DISPOSIÇÕES GERAIS</h3>
            <p className="mb-4">
              O presente contrato constitui o acordo integral entre as partes, prevalecendo sobre quaisquer entendimentos 
              anteriores. Quaisquer alterações deverão ser feitas por escrito e assinadas por ambas as partes.
            </p>
          </div>

          {/* Assinaturas */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">ASSINATURA DA CONTRATANTE</h4>
              <div className="border-2 border-gray-300 rounded-lg bg-white h-24 mb-2 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Assinatura REIS PRODUÇÕES</p>
              </div>
              <p className="text-sm text-gray-600">Data: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>

            <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
              <h4 className="font-bold text-gray-800 mb-2">ASSINATURA DA MODELO</h4>
              <canvas
                ref={canvasRef1}
                width={300}
                height={96}
                className="border-2 border-gray-300 rounded-lg bg-white cursor-crosshair"
                onMouseDown={(e) => startDrawing(e, 'signature1')}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => clearSignature('signature1')}
                  className="text-xs text-rose-600 hover:text-rose-800"
                >
                  Limpar
                </button>
                {signature1Data && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Assinado
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">Data: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          {/* Segunda assinatura (final do contrato) */}
          <div className="mt-12 pt-8 border-t-2 border-gray-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">ASSINATURA FINAL - CONTRATANTE</h4>
                <div className="border-2 border-gray-300 rounded-lg bg-white h-24 mb-2 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">Assinatura REIS PRODUÇÕES</p>
                </div>
                <p className="text-sm text-gray-600">Data: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>

              <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                <h4 className="font-bold text-gray-800 mb-2">ASSINATURA FINAL - MODELO</h4>
                <canvas
                  ref={canvasRef2}
                  width={300}
                  height={96}
                  className="border-2 border-gray-300 rounded-lg bg-white cursor-crosshair"
                  onMouseDown={(e) => startDrawing(e, 'signature2')}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => clearSignature('signature2')}
                    className="text-xs text-rose-600 hover:text-rose-800"
                  >
                    Limpar
                  </button>
                  {signature2Data && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Assinado
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">Data: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              KING CINEMA PRODUCTIONS • REISM ESCRITÓRIO E AGÊNCIA DE MODELOS • www.querofazerlive.com
            </p>
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
                Baixar Contrato
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
