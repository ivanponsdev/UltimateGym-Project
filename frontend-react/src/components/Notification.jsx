import { useEffect } from 'react'

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  // Iconos según el tipo
  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div id="notification-container">
      <div className={`notification ${type}`}>
        <span className="notification-icon">{icons[type] || icons.info}</span>
        <span className="notification-message">{message}</span>
      </div>
    </div>
  )
}

export default Notification
