// backend/utils/csvParser.js
const Papa = require('papaparse');
const chardet = require('chardet');
const iconv = require('iconv-lite');

const parseAndValidateCSV = (csvText) => {
  let encoding = 'utf-8';
  try {
    const detected = chardet.detect(Buffer.from(csvText));
    encoding = detected || 'utf-8';
  } catch (error) {
    console.warn('Erro ao detectar encoding, usando UTF-8 como fallback:', error);
  }

  let decodedCsvText = csvText;
  if (encoding !== 'utf-8' && encoding !== 'ascii') {
    try {
      decodedCsvText = iconv.decode(Buffer.from(csvText), encoding);
    } catch (error) {
      throw new Error('Erro ao converter o encoding do arquivo para UTF-8.');
    }
  }

  const result = Papa.parse(decodedCsvText, {
    header: true,
    dynamicTyping: true,
  });

  if (result.errors.length > 0) {
    throw new Error(`Erro ao analisar o CSV: ${result.errors.map(e => e.message).join(', ')}`);
  }

  if (!result.data || result.data.length === 0) {
    throw new Error('O arquivo CSV está vazio.');
  }

  const validatedData = result.data.map(row => {
    if (typeof row.latitude === 'undefined' || typeof row.longitude === 'undefined') {
      throw new Error('O arquivo CSV deve conter colunas \'latitude\' e \'longitude\'.');
    }

    const latitude = parseFloat(String(row.latitude).replace(',', '.'));
    const longitude = parseFloat(String(row.longitude).replace(',', '.'));

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('O arquivo CSV deve conter colunas \'latitude\' e \'longitude\' com valores numéricos válidos.');
    }

    return { latitude, longitude };
  });

  return validatedData;
};

module.exports = { parseAndValidateCSV };