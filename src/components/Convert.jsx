import React, { useState, useEffect } from 'react';

export const Convert = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null); // Clear any previous errors
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null); // Clear any previous errors

    if (!selectedFile) {
      setError('Please select a PDF file to convert.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('File', selectedFile);

    try {
      const response = await fetch("https://v2.convertapi.com/convert/pdf/to/pptx?Secret=z0YRJaOXXK1NCpeZ&StoreFile=true", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.Error) {
        throw new Error(`ConvertAPI Error: ${data.Error.Message}`);
      }

      const { Url } = data.Files[0];
      setDownloadUrl(Url);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'converted.pptx');
      link.click();
      setDownloadUrl(null); 
    }
  }, [downloadUrl]);

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button type="button" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Converting...' : 'Convert to PPTX'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
