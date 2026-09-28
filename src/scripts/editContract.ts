import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

async function editContract() {
  const pdfPath = path.join(__dirname, '../../public/Contrato_REISM_King_Cinema_Profissional_v2.pdf');
  const outputPath = path.join(__dirname, '../../public/Contrato_REISM_King_Cinema_Profissional_v2.pdf');
  
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const pages = pdfDoc.getPages();
  
  // Página 3 (índice 2) - Substituir cláusula 8 e adicionar cláusula 9
  if (pages.length > 2) {
    const page3 = pages[2];
    const { width, height } = page3.getSize();
    
    // Cobrir área da cláusula 8 antiga (coordenadas aproximadas)
    page3.drawRectangle({
      x: 50,
      y: height - 150,
      width: 500,
      height: 120,
      color: rgb(1, 1, 1),
    });
    
    // Adicionar novo texto da cláusula 8
    const clause8Lines = [
      '8. DA RESCISÃO — SEM MULTA POR SAÍDA REGULAR',
      'A REISM e a MODELO poderão encerrar esta parceria a qualquer momento, por simples',
      'decisão de rescindir e sem necessidade de justificativa. A MODELO possui total',
      'liberdade para sair da agência a qualquer momento sem a aplicação de multas, desde',
      'que esteja totalmente em dia com os repasses das comissões devidas e sem nenhuma',
      'pendência financeira com a CONTRATANTE. Permanecem vigentes apenas obrigações',
      'que, por sua natureza, devam continuar, como a confidencialidade.'
    ];
    
    let yPosition = height - 140;
    clause8Lines.forEach((line, index) => {
      if (index === 0) {
        page3.drawText(line, {
          x: 50,
          y: yPosition,
          size: 11,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
      } else {
        page3.drawText(line, {
          x: 50,
          y: yPosition,
          size: 10,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
      yPosition -= 15;
    });
    
    // Adicionar nova cláusula 9
    yPosition -= 10;
    const clause9Lines = [
      '9. DA MULTA POR INADIMPLEMENTO (NÃO REPASSE DA COMISSÃO)',
      'Caso a MODELO realize saques diretamente das plataformas administradas ou',
      'intermediadas e deixe de efetuar o repasse obrigatório do percentual de 20%',
      '(vinte por cento) devido à AGÊNCIA, restará configurada a quebra contratual por',
      'inadimplemento.',
      '• Parágrafo Primeiro: A rescisão motivada por este descumprimento não será',
      '  isenta de ônus.',
      '• Parágrafo Segundo: A MODELO ficará sujeita ao pagamento imediato do valor',
      '  retido indevidamente atualizado, acrescido de uma multa penal compensatória',
      '  fixa no valor de R$ 1.000,00 (um mil reais), independentemente do valor do',
      '  saque realizado, servindo o presente instrumento como título executivo',
      '  extrajudicial.',
      '• Parágrafo Terceiro: Em caso de inadimplência, a AGÊNCIA cessará',
      '  imediatamente todos os serviços de suporte, gerenciamento e infraestrutura,',
      '  ficando a MODELO proibida de utilizar qualquer material visual, fotos, vídeos',
      '  promocionais ou artes produzidas pela AGÊNCIA, sob pena de responder por',
      '  violação de propriedade intelectual.'
    ];
    
    clause9Lines.forEach((line, index) => {
      if (index === 0) {
        page3.drawText(line, {
          x: 50,
          y: yPosition,
          size: 11,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
      } else {
        page3.drawText(line, {
          x: 50,
          y: yPosition,
          size: 9,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
      yPosition -= 12;
    });
  }
  
  // Página 4 (índice 3) - Renumerar cláusulas 9 e 10 para 10 e 11
  if (pages.length > 3) {
    const page4 = pages[3];
    const { width, height } = page4.getSize();
    
    // Cobrir "9. DOS INCENTIVOS E BENEFÍCIOS"
    page4.drawRectangle({
      x: 50,
      y: height - 100,
      width: 200,
      height: 15,
      color: rgb(1, 1, 1),
    });
    
    // Adicionar "10. DOS INCENTIVOS E BENEFÍCIOS"
    page4.drawText('10. DOS INCENTIVOS E BENEFÍCIOS', {
      x: 50,
      y: height - 90,
      size: 11,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    // Cobrir "10. DISPOSIÇÕES FINAIS"
    page4.drawRectangle({
      x: 50,
      y: height - 250,
      width: 150,
      height: 15,
      color: rgb(1, 1, 1),
    });
    
    // Adicionar "11. DISPOSIÇÕES FINAIS"
    page4.drawText('11. DISPOSIÇÕES FINAIS', {
      x: 50,
      y: height - 240,
      size: 11,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
  }
  
  const pdfBytesModified = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytesModified);
  
  console.log('Contrato editado com sucesso!');
}

editContract().catch(console.error);