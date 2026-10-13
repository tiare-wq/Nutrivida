import { money, totalCart } from "../cart";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
function Quantity({ item, dispatch, busy }) {
  const [draft, setDraft] = useState(String(item.quantity));
  useEffect(() => setDraft(String(item.quantity)), [item.quantity]);
  return (
    <Form.Control
      className="form-control"
      id={`quantity-${item.id}`}
      type="number"
      min="1"
      max="99"
      disabled={busy}
      value={draft}
      onChange={(e) => {
        const value = e.target.value;
        setDraft(value);
        if (
          value !== "" &&
          Number.isInteger(Number(value)) &&
          Number(value) >= 1 &&
          Number(value) <= 99
        )
          dispatch({ type: "quantity", id: item.id, quantity: value });
      }}
      onBlur={() => setDraft(String(item.quantity))}
    />
  );
}
export default function CartView({ items, dispatch, busy = false }) {
  const units = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <>
      <div className="basket-toolbar"><p>{items.length} {items.length === 1 ? "servicio seleccionado" : "servicios seleccionados"} · {units} {units === 1 ? "unidad" : "unidades"}</p><span>Precios en pesos chilenos</span></div>
      <div className="basket-list" role="list" aria-label="Servicios del carrito">
        {items.map((i) => (
          <article className="basket-row" key={i.id} role="listitem">
            <div>
              <h2>{i.name}</h2>
              <p>{money(i.price)} por atención</p>
              {i.duration && <p className="small-note">{i.duration} minutos · {i.modality}</p>}
            </div>
            <div>
              <label htmlFor={`quantity-${i.id}`}>Cantidad</label>
              <Quantity item={i} dispatch={dispatch} busy={busy} />
            </div>
            <div className="basket-subtotal"><span>Subtotal</span><strong>{money(i.price * i.quantity)}</strong></div>
            <Button
              variant="outline-danger"
              disabled={busy}
              onClick={() => dispatch({ type: "remove", id: i.id })}
              aria-label={`Quitar ${i.name}`}
            >
              Quitar
            </Button>
          </article>
        ))}
      </div>
      <div className="basket-summary">
        <span>Total del pedido</span>
        <strong>{money(totalCart(items))}</strong>
      </div>
    </>
  );
}
