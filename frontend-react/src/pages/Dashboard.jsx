import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userAPI, clasesAPI, ejerciciosAPI, guiasAPI, BACKEND_URL } from '../services/api'
import Sidebar from '../components/Sidebar'
import CustomModal from '../components/CustomModal'

import { EjercicioCard, GuiaCard, ClaseCard } from '../components/CardComponents'

// Componente para la sección de ejercicios
const EjerciciosSection = ({ onSelectEjercicio }) => {
  const [ejercicios, setEjercicios] = useState([])
  const [ejerciciosFiltrados, setEjerciciosFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroGrupo, setFiltroGrupo] = useState('')
  const [filtroEquipamiento, setFiltroEquipamiento] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const gruposMusculares = ['pecho', 'espalda', 'piernas', 'hombros', 'brazos', 'core']

  useEffect(() => {
    cargarEjercicios()
    // Refrescar ejercicios cada 30 segundos para sincronización en tiempo real
    const interval = setInterval(cargarEjercicios, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    aplicarFiltros()
  }, [ejercicios, filtroGrupo, filtroEquipamiento, busqueda])

  const cargarEjercicios = async () => {
    try {
      setLoading(true)
      const data = await ejerciciosAPI.obtenerTodos()
      setEjercicios(data)
      setError('')
    } catch (error) {
      console.error('Error al cargar ejercicios:', error)
      setError('Error al cargar ejercicios: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const aplicarFiltros = () => {
    let filtrados = ejercicios
    if (filtroGrupo) filtrados = filtrados.filter(ej => ej.grupoMuscular === filtroGrupo)
    if (filtroEquipamiento) filtrados = filtrados.filter(ej => ej.equipamiento === filtroEquipamiento)
    if (busqueda) {
      filtrados = filtrados.filter(ej => 
        ej.nombre.toLowerCase().includes(busqueda.toLowerCase())
      )
    }
    setEjerciciosFiltrados(filtrados)
  }

  const limpiarFiltros = () => {
    setFiltroGrupo('')
    setFiltroEquipamiento('')
    setBusqueda('')
  }

  if (loading) {
    return (
      <section className="content-section active">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando ejercicios...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="content-section active">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={cargarEjercicios} className="btn-neon">Reintentar</button>
        </div>
      </section>
    )
  }

  return (
    <section className="content-section active">
      <h2>💪 Biblioteca de Ejercicios</h2>
      <p style={{marginBottom: '1.5rem', color: 'var(--text-color-dark)'}}>
        Explora ejercicios organizados por grupo muscular y equipamiento
      </p>

      {/* Filtros */}
      <div className="filtros-ejercicios">
        <input
          type="text"
          placeholder="Buscar ejercicios..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
        <div className="filtro-selects">
          <select value={filtroGrupo} onChange={(e) => setFiltroGrupo(e.target.value)} className="filter-select">
            <option value="">Todos los grupos</option>
            {gruposMusculares.map(grupo => (
              <option key={grupo} value={grupo}>{grupo.charAt(0).toUpperCase() + grupo.slice(1)}</option>
            ))}
          </select>
          
          <div className="filtro-equipamiento-buttons">
            <button 
              className={`btn-equipamiento ${filtroEquipamiento === 'casa' ? 'active' : ''}`}
              onClick={() => setFiltroEquipamiento(filtroEquipamiento === 'casa' ? '' : 'casa')}
              title="Ejercicios en casa"
            >
              🏠
            </button>
            <button 
              className={`btn-equipamiento ${filtroEquipamiento === 'gimnasio' ? 'active' : ''}`}
              onClick={() => setFiltroEquipamiento(filtroEquipamiento === 'gimnasio' ? '' : 'gimnasio')}
              title="Ejercicios de gimnasio"
            >
              🏋️
            </button>
          </div>
          
          {(filtroGrupo || filtroEquipamiento || busqueda) && (
            <button onClick={limpiarFiltros} className="btn-clear-filters">✕ Limpiar</button>
          )}
        </div>
      </div>

      {/* Grid de ejercicios */}
      <div className="ejercicios-grid">
        {ejerciciosFiltrados.length > 0 ? (
          ejerciciosFiltrados.map(ejercicio => (
            <EjercicioCard 
              key={ejercicio._id} 
              ejercicio={ejercicio}
              onClickEjercicio={onSelectEjercicio}
            />
          ))
        ) : (
          <div className="sin-resultados">
            <h3>🔍 No se encontraron ejercicios</h3>
            <p>Intenta ajustar los filtros o la búsqueda</p>
            <button onClick={limpiarFiltros} className="btn-neon">Ver todos</button>
          </div>
        )}
      </div>
    </section>
  )
}

// Componente para la sección de guías
const GuiasSection = () => {
  const [guias, setGuias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enviandoEmail, setEnviandoEmail] = useState(false)
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    cargarGuias()
    // Refrescar guías cada 30 segundos para sincronización en tiempo real
    const interval = setInterval(cargarGuias, 30000)
    return () => clearInterval(interval)
  }, [user?.objetivo]) // Recarga cuando cambia el objetivo del usuario

  const cargarGuias = async () => {
    try {
      setLoading(true)
      // Si es admin, obtener todas las guías, si no, solo las del usuario
      const data = isAdmin 
        ? await guiasAPI.obtenerTodas()
        : await guiasAPI.obtenerMisGuias()
      setGuias(data)
      setError('')
    } catch (error) {
      console.error('Error al cargar guías:', error)
      setError('Error al cargar guías: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const obtenerColorObjetivo = (objetivo) => {
    const colores = {
      aumento_masa_muscular: '#e74c3c',
      recomposicion_corporal: '#f39c12',
      perdida_grasa: '#2ecc71',
      todos: '#3498db'
    }
    return colores[objetivo] || '#95a5a6'
  }

  const formatearObjetivo = (objetivo) => {
    const nombres = {
      aumento_masa_muscular: 'Aumento de Masa Muscular',
      recomposicion_corporal: 'Recomposición Corporal',
      perdida_grasa: 'Pérdida de Grasa',
      todos: 'Todos los Objetivos'
    }
    return nombres[objetivo] || objetivo
  }

  const descargarGuia = (guia) => {
    // Crear un enlace para descargar el PDF
    const link = document.createElement('a')
    // Normalizar la ruta: quitar prefijo 'backend/' y backslashes de Windows
    const url = guia.archivoUrl.replace(/\\/g, '/').replace(/^backend\//, '')
    link.href = `${BACKEND_URL}/${url}`
    link.download = `${guia.titulo}.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const enviarGuiasEmail = async (guiaId) => {
    if (!guiaId) {
      alert('❌ Error: ID de guía no proporcionado')
      return
    }
    
    try {
      setEnviandoEmail(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${BACKEND_URL}/api/email/send-guides`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ guiaId })
      })
      if (!response.ok) throw new Error('Error en la petición')
      alert(`✉️ Guía enviada correctamente a tu correo`)
    } catch (error) {
      console.error('Error al enviar guía:', error)
      alert('❌ Error al enviar guía: ' + (error.message))
    } finally {
      setEnviandoEmail(false)
    }
  }

  if (loading) {
    return (
      <section className="content-section active">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando guías...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="content-section active">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={cargarGuias} className="btn-neon">Reintentar</button>
        </div>
      </section>
    )
  }

  return (
    <section className="content-section active">
      <h2>📚 {isAdmin ? 'Gestión de Guías' : 'Mis Guías'}</h2>
      <p style={{marginBottom: '1.5rem', color: 'var(--text-color-dark)'}}>
        {isAdmin 
          ? 'Todas las guías del sistema'
          : user?.objetivo 
            ? `Guías personalizadas basadas en tu objetivo: ${formatearObjetivo(user.objetivo)}`
            : 'Guías generales disponibles para ti'
        }
      </p>

      {!isAdmin && (
        <div
          className="card"
          style={{
            marginBottom: '1rem',
            border: '1px solid var(--secondary-color)',
            minHeight: 'auto',
            display: 'block'
          }}
        >
          <strong>Nota:</strong> Estás usando la cuenta demo, por lo que la funcionalidad de enviar guías a tu email personal está deshabilitada.
        </div>
      )}



      {guias.length === 0 ? (
        <div className="sin-resultados">
          <h3>📖 No hay guías disponibles</h3>
          <p>{isAdmin ? 'No hay guías en el sistema' : `Actualmente no hay guías ${user?.objetivo ? 'para tu objetivo' : 'disponibles'}`}</p>
        </div>
      ) : (
        <div className="ejercicios-grid">
          {guias.map(guia => (
            <GuiaCard
              key={guia._id}
              guia={guia}
              descargarGuia={descargarGuia}
              formatearObjetivo={formatearObjetivo}
              obtenerColorObjetivo={obtenerColorObjetivo}
              enviarGuiaEmail={null}
              emailDisabledReason={!isAdmin ? 'Por motivos de recursos, el envío por Gmail está desactivado.' : null}
            />
          ))}
        </div>
      )}
    </section>
  )
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, updateUser, logout, isDemo } = useAuth()
  const [activeSection, setActiveSection] = useState('profile')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isFirstAccess, setIsFirstAccess] = useState(false) // Primera vez después del registro
  const [hasCompletedFirstSetup, setHasCompletedFirstSetup] = useState(false) // Ya guardó la primera vez
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false) // Admin cambió contraseña
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [showDemoBanner, setShowDemoBanner] = useState(true)
  const [profileData, setProfileData] = useState({
    nombre: '',
    edad: '',
    sexo: '',
    objetivo: '',
    objetivoClasesSemana: 3,
    password: '',
    confirmPassword: ''
  })

  // Estados para errores de validación en tiempo real
  const [validationErrors, setValidationErrors] = useState({
    nombre: '',
    edad: '',
    sexo: '',
    objetivo: '',
    objetivoClasesSemana: '',
    password: '',
    confirmPassword: ''
  })
  
  // Inicializar desde sessionStorage si existe
  const [clases, setClases] = useState(() => {
    const cached = sessionStorage.getItem('clases')
    return cached ? JSON.parse(cached) : []
  })
  const [misClases, setMisClases] = useState(() => {
    const cached = sessionStorage.getItem('misClases')
    return cached ? JSON.parse(cached) : []
  })
  
  const [loadingClases, setLoadingClases] = useState(false)
  const [loadingMisClases, setLoadingMisClases] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)
  
  // Estados para modales personalizados
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'alert',
    message: '',
    onConfirm: null
  })

  // Estado para modal de ejercicio
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null)
  const [mostrarModalEjercicio, setMostrarModalEjercicio] = useState(false)
  const [tabActivoEjercicio, setTabActivoEjercicio] = useState('detalles')

  useEffect(() => {
    if (user) {
      setProfileData({
        nombre: user.nombre || '',
        edad: user.edad || '',
        sexo: user.sexo || 'otro',
        objetivo: user.objetivo || 'recomposicion_corporal',
        objetivoClasesSemana: user.objetivoClasesSemana || 5
      })
      
      // Si requiere actualización de contraseña (admin la cambió)
      if (user.requiereActualizacionContraseña === true) {
        setRequiresPasswordChange(true)
        setIsEditingProfile(true)
      }
      // Si es el primer acceso después del registro (solo usuarios nuevos)
      else if (user.primerAcceso === true && !hasCompletedFirstSetup) {
        setIsFirstAccess(true)
        setIsEditingProfile(true)
        // Validar inmediatamente los campos
        validateAllProfileFields({
          nombre: user.nombre || '',
          edad: user.edad || '',
          sexo: user.sexo || 'otro',
          objetivo: user.objetivo || 'recomposicion_corporal'
        })
      }
    }
  }, [user, hasCompletedFirstSetup])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Carga bajo demanda: solo carga si no hay datos en caché
    if (activeSection === 'clases' && clases.length === 0) {
      loadClases()
    } else if (activeSection === 'mis-clases' && misClases.length === 0) {
      loadMisClases()
    }
  }, [activeSection])

  const loadClases = async () => {
    setLoadingClases(true)
    try {
      const data = await clasesAPI.getAll()
      const clasesData = data.clases || []
      setClases(clasesData)
      sessionStorage.setItem('clases', JSON.stringify(clasesData))
    } catch (error) {
      console.error('Error al cargar clases:', error)
    } finally {
      setLoadingClases(false)
    }
  }

  const loadMisClases = async () => {
    setLoadingMisClases(true)
    try {
      const data = await clasesAPI.getMisClases()
      const misClasesData = data.clases || []
      setMisClases(misClasesData)
      sessionStorage.setItem('misClases', JSON.stringify(misClasesData))
    } catch (error) {
      console.error('Error al cargar mis clases:', error)
    } finally {
      setLoadingMisClases(false)
    }
  }

  // Función para refrescar datos manualmente (después de inscribirse/desinscribirse)
  const refreshClases = () => {
    // Limpiar caché para forzar recarga desde servidor
    sessionStorage.removeItem('clases')
    sessionStorage.removeItem('misClases')
    loadClases()
    loadMisClases()
  }

  const handleEditProfile = () => {
    if (isDemo) {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: 'Modo demo en solo lectura: no puedes editar el perfil.',
        iconType: 'warning',
        onConfirm: null
      })
      return
    }

    setIsEditingProfile(true)
    // Resetear errores de validación
    setValidationErrors({ 
      nombre: '',
      edad: '',
      sexo: '',
      objetivo: '',
      objetivoClasesSemana: '',
      password: '', 
      confirmPassword: '' 
    })
  }

  // Interceptar cambios de sección para bloquear durante el primer acceso
  const handleSectionChange = (newSection) => {
    if (isFirstAccess && newSection !== 'profile') {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: 'Debes completar tu perfil antes de acceder a otras secciones. Por favor rellena todos los campos obligatorios.',
        iconType: 'warning',
        onConfirm: null
      })
      return
    }
    if (requiresPasswordChange && newSection !== 'profile') {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: 'Debes cambiar tu contraseña antes de acceder a otras secciones. Es obligatorio por razones de seguridad.',
        iconType: 'warning',
        onConfirm: null
      })
      return
    }
    setActiveSection(newSection)
  }

  const handleCancelEdit = () => {
    // No permitir cerrar sin guardar en el primer acceso ni cuando se requiere cambio de contraseña
    if (isFirstAccess) {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: 'Debes completar tu perfil antes de continuar. Por favor rellena todos los campos obligatorios.',
        iconType: 'warning',
        onConfirm: null
      })
      return
    }
    
    if (requiresPasswordChange) {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: 'Debes cambiar tu contraseña antes de continuar. Por razones de seguridad, es obligatorio cambiarla.',
        iconType: 'warning',
        onConfirm: null
      })
      return
    }
    
    setIsEditingProfile(false)
    setProfileData({
      nombre: user.nombre || '',
      edad: user.edad || '',
      sexo: user.sexo || 'otro',
      objetivo: user.objetivo || 'recomposicion_corporal',
       objetivoClasesSemana: user.objetivoClasesSemana || 5,
      password: '',
      confirmPassword: ''
    })
    // Resetear errores de validación
    setValidationErrors({ 
      nombre: '',
      edad: '',
      sexo: '',
      objetivo: '',
      objetivoClasesSemana: '',
      password: '', 
      confirmPassword: '' 
    })
  }

  // Validar contraseña en tiempo real (igual que en Auth.jsx)
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!password) return ''
    if (!passwordRegex.test(password)) {
      return 'Al menos 8 caracteres, una mayúscula, una minúscula y un número'
    }
    return ''
  }

  // Validar nombre
  const validateNombre = (nombre) => {
    if (!nombre || nombre.trim() === '') return ''
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+\s+[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
    if (!nombreRegex.test(nombre.trim())) {
      return 'Debe contener nombre y apellido (mínimo 2 palabras)'
    }
    return ''
  }

  // Validar edad
  const validateEdad = (edad) => {
    if (!edad || edad === '') return 'La edad es obligatoria'
    const edadNum = parseInt(edad)
    if (isNaN(edadNum)) return 'Debe ser un número'
    if (edadNum < 14) return 'Edad mínima: 14 años'
    if (edadNum > 100) return 'Edad máxima: 100 años'
    return ''
  }

  // Validar todos los campos en el primer acceso
  const validateAllProfileFields = (data) => {
    const errors = {}
    
    // Nombre es obligatorio
    if (!data.nombre || data.nombre.trim() === '') {
      errors.nombre = 'El nombre y apellido es obligatorio'
    } else {
      errors.nombre = validateNombre(data.nombre)
    }
    
    // Edad es obligatoria
    if (!data.edad || data.edad === '') {
      errors.edad = 'La edad es obligatoria'
    } else {
      errors.edad = validateEdad(data.edad)
    }
    
    // Sexo es obligatorio
    if (!data.sexo || data.sexo === '') {
      errors.sexo = 'Debe seleccionar un sexo'
    } else {
      errors.sexo = ''
    }
    
    // Objetivo es obligatorio
    if (!data.objetivo || data.objetivo === '') {
      errors.objetivo = 'Debe seleccionar un objetivo'
    } else {
      errors.objetivo = ''
    }
    
    errors.password = ''
    errors.confirmPassword = ''
    errors.objetivoClasesSemana = ''
    
    setValidationErrors(errors)
  }

  // Handler para cambios en el formulario de perfil (validación en tiempo real)
  const handleProfileInputChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value })
    
    let newErrors = { ...validationErrors }
    
    switch(field) {
      case 'nombre':
        newErrors.nombre = validateNombre(value)
        break
      case 'edad':
        newErrors.edad = validateEdad(value)
        break
      case 'password':
        newErrors.password = validatePassword(value)
        newErrors.confirmPassword = profileData.confirmPassword && value !== profileData.confirmPassword ? 'Las contraseñas no coinciden' : ''
        break
      case 'confirmPassword':
        newErrors.confirmPassword = value !== profileData.password ? 'Las contraseñas no coinciden' : ''
        break
    }
    
    setValidationErrors(newErrors)
  }

  const handleSaveProfile = async () => {
    if (isDemo) {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: 'Modo demo en solo lectura: no puedes guardar cambios de perfil.',
        iconType: 'warning',
        onConfirm: null
      })
      return
    }

    // Validar campos obligatorios
    const errors = { ...validationErrors }
    
    // Si requiere cambio de contraseña, obligar a cambiarla
    if (requiresPasswordChange) {
      if (!profileData.password || profileData.password === '') {
        errors.password = 'Debes cambiar tu contraseña'
      }
      if (!profileData.confirmPassword || profileData.confirmPassword === '') {
        errors.confirmPassword = 'Debes confirmar la nueva contraseña'
      }
      // Validar que la nueva contraseña sea válida
      if (profileData.password) {
        errors.password = validatePassword(profileData.password)
      }
      if (profileData.password !== profileData.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden'
      }
    } else {
      // Validación normal de perfil
      errors.edad = validateEdad(profileData.edad)
      if (!profileData.sexo || profileData.sexo === '') {
        errors.sexo = 'El sexo es obligatorio'
      } else {
        errors.sexo = ''
      }
      if (!profileData.objetivo || profileData.objetivo === '') {
        errors.objetivo = 'El objetivo es obligatorio'
      } else {
        errors.objetivo = ''
      }
    }
    
    setValidationErrors(errors)
    
    // Si hay errores, mostrar lista de errores
    if (errors.nombre || errors.edad || errors.sexo || errors.objetivo || errors.password || errors.confirmPassword) {
      const errorList = Object.entries(errors)
        .filter(([, error]) => error)
        .map(([field, error]) => `• ${error}`)
        .join('\n')
      
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: 'Por favor corrige los siguientes errores:\n' + errorList,
        iconType: 'error',
        onConfirm: null
      })
      return
    }
    
    setLoadingProfile(true)
    try {
      const response = await userAPI.updateProfile(profileData)
      // Actualizar usuario en contexto
      updateUser(response.usuario)
      // Guardar nuevo token si se devuelve (especialmente importante si cambió el objetivo)
      if (response.token) {
        localStorage.setItem('token', response.token)
      }
      
      // Si requería cambio de contraseña, marcar como completado
      if (requiresPasswordChange) {
        setRequiresPasswordChange(false)
      }
      
      // Si es el primer acceso, marcar como completado
      if (isFirstAccess) {
        setIsFirstAccess(false)
        setHasCompletedFirstSetup(true)
      }
      
      setIsEditingProfile(false)
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: 'Perfil actualizado correctamente',
        iconType: 'success',
        onConfirm: null
      })
    } catch (error) {
      // Manejar errores específicos del backend
      let errorMessage = 'Error al actualizar perfil'
      
      if (error.response?.status === 400) {
        const backendError = error.response?.data?.message
        // El backend devuelve mensajes específicos
        if (backendError) {
          errorMessage = backendError
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: errorMessage,
        iconType: 'error',
        onConfirm: null
      })
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleInscribirse = async (claseId) => {
    try {
      await clasesAPI.inscribirse(claseId)
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: 'Te has inscrito correctamente',
        iconType: 'success',
        onConfirm: null
      })
      refreshClases() // Refrescar ambas listas
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: error.message,
        iconType: 'error',
        onConfirm: null
      })
    }
  }

  const handleDesinscribirse = async (claseId) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      message: '¿Seguro que quieres desinscribirte de esta clase?',
      iconType: 'warning',
      onConfirm: async () => {
        try {
          await clasesAPI.desinscribirse(claseId)
          setModalConfig({
            isOpen: true,
            type: 'alert',
            message: 'Te has desinscrito correctamente',
            iconType: 'success',
            onConfirm: null
          })
          refreshClases() // Refrescar ambas listas
        } catch (error) {
          setModalConfig({
            isOpen: true,
            type: 'alert',
            message: 'Error: ' + error.message,
            iconType: 'error',
            onConfirm: null
          })
        }
      }
    })
  }

  const menuItems = [
    { id: 'profile', label: 'Perfil' },
    { id: 'clases', label: 'Clases' },
    { id: 'mis-clases', label: 'Mis Clases' },
    { id: 'ejercicios', label: 'Ejercicios' },
    { id: 'guias', label: 'Guías' },
    { id: 'paco', label: '🤖 Asistente Virtual' }
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div id="app-container" style={isDemo && showDemoBanner ? { paddingTop: '2.2rem' } : {}}>
      {/* Banner demo usuario solo lectura */}
      {isDemo && showDemoBanner && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: 'linear-gradient(90deg, #ff6b35, #f7931e)',
          color: 'white',
          textAlign: 'center',
          padding: '0.3rem 2.5rem 0.3rem 1rem',
          fontSize: '0.78rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(255,107,53,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <span>🔒 Modo Demo — Puedes probar clases con normalidad, pero no modificar los datos de la cuenta.</span>
          <button
            onClick={() => setShowDemoBanner(false)}
            style={{
              position: 'absolute',
              right: '0.6rem',
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0 0.3rem'
            }}
            title="Cerrar aviso"
          >✕</button>
        </div>
      )}
      {/* Header móvil con botones de sesión */}
      {isMobile && (
        <div className="mobile-header">
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
          <button className="btn-exit-sidebar" onClick={() => navigate('/')}>
            Home
          </button>
        </div>
      )}

      <Sidebar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        menuItems={menuItems}
      />
      <main className="content">
        {activeSection === 'profile' && (
          <section id="profile" className="content-section active">

            <h2>Tu Perfil</h2>
            <div className="card">
              {!isEditingProfile ? (
                <div id="profile-display">
                  <h3>Información Personal</h3>
                  <p>
                    <strong>Nombre:</strong> <span>{user?.nombre || 'Usuario'}</span>
                  </p>
                  <p>
                    <strong>Email:</strong> <span>{user?.email || 'email@example.com'}</span>
                  </p>
                  <p>
                    <strong>Edad:</strong> <span>{user?.edad || '-'}</span> años
                  </p>
                  <p>
                    <strong>Sexo:</strong> <span>
                      {user?.sexo === 'masculino' ? 'Masculino' : 
                       user?.sexo === 'femenino' ? 'Femenino' : 
                       user?.sexo === 'otro' ? 'Otro' : '-'}
                    </span>
                  </p>
                  <p>
                    <strong>Objetivo:</strong> <span>
                      {user?.objetivo === 'aumento_masa_muscular' ? 'Aumento de Masa Muscular' :
                       user?.objetivo === 'recomposicion_corporal' ? 'Recomposición Corporal' :
                       user?.objetivo === 'perdida_grasa' ? 'Pérdida de Grasa' : '-'}
                    </span>
                  </p>
                  <p>
                    <strong>Objetivo Semanal:</strong> <span>{user?.objetivoClasesSemana || 5}</span> clases por semana
                  </p>
                  <button 
                    className="btn-action" 
                    style={{ marginTop: '1rem', width: 'auto' }}
                    onClick={handleEditProfile}
                  >
                    Editar Perfil
                  </button>
                </div>
              ) : (
                <div id="profile-edit">
                  <h3>Editar Perfil</h3>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      className={validationErrors.nombre ? 'input-error' : ''}
                      value={profileData.nombre}
                      onChange={(e) => handleProfileInputChange('nombre', e.target.value)}
                    />
                    {validationErrors.nombre && <span className="error-message">{validationErrors.nombre}</span>}
                  </div>
                  <div className="form-group">
                    <label>Edad *</label>
                    <input
                      type="number"
                      className={validationErrors.edad ? 'input-error' : ''}
                      value={profileData.edad}
                      onChange={(e) => handleProfileInputChange('edad', e.target.value)}
                      min="14"
                      max="100"
                      placeholder="14-100 años"
                      required
                    />
                    {validationErrors.edad && <span className="error-message">{validationErrors.edad}</span>}
                  </div>
                  <div className="form-group">
                    <label>Sexo *</label>
                    <select
                      className={validationErrors.sexo ? 'input-error' : ''}
                      value={profileData.sexo}
                      onChange={(e) => handleProfileInputChange('sexo', e.target.value)}
                      required
                    >
                      <option value="">-- Selecciona tu sexo --</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro</option>
                    </select>
                    {validationErrors.sexo && <span className="error-message">{validationErrors.sexo}</span>}
                  </div>
                  <div className="form-group">
                    <label>Objetivo *</label>
                    <select
                      className={validationErrors.objetivo ? 'input-error' : ''}
                      value={profileData.objetivo}
                      onChange={(e) => handleProfileInputChange('objetivo', e.target.value)}
                      required
                    >
                      <option value="">-- Selecciona tu objetivo --</option>
                      <option value="aumento_masa_muscular">Aumento de Masa Muscular</option>
                      <option value="recomposicion_corporal">Recomposición Corporal</option>
                      <option value="perdida_grasa">Pérdida de Grasa</option>
                    </select>
                    {validationErrors.objetivo && <span className="error-message">{validationErrors.objetivo}</span>}
                  </div>
                  <div className="form-group">
                    <label>Objetivo de Clases por Semana</label>
                    <input
                      type="text"
                      value={profileData.objetivoClasesSemana}
                      onChange={(e) => {
                        const value = e.target.value
                        // Permitir solo números, o vacío
                        if (value === '' || /^\d+$/.test(value)) {
                          const numValue = value === '' ? 3 : Math.min(Math.max(parseInt(value), 1), 14)
                          setProfileData({ 
                            ...profileData, 
                            objetivoClasesSemana: value === '' ? '' : numValue
                          })
                        }
                      }}
                      placeholder="1-14"
                    />
                    <span className="form-helper">¿Cuántas clases quieres hacer por semana? (1-14)</span>
                  </div>
                  <div className="form-group">
                    <label>Nueva Contraseña (opcional)</label>
                    <input
                      type="password"
                      className={validationErrors.password ? 'input-error' : ''}
                      value={profileData.password}
                      onChange={(e) => handleProfileInputChange('password', e.target.value)}
                      placeholder="Dejar vacío para no cambiar"
                      autoComplete="new-password"
                    />
                    <span className={validationErrors.password ? "error-message" : "form-helper"}>
                      {validationErrors.password || 'Mínimo 8 caracteres, una mayúscula, una minúscula y un número'}
                    </span>
                  </div>
                  <div className="form-group">
                    <label>Confirmar nueva contraseña</label>
                    <input
                      type="password"
                      className={validationErrors.confirmPassword ? 'input-error' : ''}
                      value={profileData.confirmPassword}
                      onChange={(e) => handleProfileInputChange('confirmPassword', e.target.value)}
                      placeholder="Repite la nueva contraseña"
                      autoComplete="new-password"
                    />
                    {validationErrors.confirmPassword && <span className="error-message">{validationErrors.confirmPassword}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                      className="btn-action" 
                      onClick={handleSaveProfile}
                      disabled={loadingProfile || (profileData.password && !!validationErrors.password)}
                    >
                      {loadingProfile ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button 
                      className="btn-action" 
                      onClick={handleCancelEdit}
                      disabled={loadingProfile}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'clases' && (
          <section id="clases" className="content-section active">
            <h2>Clases Disponibles</h2>
            {loadingClases && clases.length === 0 ? (
              <div className="spinner-container">
                <div className="spinner-large"></div>
                <p style={{ marginTop: '1rem', color: 'var(--secondary-color)' }}>Cargando clases...</p>
              </div>
            ) : clases.length === 0 ? (
              <p>No hay clases disponibles.</p>
            ) : (
              <div className="horario-semanal">
                  {['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].map(dia => {
                    const clasesDia = clases.filter(c => c.diaSemana === dia)
                    const esDomingo = dia === 'domingo'
                    return (
                      <div key={dia} className={`dia-column ${esDomingo ? 'dia-domingo' : ''}`}>
                        <h3 className="dia-header">{dia.charAt(0).toUpperCase() + dia.slice(1)}</h3>
                        <div className="clases-dia">
                          {clasesDia.length === 0 ? (
                            <p className="sin-clases">Sin clases</p>
                          ) : (
                            clasesDia.map(clase => {
                              const plazasDisponibles = clase.plazasDisponibles ?? (clase.cupoMaximo - (clase.alumnosApuntados?.length || 0))
                              const porcentajeOcupacion = ((clase.cupoMaximo - plazasDisponibles) / clase.cupoMaximo) * 100
                              return (
                                <ClaseCard
                                  key={clase._id}
                                  clase={clase}
                                  user={user}
                                  misClases={misClases}
                                  handleInscribirse={handleInscribirse}
                                />
                              )
                            })
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
            )}
          </section>
        )}

        {activeSection === 'mis-clases' && (
          <section id="mis-clases" className="content-section active">
            <h2>Mis Clases</h2>
            {misClases.length > 0 && (
              <div className="objetivo-semanal-widget">
                <div className="objetivo-progress">
                  <div className="objetivo-numeros">
                    <span className="clases-actuales">{misClases.length}</span>
                    <span className="separador">/</span>
                    <span className="clases-objetivo">{user?.objetivoClasesSemana || 5}</span>
                  </div>
                  <div className="objetivo-label">clases esta semana</div>
                </div>
                <div className="objetivo-mensaje">
                  {misClases.length >= (user?.objetivoClasesSemana || 5) ? (
                    <>
                      <span className="icono-completado">🎉</span>
                      <span>¡Semana completada! Vas genial</span>
                    </>
                  ) : misClases.length >= (user?.objetivoClasesSemana || 5) * 0.7 ? (
                    <>
                      <span className="icono-cerca">💪</span>
                      <span>¡Muy bien! Estás cerca del objetivo</span>
                    </>
                  ) : (
                    <>
                      <span className="icono-animo">🔥</span>
                      <span>¡Vamos! Te faltan {(user?.objetivoClasesSemana || 5) - misClases.length} clases</span>
                    </>
                  )}
                </div>
              </div>
            )}
            {loadingMisClases && misClases.length === 0 ? (
              <div className="spinner-container">
                <div className="spinner-large"></div>
                <p style={{ marginTop: '1rem', color: 'var(--secondary-color)' }}>Cargando tus clases...</p>
              </div>
            ) : misClases.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <p>No estás inscrito en ninguna clase todavía.</p>
                <button 
                  className="btn-action"
                  onClick={() => setActiveSection('clases')}
                  style={{ marginTop: '1rem' }}
                >
                  Explorar Clases Disponibles
                </button>
              </div>
            ) : (
              <div className="mis-clases-semanal">
                {['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].map(dia => {
                  const clasesDia = misClases
                    .filter(c => c.diaSemana === dia)
                    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
                  
                  // Determinar día actual
                  const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
                  const hoy = new Date().getDay()
                  const diaActual = diasSemana[hoy]
                  const esHoy = dia === diaActual
                  const esDomingo = dia === 'domingo'
                  
                  return (
                    <div key={dia} className={`mis-clases-dia-column ${esHoy ? 'dia-hoy' : ''} ${clasesDia.length === 0 ? 'sin-clases' : ''} ${esDomingo ? 'dia-domingo' : ''}`}>
                      <h3 className="mis-clases-dia-header">
                        <span className="dia-nombre">{dia.charAt(0).toUpperCase() + dia.slice(1)}</span>
                        {esHoy && <span className="badge-hoy">Hoy</span>}
                        {clasesDia.length > 0 && <span className="badge-contador">{clasesDia.length}</span>}
                      </h3>
                      <div className="mis-clases-dia-contenido">
                        {clasesDia.length === 0 ? (
                          <div className="sin-clases-mensaje">
                            {dia === 'domingo' ? (
                              <>
                                <span className="icono-fueguito">🏞️</span>
                                <span>Día de descanso. ¡Disfruta al aire libre!</span>
                              </>
                            ) : (
                              <>
                                <span className="icono-fueguito">🔥</span>
                                <span>Aquí hay un hueco para seguir mejorando</span>
                              </>
                            )}
                          </div>
                        ) : (
                          clasesDia.map((clase) => (
                            <div 
                              key={clase._id} 
                              className={`mi-clase-compacta tipo-${clase.nombre.toLowerCase().replace(/\s/g, '-')}`}
                            >
                              <div className="clase-hora-badge">
                                {clase.horaInicio}
                              </div>
                              <div className="clase-info-compacta">
                                <h4 className="clase-nombre-mini">{clase.nombre}</h4>
                                <p className="clase-profesor-mini">👤 {clase.profesor}</p>
                                <p className="clase-duracion">
                                  ⏱ {clase.horaInicio} - {clase.horaFin}
                                </p>
                              </div>
                              <button 
                                className="btn-desinscribir-mini" 
                                onClick={() => handleDesinscribirse(clase._id)}
                                title="Desinscribirme"
                              >
                                ✕
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {activeSection === 'ejercicios' && (
          <EjerciciosSection 
            onSelectEjercicio={(ejercicio) => {
              setEjercicioSeleccionado(ejercicio)
              setMostrarModalEjercicio(true)
              setTabActivoEjercicio('detalles')
            }}
          />
        )}

        {activeSection === 'guias' && (
          <GuiasSection />
        )}

        {activeSection === 'paco' && (
          <section className="content-section active">
            <h2>🤖 Asistente Virtual</h2>
            <div style={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              border: '2px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '12px',
              padding: '3rem 2rem',
              textAlign: 'center',
              minHeight: '500px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem'
            }}>
              <div style={{ fontSize: '4rem' }}>🚀</div>
              <h3 style={{
                margin: '0',
                fontSize: '1.8rem',
                color: 'var(--text-color-dark)',
                fontWeight: '600'
              }}>
                Estamos trabajando en traer un asistente virtual
              </h3>
              <p style={{
                margin: '0',
                fontSize: '1.1rem',
                color: 'var(--text-color-dark)',
                maxWidth: '500px',
                lineHeight: '1.6'
              }}>
                que te ayude con tus consultas sobre entrenamiento y alimentación.
              </p>
              <p style={{
                margin: '1rem 0 0 0',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#667eea',
                animation: 'pulse 2s infinite'
              }}>
                ¡Muy pronto!
              </p>
            </div>
          </section>
        )}
      </main>

      <CustomModal
        type={modalConfig.type}
        message={modalConfig.message}
        iconType={modalConfig.iconType}
        isOpen={modalConfig.isOpen}
        onConfirm={modalConfig.onConfirm || (() => setModalConfig({ ...modalConfig, isOpen: false }))}
        onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />

      {/* Modal de Ejercicio */}
      {mostrarModalEjercicio && ejercicioSeleccionado && (
        <div className="modal-overlay" onClick={() => setMostrarModalEjercicio(false)}>
          <div className="modal-ejercicio" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn"
              onClick={() => setMostrarModalEjercicio(false)}
              title="Cerrar"
            >
              ✕
            </button>
            
            <div className="modal-ejercicio-contenido">
              <h2>{ejercicioSeleccionado.nombre}</h2>
              
              {ejercicioSeleccionado.imagenTecnica && console.log('Imagen técnica disponible:', ejercicioSeleccionado.imagenTecnica)}
              
              <div className="tabs-ejercicio">
                <div className="tabs-buttons">
                  <button 
                    className={`tab-button ${tabActivoEjercicio === 'detalles' ? 'active' : ''}`}
                    onClick={() => setTabActivoEjercicio('detalles')}
                  >
                    📋 Detalles
                  </button>
                  
                  {ejercicioSeleccionado.imagenTecnica && (
                    <button 
                      className={`tab-button ${tabActivoEjercicio === 'tecnica' ? 'active' : ''}`}
                      onClick={() => setTabActivoEjercicio('tecnica')}
                    >
                      🎥 Técnica
                    </button>
                  )}
                </div>
                
                <div className="tab-content">
                  {tabActivoEjercicio === 'detalles' && (
                    <div className="tab-panel detalles">
                      <div className="info-group">
                        <label>Descripción:</label>
                        <p>{ejercicioSeleccionado.descripcion || 'Sin descripción'}</p>
                      </div>
                      
                      <div className="info-group">
                        <label>Grupo Muscular:</label>
                        <span className="tag-grupo">{ejercicioSeleccionado.grupoMuscular}</span>
                      </div>
                      
                      <div className="info-group">
                        <label>Dificultad:</label>
                        <span className={`tag-dificultad ${ejercicioSeleccionado.dificultad}`}>
                          {ejercicioSeleccionado.dificultad}
                        </span>
                      </div>
                      
                      <div className="info-group">
                        <label>Tipo de Equipamiento:</label>
                        <span className="tag-equipamiento">
                          {ejercicioSeleccionado.equipamiento === 'casa' ? '🏠 Casa' : '🏋️ Gimnasio'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {tabActivoEjercicio === 'tecnica' && ejercicioSeleccionado.imagenTecnica && (
                    <div className="tab-panel tecnica">
                      <div className="imagen-tecnica-container">
                        {ejercicioSeleccionado.imagenTecnica ? (
                          <img 
                            src={ejercicioSeleccionado.imagenTecnica}
                            alt={`Técnica de ${ejercicioSeleccionado.nombre}`}
                            className="imagen-tecnica"
                            onError={(e) => {
                              console.error('Error al cargar la imagen:', ejercicioSeleccionado.imagenTecnica);
                              e.target.parentElement.innerHTML = '<p style="color: var(--text-color-dark); text-align: center;">No se pudo cargar la imagen de la técnica</p>';
                            }}
                          />
                        ) : (
                          <p style={{color: 'var(--text-color-dark)', textAlign: 'center'}}>No hay imagen de técnica disponible</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
