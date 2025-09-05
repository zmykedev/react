import React from 'react'

export const DebugInfo: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <h4>🔍 DEBUG INFO</h4>
      <div>API_BASE_URL: {'/api/v1'}</div>
      <div>VITE_API_BASE_URL: {(import.meta as any).env?.VITE_API_BASE_URL || 'undefined'}</div>
      <div>NODE_ENV: {(import.meta as any).env?.NODE_ENV || 'undefined'}</div>
      <div>MODE: {(import.meta as any).env?.MODE || 'undefined'}</div>
      <div>DEV: {(import.meta as any).env?.DEV || 'undefined'}</div>
      <div>PROD: {(import.meta as any).env?.PROD || 'undefined'}</div>
      <hr />
      <div>URL actual: {window.location.href}</div>
      <div>User Agent: {navigator.userAgent}</div>
    </div>
  )
}
