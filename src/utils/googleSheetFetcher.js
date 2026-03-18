import Papa from 'papaparse';

const SPREADSHEET_ID = '1iFppGIB8RdYz0MloD2JLL8WOL8sfTSRMokaoIqYICH4';
const SUMMARY_GID = '0';
const HOLDINGS_GID = '58859590';

const fetchCSV = async (gid) => {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
  const response = await fetch(url);
  const text = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};

export const fetchSheetData = async () => {
  try {
    const [summary, holdings] = await Promise.all([
      fetchCSV(SUMMARY_GID),
      fetchCSV(HOLDINGS_GID),
    ]);
    return { summary, holdings };
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
};
