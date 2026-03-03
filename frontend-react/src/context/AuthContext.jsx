import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    // Limpiar sessionStorage antes de hacer login para evitar datos obsoletos
    sessionStorage.removeItem('clases')
    sessionStorage.removeItem('misClases')
    sessionStorage.removeItem('adminUsers')
    sessionStorage.removeItem('ejercicios')
    sessionStorage.removeItem('guias')
    
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Limpiar también sessionStorage para evitar que un nuevo usuario vea datos del anterior
    sessionStorage.removeItem('clases')
    sessionStorage.removeItem('misClases')
    sessionStorage.removeItem('adminUsers')
    sessionStorage.removeItem('ejercicios')
    sessionStorage.removeItem('guias')
    setUser(null)
  }

  const updateUser = (updatedUserData) => {
    localStorage.setItem('user', JSON.stringify(updatedUserData))
    setUser(updatedUserData)
  }

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isDemo: user?.isDemo === true,
    isDemoAdmin: user?.isDemoAdmin === true
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
