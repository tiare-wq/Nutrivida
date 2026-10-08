/* function Login() {
    return(
                    <form className="logging-form">
                        <div className="seccion-informacion">
                            <h2 className="sub-form">Iniciar sesión</h2>
                            <div className="inputs">
                                <label for="nombre-usuario">Nombre</label>
                                <input id="nombre-usuario" type="text" placeholder="Nombre de usuario"/>
                            </div>
                            <div class="inputs">
                                <label class="contraseña" for="password">Contraseña</label>
                                <input type="password" id="contraseña" placeholder="Contraseña"/>
                            </div>
                            <input type="submit" class="btn btn-success" value="Iniciar sesión"/>
                            <p><a href="recuperar-contraseña">¿Olvidaste tu contraseña?</a></p>
                        </div>
                    </form>
    )
}
export default Login */

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
        <div className="container justify-content-center align-items-center">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1 className='subtitulo-form'>Iniciar Sesión</h1>
                <div className="mb-3">
                    <label className="form-label">
                    Correo electrónico
                    </label>
                    <input
                    type="text"
                    className="form-control"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">
                    Contraseña
                    </label>
                    <input
                    type="password"
                    className="form-control"
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
                className="btn btn-primary"
                >
                Ingresar
                </button>
            </form>
            <a href="recuperar-contraseña">¿Olvidaste tu contraseña?</a>
        </div>
    )
}
export default Login