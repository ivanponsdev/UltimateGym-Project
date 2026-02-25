import { useEffect } from 'react'

export default function CustomModal({ type = 'alert', message, onConfirm, onCancel, isOpen, iconType }) {
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onCancel()
        }
      }
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const isConfirm = type === 'confirm'
  
  // Determinar icono y clase basado en iconType explícito
  let iconClass = 'success'
  let icon = '✓'
  
  if (iconType === 'error') {
    iconClass = 'error'
    icon = '✗'
  } else if (iconType === 'warning') {
    iconClass = 'warning'
    icon = '⚠'
  } else if (iconType === 'success') {
    iconClass = 'success'
    icon = '✓'
  } else if (isConfirm) {
    iconClass = 'warning'
    icon = '⚠'
  }

  return (
    <div className="custom-modal-overlay" onClick={onCancel}>
      <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={`custom-modal-icon ${iconClass}`}>
          {icon}
        </div>
        <p className="custom-modal-message">{message}</p>
        <div className="custom-modal-buttons">
          {isConfirm ? (
            <>
              <button className="btn-modal-cancel" onClick={onCancel}>
                Cancelar
              </button>
              <button className="btn-modal-confirm" onClick={onConfirm}>
                Confirmar
              </button>
            </>
          ) : (
            <button className="btn-modal-ok" onClick={onCancel}>
              Aceptar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
