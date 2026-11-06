window.__ModuleLoader__.load({
  id: 'dsh-installed-first',
  factory() {
    const STYLE_ID = 'dsh-installed-first/order.css';

    /**
     * The Plugins panel renders three groups in a fixed DOM order: basic
     * (built-in plugin settings), extensions, then bundles (user-installed
     * plugins). `.installedPanel` is already `display:flex; flex-direction:column;
     * gap:32px`, and each section carries a stable `data-plugin-group` marker, so
     * `order` restacks them without touching the owning plugin's code.
     */
    const CSS = `
[data-plugin-panel] div:has(> [data-plugin-group]){display:flex;flex-direction:column}
[data-plugin-panel] [data-plugin-group="bundles"]{order:-1}
[data-plugin-panel] [data-plugin-group="basic"]{order:1}
`;

    function apply(ctx) {
      ctx.effect(() => {
        if (document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`) !== null) return undefined;
        const tag = document.createElement('style');
        tag.dataset.plugin = 'dsh-installed-first';
        tag.dataset.pluginCss = STYLE_ID;
        tag.textContent = CSS;
        document.head.appendChild(tag);
        return () => {
          if (tag.parentNode !== null) tag.remove();
        };
      }, 'dsh-installed-first: group order stylesheet');
    }

    return { apply };
  },
});
