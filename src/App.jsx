import React from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { useData } from '../DataContext.jsx';

export default function App() {
  console.log('✅ App.jsx is rendering!');
  console.log('App.jsx loaded');
  const { data, setData } = useData();
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryData = new Uint8Array(e.target.result);
      const workbook = XLSX.read(binaryData, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setData(json);
    };

    reader.readAsArrayBuffer(file);
  };

  // Get today's date and 90 days ago
  const now = new Date();
  const ninetyDaysAgo = new Date(now);
  ninetyDaysAgo.setDate(now.getDate() - 90);

  // Extract unique horses with recent data (last 90 days)
  const getRecentHorseNames = (data) => {
    const recentEntries = data.filter((row) => {
      const rawDate =
        row['Date'] || row['date'] || row['Timestamp'] || row['timestamp'];
      if (!rawDate) return false;

      // Convert dd/mm/yyyy to yyyy-mm-dd if needed
      const normalizedDateStr = rawDate.replace(
        /(\d{2})\/(\d{2})\/(\d{4})/,
        '$3-$2-$1'
      );
      const parsedDate = new Date(normalizedDateStr);

      return !isNaN(parsedDate) && parsedDate >= ninetyDaysAgo;
    });

    const horseNames = new Set(recentEntries.map((row) => row.Horse));
    return [...horseNames].sort();
  };

  const recentHorses = getRecentHorseNames(data);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Lees Racing App</h1>
      
      <h2>📁 Upload Racehorse Excel File</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {data.length > 0 && (
        <>
          <h3 style={{ marginTop: 20 }}>🐎 Select a Horse</h3>
          <ul style={{ paddingLeft: 20 }}>
            {recentHorses.map((horse) => (
              <li key={horse}>
                <button
                  style={{
                    margin: '4px 0',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    backgroundColor: '#efefef',
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/horse/${encodeURIComponent(horse)}`)}
                >
                  {horse}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}