import Icon from "../Icon";

export default function ModalShell({ title, children, onClose }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onClose()
      }
    >
      <div className="modal">
        <button type="button" className="modal-close" onClick={onClose}>
          <Icon type="close" />
        </button>
        <p className="eyebrow">KISS FIX / NUEVO REGISTRO</p>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
