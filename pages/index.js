import React, { useState } from 'react';
import Map from '../components/Map';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FileUpload() {
  const [csvData, setCsvData] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      toast.error('Nenhum arquivo selecionado.', { position: toast.POSITION.TOP_CENTER });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 10MB.', { position: toast.POSITION.TOP_CENTER });
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
        const errorResult = await response.json();
        toast.error(errorResult.error, { position: toast.POSITION.TOP_CENTER });
      }
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
      toast.error('Erro ao enviar o arquivo.', { position: toast.POSITION.TOP_CENTER });
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <ToastContainer />
      <Map csvData={csvData} />
    </div>
  );
}
