import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../css/registro.css';

function Registro() {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [rut, setRut] = useState('');
    const [fechaNac, setFechaNac] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    // Validación del RUT chileno (módulo 11)
    const validarRut = (valor) => {
        const limpio = valor.replace(/[.\-]/g, '').toUpperCase();

        if (!/^\d{7,8}[0-9K]$/.test(limpio)) {
            return false;
        }

        const cuerpo = limpio.slice(0, -1);
        const dv = limpio.slice(-1);

        let suma = 0;
        let multiplicador = 2;

        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += Number(cuerpo[i]) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }

        const resultado = 11 - (suma % 11);
        const dvCalculado =
            resultado === 11 ? '0' :
            resultado === 10 ? 'K' :
            String(resultado);

        return dv === dvCalculado;
    };

    // Formato del RUT
    const formatearRut = (valor) => {
        const limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();

        if (limpio.length < 2) return limpio;

        const cuerpo = limpio.slice(0, -1);
        const dv = limpio.slice(-1);
        const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return `${cuerpoFormateado}-${dv}`;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        setMensaje('');

        if (
            !nombre.trim() || !apellido.trim() || !rut.trim() ||
            !fechaNac || !telefono.trim() || !email.trim() ||
            !password || !confirmarPassword
        ) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        if (nombre.trim().length < 2 || apellido.trim().length < 2) {
            setError('Nombre y apellido deben tener al menos 2 caracteres.');
            return;
        }

        if (!validarRut(rut)) {
            setError('El RUT ingresado no es válido.');
            return;
        }

        const hoy = new Date();
        const fechaIngresada = new Date(`${fechaNac}T12:00:00`);

        if (
            Number.isNaN(fechaIngresada.getTime()) ||
            fechaIngresada > hoy
        ) {
            setError('Ingresa una fecha de nacimiento válida.');
            return;
        }

        if (!/^9\d{8}$/.test(telefono)) {
            setError('Ingresa un celular válido de 9 dígitos.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError('Ingresa un correo electrónico válido.');
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
            setError('La contraseña debe contener letras y números.');
            return;
        }

        if (password !== confirmarPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        enviar();
    };

    const enviar = () => {
        const nombreCompleto = `${nombre} ${apellido}`;
        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        const id = pacientes.length + 1;

        const paciente = [id, {nombreCompleto}, rut, fechaNac, telefono, email, password, [], [], ''];
        localStorage.setItem('pacienteId', id);


        navigate('/perfil', {
            state: {nombreCompleto, rut, fechaNac, telefono, email}
        })
    }

    const hoy = new Date();
    const fechaMaxima = [
        hoy.getFullYear(),
        String(hoy.getMonth() + 1).padStart(2, '0'),
        String(hoy.getDate()).padStart(2, '0')
    ].join('-');

    return (
        <main className="registro">
            <section className="registro-card">
                <h1>Crear cuenta</h1>
                <p>Regístrate y comienza tu experiencia en NutriVida 🍃</p>

                <form onSubmit={handleSubmit} noValidate>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        id="nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        autoComplete="given-name"
                        required
                    />

                    <label htmlFor="apellido">Apellido</label>
                    <input
                        id="apellido"
                        type="text"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        autoComplete="family-name"
                        required
                    />

                    <label htmlFor="rut">RUT</label>
                    <input
                        id="rut"
                        type="text"
                        value={rut}
                        onChange={(e) => setRut(
                            formatearRut(e.target.value)
                        )}
                        placeholder="12.345.678-5"
                        maxLength={12}
                        required
                    />

                    <label htmlFor="fechaNac">Fecha de nacimiento</label>
                    <input
                        id="fechaNac"
                        type="date"
                        value={fechaNac}
                        onChange={(e) => setFechaNac(e.target.value)}
                        max={fechaMaxima}
                        required
                    />

                    <label htmlFor="telefono">Teléfono</label>
                    <div className="telefono-container">
                        <span className="codigo-pais">+56</span>
                        <input
                            id="telefono"
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(
                                e.target.value.replace(/\D/g, '').slice(0, 9)
                            )}
                            autoComplete="tel-national"
                            inputMode="numeric"
                            pattern="9[0-9]{8}"
                            maxLength={9}
                            placeholder="912345678"
                            required
                        />
                    </div>

                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />

                    <label htmlFor="confirmar">Confirmar contraseña</label>
                    <input
                        id="confirmar"
                        type="password"
                        value={confirmarPassword}
                        onChange={(e) => setConfirmarPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                    />

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {mensaje && (
                        <div className="alert alert-success" role="status">
                            {mensaje}
                        </div>
                    )}

                    <button type="submit" className="btn btn-success">
                        Registrarse
                    </button>
                </form>

                <p className="registro-login">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login">Inicia sesión</Link>
                </p>
            </section>
        </main>
    );
}

export default Registro;