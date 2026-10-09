import { useState } from 'react'
function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const handleSubmit = (event) => {
        event.preventDefault()
        if (!email.includes('@')) {
            setError('El correo electrónico no es válido')
            return
        }
        if (password.length < 4) {
            setError('La contraseña debe tener al menos 4 caracteres')
            return
        }
        setError('')
        console.log('Email:', email)
        console.log('Password:', password)
    }
    return (
        <div className="d-flex flex-column justify-content-center align-items-center login">
            <section class="login-section">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1 className='subtitulo-form'>Iniciar Sesión</h1>
                    <div className="mb-3">
                        <label className="login-label">
                        Correo electrónico
                        </label>
                        <input
                        type="text"
                        className='login-input'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="login-label">
                        Contraseña
                        </label>
                        <input
                        type="password"
                        className='login-input'
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    {
                        error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}
                    <button
                    type="submit"
                    className="btn btn-success"
                    >
                    Ingresar
                    </button>
                </form>
                <a className='forgot-password' href="recuperar-contraseña">¿Olvidaste tu contraseña?</a>
            </section>
        </div>
    )
}
export default Login