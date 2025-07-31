import UnderperformanceAlert from '@/components/UnderperformanceAlert';
import { checkUnderperformance } from '@/utils/checkUnderperformance';
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useData } from './DataContext'

export default function HorsePage() {
  const { name } = useParams()
  const { data } = useData()
  const navigate = useNavigate()

  const horseData = data.filter((entry) => entry.Horse === name)
  const [selectedRow, setSelectedRow] = useState(null)

  // Set default selection only once
  useEffect(() => {
    if (!selectedRow && horseData.length > 0) {
      setSelectedRow(horseData[0])
    }
  }, [selectedRow, horseData])

  const handleSelectRow = (row) => setSelectedRow(row)

  const displayValue = (row, key) =>
    row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== '' ? row[key] : '–'

  const sectionStyle = {
  marginTop: 30,
  padding: '1rem',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  fontFamily: 'sans-serif',
  maxWidth: '700px'
}

  return (
  <div
    style={{
      padding: 20,
      fontFamily: 'sans-serif',
      backgroundImage: `url('/DA467ABC-BDFF-4959-8021-9338AB8C9CC5.jpeg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh'
    }}
  >
      {selectedRow && (
        <>
          {/* FITNESS */}
          <section style={sectionStyle}>
            <h3 style={{ marginBottom: '0.5rem' }}>💓 Fitness & Recovery</h3>
            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
              <li><strong>Fast Recovery (% of Max HR):</strong> {displayValue(selectedRow, 'Fast Recovery in % of max HR')}</li>
              <li><strong>HR after 5 min:</strong> {displayValue(selectedRow, 'HR after 5 min in % of max HR')}</li>
              <li><strong>HR after 10 min:</strong> {displayValue(selectedRow, 'HR after 10 min in % of max HR')}</li>
              <li><strong>HR after 15 min:</strong> {displayValue(selectedRow, 'HR after 15 min in % of max HR')}</li>
              <li><strong>15-min Recovery Quality:</strong> {displayValue(selectedRow, '15min recovery quality')}</li>
            </ul>
          </section>

          {/* BIOMETRIC */}
          <section style={sectionStyle}>
            <h3 style={{ marginBottom: '0.5rem' }}>🧬 Biometric Data</h3>
            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
              <li><strong>Stride Length at 60 km/h:</strong> {displayValue(selectedRow, 'Stride length at 60 km/h')}</li>
              <li><strong>Stride Frequency at 60 km/h:</strong> {displayValue(selectedRow, 'Stride frequency at 60 km/h')}</li>
              <li><strong>Max Stride Frequency:</strong> {displayValue(selectedRow, 'Max Stride Frequency')}</li>
              <li><strong>Max Stride Length:</strong> {displayValue(selectedRow, 'Max stride length')}</li>
              <li><strong>Suggested Distance:</strong> {
                (() => {
                  const length = parseFloat(selectedRow['Max stride length'])
                  const freq = parseFloat(selectedRow['Max Stride Frequency'])
                  if (length && freq) {
                    if (length > 7.8) return 'Long distance'
                    if (length > 7.3) return 'Middle distance'
                    return 'Sprint'
                  }
                  return '–'
                })()
              }</li>
            </ul>
          </section>

          {/* SECTIONALS */}
          <section style={sectionStyle}>
            <h3 style={{ marginBottom: '0.5rem' }}>⏱️ Sectional Times</h3>
            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
              <li><strong>Last 800m:</strong> {displayValue(selectedRow, 'Time last 800m')}</li>
              <li><strong>Last 600m:</strong> {displayValue(selectedRow, 'Time last 600m')}</li>
              <li><strong>Last 400m:</strong> {displayValue(selectedRow, 'Time last 400m')}</li>
              <li><strong>Last 200m:</strong> {displayValue(selectedRow, 'Time last 200m')}</li>
              <li><strong>Best 600m:</strong> {displayValue(selectedRow, 'Time best 600m')}</li>
              <li><strong>Best 200m:</strong> {displayValue(selectedRow, 'Time best 200m')}</li>
            </ul>
          </section>
        </>
      )}
{selectedRow && (
  console.log('Selected session:', selectedRow);
  <UnderperformanceAlert
    horseName={selectedRow['Horse name'] || 'Selected Horse'}
    date={selectedRow['Date'] || selectedRow['date'] || 'Unknown'}
    issues={checkUnderperformance(selectedRow)}
  />
)}
      {/* SESSION HISTORY TABLE */}
      <section style={{ marginTop: 40 }}>
        <h3>📅 Session History</h3>
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', fontFamily: 'sans-serif' }}>
          <thead style={{ background: '#f0f0f0' }}>
            <tr>
              <th>Date</th>
              <th>Training Type</th>
              <th>Track Name</th>
              <th>Track Surface</th>
              <th>Track Condition</th>
            </tr>
          </thead>
          <tbody>
            {horseData.map((row, i) => (
              <tr
                key={i}
                onClick={() => handleSelectRow(row)}
                style={{
                  backgroundColor: row === selectedRow ? '#dbeafe' : 'white',
                  cursor: 'pointer'
                }}
              >
                <td>{row['Date'] || row['date'] || row['Timestamp'] || 'N/A'}</td>
                <td>{displayValue(row, 'Training type')}</td>
                <td>{displayValue(row, 'Track name')}</td>
                <td>{displayValue(row, 'Track surface')}</td>
                <td>{displayValue(row, 'Track condition')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div style={{ marginTop: 30 }}>
        <Link to="/">← Back to Horse List</Link>
      </div>
    </div>
  )
}