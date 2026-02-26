import '../styles/footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <p>&copy; {currentYear} Iván Pons.</p>
    </footer>
  )
}
