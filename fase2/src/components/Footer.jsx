import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer>
            <div>
                <Link to="/" className="footer-brand">
                NutriVida
                </Link>
                <br />
                <p>Nutrición y bienestar, a tu medida.</p>
            </div>
            <div>
                <Link to="/reserva">Reservar una atención</Link>
                <br />
                <Link to="/perfil">Mi perfil</Link>
            </div>
            <div>
                <p>
                    NutriVida © 2026
                    <br />
                    Proyecto académico · Sin cobros en línea
                </p>
            </div>
        </footer>
    )
}
export default Footer;