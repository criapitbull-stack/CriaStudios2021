import { useState, useEffect } from 'react';
import { FileText, Download, Send, Check, AlertCircle, ArrowLeft, Type } from 'lucide-react';

interface ContractData {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
}

interface ContractPageProps {
  contractId?: string | null;
}

export default function ContractPage({ contractId }: ContractPageProps) {
  const [contractData, setContractData] = useState<ContractData>({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
  });
  
  const [pdfUrl] = useState<string>('/Contrato_REISM_King_Cinema_Profissional_v2.pdf');
  const [signature1Text, setSignature1Text] = useState('');
  const [signature2Text, setSignature2Text] = useState('');
  const [contractUrl, setContractUrl] = useState('');
  const [error, setError] = useState('');
  const [showSignature1, setShowSignature1] = useState(false);
  const [showSignature2, setShowSignature2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar dados do contrato se tiver ID
  useEffect(() => {
    if (contractId) {
      const savedData = localStorage.getItem(`contract_${contractId}`);
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          setContractData(data.contractData);
          setSignature1Text(data.signature1Text);
          setSignature2Text(data.signature2Text);
        } catch (err) {
          console.error('Erro ao carregar dados do contrato:', err);
        }
      }
    }
  }, [contractId]);

  // Salvar dados automaticamente
  useEffect(() => {
    if (contractId && (contractData.nome || contractData.cpf || signature1Text || signature2Text)) {
      const dataToSave = {
        contractData,
        signature1Text,
        signature2Text,
        timestamp: Date.now()
      };
      localStorage.setItem(`contract_${contractId}`, JSON.stringify(dataToSave));
    }
  }, [contractData, signature1Text, signature2Text, contractId]);
  
  const [pdfUrl] = useState<string>('/Contrato_REISM_King_Cinema_Profissional_v2.pdf');
  const [signature1Text, setSignature1Text] = useState('');
  const [signature2Text, setSignature2Text] = useState('');
  const [contractUrl, setContractUrl] = useState('');
  const [error, setError] = useState('');
  const [showSignature1, setShowSignature1] = useState(false);
  const [showSignature2, setShowSignature2] = useState(false);

  const generateContractUrl = () => {
    const id = contractId || Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    const baseUrl = window.location.origin;
    return `${baseUrl}/#CONTRATO${id}`;
  };

  const handleDownload = async () => {
    if (!signature1Text || !signature2Text) {
      setError('Por favor, assine o contrato em ambos os campos.');
      return;
    }

    if (!contractData.nome || !contractData.cpf) {
      setError('Por favor, preencha nome e CPF.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Usar pdf-lib para modificar o PDF original
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
      const pdfBytes = await fetch(pdfUrl).then(res => {
        if (!res.ok) throw new Error('Não foi possível carregar o PDF');
        return res.arrayBuffer();
      });
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Adicionar fontes
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Obter páginas
      const pages = pdfDoc.getPages();
      const today = new Date().toLocaleDateString('pt-BR');
      
      // Adicionar dados na primeira página (onde estão os campos da modelo)
      if (pages.length > 0) {
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
        
        // DADOS DA MODELO - primeira página (coordenadas ajustadas para campos existentes)
        // MODELO Nome: _______________________________
        firstPage.drawText(contractData.nome, {
          x: 120,
          y: height - 350,
          size: 10,
          font: font,
          color: rgb(0, 0, 0),
        });
        
        // CPF: __________________
        firstPage.drawText(contractData.cpf, {
          x: 120,
          y: height - 375,
          size: 10,
          font: font,
          color: rgb(0, 0, 0),
        });
        
        // Telefone: __________________
        firstPage.drawText(contractData.telefone, {
          x: 120,
          y: height - 400,
          size: 10,
          font: font,
          color: rgb(0, 0, 0),
        });
        
        // E-mail: _____________________________________________
        firstPage.drawText(contractData.email, {
          x: 120,
          y: height - 425,
          size: 10,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
      
      // Adicionar dados na última página (ASSINATURAS)
      if (pages.length > 1) {
        const lastPage = pages[1];
        const { width, height } = lastPage.getSize();
        
        // ASSINATURAS - última página (coordenadas ajustadas para campos existentes)
        // CONTRATANTE / AGÊNCIA MODELO
        // NOME DA MODELO EXEMPLO NOME VAI AQUI____________________________
        lastPage.drawText(contractData.nome, {
          x: 280,
          y: height - 180,
          size: 9,
          font: font,
          color: rgb(0, 0, 0),
        });
        
        // Assinatura MODELO: _________________________
        lastPage.drawText(signature1Text, {
          x: 280,
          y: height - 230,
          size: 9,
          font: font,
          color: rgb(0, 0, 0),
        });
        
        // Data MODELO: ____/____/________
        lastPage.drawText(today, {
          x: 280,
          y: height - 250,
          size: 8,
          font: font,
          color: rgb(0, 0, 0),
        });
        
        // Assinatura CONTRATANTE: _________________________
        lastPage.drawText(signature2Text, {
          x: 80,
          y: height - 230,
          size: 9,
          font: font,
          color: rgb(0, 0, 0),
        });
        
        // Data CONTRATANTE: ____/____/________
        lastPage.drawText(today, {
          x: 80,
          y: height - 250,
          size: 8,
          font: font,
          color: rgb(0, 0, 0),
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
      
      // Limpar URL temporária
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      // Gerar URL do contrato
      const contractUrlGenerated = generateContractUrl();
      setContractUrl(contractUrlGenerated);

    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      setError('Erro ao gerar o contrato. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (!contractData.nome || !contractData.cpf) {
      setError('Por favor, preencha nome e CPF.');
      return;
    }

    if (!signature1Text || !signature2Text) {
      setError('Por favor, assine o contrato em ambos os campos.');
      return;
    }

    setError('');

    try {
      // Gerar URL do contrato se ainda não existir
      const finalContractUrl = contractUrl || generateContractUrl();
      if (!contractUrl) {
        setContractUrl(finalContractUrl);
      }

      const message = `Olá! Assinei o contrato de modelo.\n\nNome: ${contractData.nome}\nCPF: ${contractData.cpf}\nTelefone: ${contractData.telefone}\nE-mail: ${contractData.email}\n\nAssinatura 1: ${signature1Text}\nAssinatura 2: ${signature2Text}\n\nLink do contrato: ${finalContractUrl}`;
      const whatsappUrl = `https://wa.me/5571993559126?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error('Erro ao enviar WhatsApp:', err);
      setError('Erro ao enviar WhatsApp. Tente novamente.');
    }
  };

  const goBack = () => {
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2 sm:py-8 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              Assinatura de Contrato
            </h1>
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input
                type="text"
                value={contractData.nome}
                onChange={(e) => setContractData({...contractData, nome: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input
                type="text"
                value={contractData.cpf}
                onChange={(e) => setContractData({...contractData, cpf: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="text"
                value={contractData.telefone}
                onChange={(e) => setContractData({...contractData, telefone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={contractData.email}
                onChange={(e) => setContractData({...contractData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* Visualizador de PDF */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
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
              style={{ height: '60vh', minHeight: '400px', border: 'none' }}
              title="Contrato PDF"
            />
          </div>
          
          <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
            Role para ver todas as páginas do contrato
          </p>
        </div>

        {/* Áreas de assinatura */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
              <Type className="w-4 h-4 sm:w-5 sm:h-5" />
              Assinatura - Página de Dados
            </h3>
            <button
              onClick={() => setShowSignature1(!showSignature1)}
              className="w-full mb-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm"
            >
              {showSignature1 ? 'Ocultar campo de assinatura' : 'Mostrar campo de assinatura'}
            </button>
            
            {showSignature1 && (
              <>
                <input
                  type="text"
                  value={signature1Text}
                  onChange={(e) => setSignature1Text(e.target.value)}
                  placeholder="Digite seu nome completo como assinatura"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-rose-500 text-sm"
                  style={{ fontFamily: 'cursive', fontSize: '18px' }}
                />
                <div className="flex gap-2 mt-2">
                  {signature1Text && (
                    <span className="text-xs sm:text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" /> Assinado
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
              <Type className="w-4 h-4 sm:w-5 sm:h-5" />
              Assinatura - Final do Contrato
            </h3>
            <button
              onClick={() => setShowSignature2(!showSignature2)}
              className="w-full mb-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm"
            >
              {showSignature2 ? 'Ocultar campo de assinatura' : 'Mostrar campo de assinatura'}
            </button>
            
            {showSignature2 && (
              <>
                <input
                  type="text"
                  value={signature2Text}
                  onChange={(e) => setSignature2Text(e.target.value)}
                  placeholder="Digite seu nome completo como assinatura"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-rose-500 text-sm"
                  style={{ fontFamily: 'cursive', fontSize: '18px' }}
                />
                <div className="flex gap-2 mt-2">
                  {signature2Text && (
                    <span className="text-xs sm:text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" /> Assinado
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
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                Baixar Contrato
              </>
            )}
          </button>

          <button
            onClick={handleSendWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-sm"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            Enviar via WhatsApp
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {contractUrl && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium mb-2 text-sm">Dados preenchidos com sucesso!</p>
            <p className="text-xs sm:text-sm text-green-600">Você pode baixar o contrato ou enviar via WhatsApp.</p>
          </div>
        )}
      </div>
    </div>
  );
}
