export default function Campos({ datos, cambiar, password = false }) {
    const campos = [
        ['nombre', 'Nombre completo', 'text'],
        ['rut', 'RUT', 'text'],
        ['fechaNac', 'Fecha de nacimiento', 'date'],
        ['telefono', 'Teléfono móvil', 'tel'],
        ['correo', 'Correo electrónico', 'email'],
        ...(password ? [['password', 'Contraseña', 'password']] : []),
    ];
    return campos.map(([key, label, type]) => (
        <div className="mb-3" key={key}>
            <label htmlFor={key}>{label}</label>
            <input
                id={key}
                className="form-control"
                type={type}
                value={datos[key] || ''}
                required
                maxLength={key === 'password' ? 72 : 254}
                minLength={key === 'password' ? 8 : undefined}
                onChange={(e) => cambiar({ ...datos, [key]: e.target.value })}
            />
        </div>
    ));
}
