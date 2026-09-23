export default function Icon({ type }) {
  const icons = {
    grid: "▦",
    wrench: "⌁",
    cart: "⊞",
    box: "◫",
    users: "◌",
    search: "⌕",
    bell: "◔",
    plus: "+",
    arrow: "↗",
    close: "×",
  };

  return (
    <span className={`icon icon-${type}`} aria-hidden="true">
      {icons[type]}
    </span>
  );
}
