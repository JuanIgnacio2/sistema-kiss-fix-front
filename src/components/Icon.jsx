export default function Icon({ type }) {
  const icons = {
    grid: "▦",
    wrench: "⌁",
    cart: "⊞",
    box: "◫",
    device: "▣",
    store: "▤",
    users: "◌",
    search: "⌕",
    bell: "◔",
    plus: "+",
    arrow: "↗",
    close: "×",
    settings: "⚙",
    sliders: "≡",
    lock: "▣",
    check: "✓",
  };

  return (
    <span className={`icon icon-${type}`} aria-hidden="true">
      {icons[type]}
    </span>
  );
}
