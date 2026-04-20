// frontend/pages/index.js
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { toast, ToastContainer } from 'react-toastify';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

const FileUpload = () => {
  const [csvData, setCsvData] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      toast.error('Nenhum arquivo CSV foi selecionado.', { position: 'top-center', autoClose: 5000 });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('O arquivo CSV deve ter no máximo 10MB.', { position: 'top-center', autoClose: 5000 });
      return;
    }

    const formData = new FormData();
    formData.append('csv', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setCsvData(result.data);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error, { position: 'top-center', autoClose: 5000 });
      }
    } catch (error) {
      toast.error('Erro ao enviar o arquivo.', { position: 'top-center', autoClose: 5000 });
    }
  };

  return (
    <div>
      <ToastContainer />
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {csvData && <Map data={csvData} />}
    </div>
  );
};

export default FileUpload;
