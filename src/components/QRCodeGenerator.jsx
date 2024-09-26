import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { jsPDF } from 'jspdf';

const QRCodeGenerator = () => {
  const [ids, setIds] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [columns, setColumns] = useState(3);
  const [qrSize, setQRSize] = useState(40);
  const [marginTop, setMarginTop] = useState(10);
  const [marginLeft, setMarginLeft] = useState(10);
  const [gapHorizontal, setGapHorizontal] = useState(5);
  const [gapVertical, setGapVertical] = useState(5);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

  const pdfRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddIds = () => {
    const newIds = inputValue.split(',').map(id => id.trim()).filter(id => id !== '');
    setIds([...ids, ...newIds]);
    setInputValue('');
  };

  const generatePDF = (forPreview = false) => {
    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let y = marginTop;
    let x = marginLeft;
    let count = 0;

    ids.forEach((id, index) => {
      if (y + qrSize > pageHeight - marginTop) {
        pdf.addPage();
        y = marginTop;
        count = 0;
      }

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(id)}`;
      pdf.addImage(qrUrl, 'PNG', x, y, qrSize, qrSize);
      pdf.setFontSize(8);
      pdf.text(id, x + qrSize / 2, y + qrSize + 3, { align: 'center' });

      count++;
      if (count === columns) {
        x = marginLeft;
        y += qrSize + gapVertical + 5; // 5 for text height
        count = 0;
      } else {
        x += qrSize + gapHorizontal;
      }
    });

    if (forPreview) {
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfPreviewUrl(pdfUrl);
    } else {
      pdf.save('qr_codes_stickers.pdf');
    }
  };

  return (
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">QR Code Sticker Generator</h1>

        <div className="mb-4 flex gap-2">
          <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter IDs separated by commas"
              className="flex-grow"
          />
          <Button onClick={handleAddIds}>Add IDs</Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2">Columns: {columns}</label>
            <Slider
                min={1}
                max={10}
                step={1}
                value={[columns]}
                onValueChange={(value) => setColumns(value[0])}
            />
          </div>
          <div>
            <label className="block mb-2">QR Size (mm): {qrSize}</label>
            <Slider
                min={20}
                max={100}
                step={1}
                value={[qrSize]}
                onValueChange={(value) => setQRSize(value[0])}
            />
          </div>
          <div>
            <label className="block mb-2">Top Margin (mm): {marginTop}</label>
            <Slider
                min={0}
                max={50}
                step={1}
                value={[marginTop]}
                onValueChange={(value) => setMarginTop(value[0])}
            />
          </div>
          <div>
            <label className="block mb-2">Left Margin (mm): {marginLeft}</label>
            <Slider
                min={0}
                max={50}
                step={1}
                value={[marginLeft]}
                onValueChange={(value) => setMarginLeft(value[0])}
            />
          </div>
          <div>
            <label className="block mb-2">Horizontal Gap (mm): {gapHorizontal}</label>
            <Slider
                min={0}
                max={20}
                step={1}
                value={[gapHorizontal]}
                onValueChange={(value) => setGapHorizontal(value[0])}
            />
          </div>
          <div>
            <label className="block mb-2">Vertical Gap (mm): {gapVertical}</label>
            <Slider
                min={0}
                max={20}
                step={1}
                value={[gapVertical]}
                onValueChange={(value) => setGapVertical(value[0])}
            />
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Button onClick={() => generatePDF(true)} className="flex-1">Preview PDF</Button>
          <Button onClick={() => generatePDF(false)} className="flex-1">Download PDF</Button>
        </div>

        {pdfPreviewUrl && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">PDF Preview</h2>
              <iframe
                  src={pdfPreviewUrl}
                  width="100%"
                  height="1000px"
                  title="PDF Preview"
                  ref={pdfRef}
              />
            </div>
        )}
      </div>
  );
};

export default QRCodeGenerator;