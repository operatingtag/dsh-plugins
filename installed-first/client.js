window.__ModuleLoader__.load({
  id: '@local/installed-first',
  factory() {
    const STYLE_ID = '@local/installed-first/order.css';

    /**
     * The Plugins panel renders three groups in a fixed DOM order: basic
     * (built-in plugin settings), extensions, then bundles (user-installed
     * plugins). The panel exposes stable `data-plugin-group` markers and lays
     * the groups out in a flex column, so `order` moves the installed bundles
     * to the top and pushes the built-in group to the bottom without touching
     * the owning plugin's code.
     */
    const CSS = `
[data-plugin-panel] div:has(> [data-plugin-group="bundles"]){display:flex;flex-direction:column}
[data-plugin-panel] [data-plugin-group="bundles"]{order:-1}
[data-plugin-panel] [data-plugin-group="basic"]{order:1}
`;

    function apply(ctx) {
      ctx.effect(() => {
        if (document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`) !== null) return undefined;
        const tag = document.createElement('style');
        tag.dataset.plugin = '@local/installed-first';
        tag.dataset.pluginCss = STYLE_ID;
        tag.textContent = CSS;
        document.head.appendChild(tag);
        return () => {
          if (tag.parentNode !== null) tag.remove();
        };
      }, 'installed-first: group order stylesheet');
    }

    return { apply };
  },
});
