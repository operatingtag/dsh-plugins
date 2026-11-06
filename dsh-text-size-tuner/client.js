window.__ModuleLoader__.load({
  id: 'dsh-text-size-tuner',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'dsh-text-size-tuner';
    const STYLE_ID = 'dsh-text-size-tuner/panel.css';

    /** Font roles the Harness theme service persists, with their supported ranges. */
    const SPECS = [
      { role: 'text', label: 'panel.text', min: 10, max: 22, def: 14 },
      { role: 'code', label: 'panel.code', min: 10, max: 16, def: 11 },
      { role: 'terminal', label: 'panel.terminal', min: 10, max: 20, def: 13 },
    ];

    const CSS = `
.tst-trigger{width:28px;height:28px;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11.5px;font-weight:600;letter-spacing:.02em;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
.tst-trigger:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.tst-trigger-on{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.tst-trigger:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.tst-card{position:fixed;width:246px;padding:12px 14px;border-radius:14px;border:.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-overlay);background:color-mix(in srgb,var(--dsw-alias-bg-overlay) 90%,transparent);backdrop-filter:blur(14px);box-shadow:0 10px 30px color-mix(in srgb,var(--dsw-alias-label-primary) 16%,transparent);color:var(--dsw-alias-label-primary);pointer-events:auto;z-index:60;animation:tst-in .16s ease-out}
.tst-head{display:flex;align-items:center;justify-content:space-between}
.tst-title{font-size:12.5px;font-weight:600;letter-spacing:.01em}
.tst-icon{width:20px;height:20px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}
.tst-icon:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.tst-preview{margin:4px 0 4px;line-height:1.15;font-weight:500;letter-spacing:.01em}
.tst-row{display:block;margin-top:9px}
.tst-row-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:3px;font-size:11px;color:var(--dsw-alias-label-secondary)}
.tst-val{font-size:10.5px;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}
.tst-slider{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:99px;background:var(--dsw-alias-border-l2);outline:none;cursor:pointer;margin:0}
.tst-slider::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--dsw-alias-brand-primary);border:2px solid var(--dsw-alias-bg-overlay);box-shadow:0 1px 3px color-mix(in srgb,var(--dsw-alias-label-primary) 30%,transparent);cursor:pointer}
.tst-slider::-moz-range-thumb{width:12px;height:12px;border-radius:50%;background:var(--dsw-alias-brand-primary);border:2px solid var(--dsw-alias-bg-overlay);cursor:pointer}
.tst-slider:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-brand-primary)}
.tst-foot{display:flex;align-items:center;justify-content:space-between;margin-top:12px}
.tst-reset{border:.5px solid var(--dsw-alias-border-l2);border-radius:7px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:11px;padding:3px 9px;cursor:pointer}
.tst-reset:hover{background:var(--dsw-alias-bg-layer-2)}
.tst-hint{font-size:10px;color:var(--dsw-alias-label-secondary)}
@keyframes tst-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.tst-card{animation:none}}
`;

    function mountStyles() {
      if (document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`) !== null) return undefined;
      const tag = document.createElement('style');
      tag.dataset.plugin = 'dsh-text-size-tuner';
      tag.dataset.pluginCss = STYLE_ID;
      tag.textContent = CSS;
      document.head.appendChild(tag);
      return () => {
        if (tag.parentNode !== null) tag.remove();
      };
    }

    function createUiStore() {
      const subscribers = new Set();
      const state = { open: true, anchor: null };
      const emit = () => {
        for (const listener of subscribers) listener();
      };
      return {
        subscribe(listener) {
          subscribers.add(listener);
          return () => subscribers.delete(listener);
        },
        get() {
          return state;
        },
        toggle() {
          state.open = !state.open;
          emit();
        },
        close() {
          if (!state.open) return;
          state.open = false;
          emit();
        },
        setAnchor(anchor) {
          state.anchor = anchor;
          emit();
        },
      };
    }

    function apply(ctx) {
      ctx.effect(mountStyles, 'dsh-text-size-tuner: panel stylesheet');
      ctx.effect(
        () => ctx.locale.register(NS, {
          en: {
            panel: {
              title: 'Text size',
              button: 'Text size controls',
              text: 'Conversation',
              code: 'Code',
              terminal: 'Terminal',
              reset: 'Reset',
              hint: 'Saved automatically',
            },
          },
          zh: {
            panel: {
              title: 'æ–‡å­—å¤§å°',
              button: 'æ–‡å­—å¤§å°æŽ§åˆ¶',
              text: 'å¯¹è¯',
              code: 'ä»£ç ',
              terminal: 'ç»ˆç«¯',
              reset: 'é‡ç½®',
              hint: 'è‡ªåŠ¨ä¿å­˜',
            },
          },
        }),
        'dsh-text-size-tuner: panel dictionaries',
      );

      const t = ctx.locale.bind(NS);
      const theme = ctx.get('theme');
      const ui = createUiStore();
      const listeners = new Set();

      ctx.effect(() => {
        const dispose = ctx.on('theme/change', () => {
          for (const listener of listeners) listener();
        });
        return () => {
          listeners.clear();
          if (typeof dispose === 'function') dispose();
        };
      }, 'dsh-text-size-tuner: theme subscription');

      /** Re-render on store changes. */
      function useUi() {
        const [, force] = React.useReducer((count) => count + 1, 0);
        React.useEffect(() => ui.subscribe(() => force()), []);
        return ui.get();
      }

      /** Read the persisted sizes and re-render whenever the theme service publishes. */
      function useSizes() {
        const [sizes, setSizes] = React.useState(() => theme.getTheme().fontSizes);
        React.useEffect(() => {
          const read = () => setSizes(theme.getTheme().fontSizes);
          read();
          listeners.add(read);
          return () => {
            listeners.delete(read);
          };
        }, []);
        return sizes;
      }

      /** Header button: sits at the right end of the utilities row, left of the corner control. */
      function Trigger() {
        const element = React.useRef(null);
        const state = useUi();
        React.useEffect(() => {
          const measure = () => {
            const node = element.current;
            if (node === null) return;
            const rect = node.getBoundingClientRect();
            ui.setAnchor({
              top: rect.bottom,
              right: Math.max(8, window.innerWidth - rect.right),
            });
          };
          measure();
          window.addEventListener('resize', measure);
          return () => window.removeEventListener('resize', measure);
        }, []);
        return h('button', {
          ref: element,
          type: 'button',
          className: 'tst-trigger' + (state.open ? ' tst-trigger-on' : ''),
          'aria-label': t('panel.button'),
          'aria-pressed': state.open,
          title: t('panel.button'),
          onClick: () => ui.toggle(),
        }, 'Aa');
      }

      function Panel() {
        const state = useUi();
        const sizes = useSizes();
        const [draft, setDraft] = React.useState(null);
        const timers = React.useRef({});

        React.useEffect(() => {
          if (Object.keys(timers.current).length > 0) return;
          setDraft(null);
        }, [sizes]);

        React.useEffect(() => () => {
          for (const timer of Object.values(timers.current)) clearTimeout(timer);
        }, []);

        if (!state.open) return null;

        const anchor = state.anchor;
        const style = {
          top: (anchor === null ? 64 : anchor.top + 8) + 'px',
          right: (anchor === null ? 16 : anchor.right) + 'px',
        };

        const valueOf = (role) => (draft !== null && draft[role] !== undefined ? draft[role] : sizes[role]);

        const change = (role, px) => {
          setDraft((previous) => ({ ...(previous || {}), [role]: px }));
          clearTimeout(timers.current[role]);
          timers.current[role] = setTimeout(() => {
            delete timers.current[role];
            try {
              theme.setFontSize(role, px);
            } catch (error) {
              console.warn('[dsh-text-size-tuner]', error);
            }
          }, 140);
        };

        const reset = () => {
          for (const [role, timer] of Object.entries(timers.current)) {
            clearTimeout(timer);
            delete timers.current[role];
          }
          setDraft(null);
          for (const spec of SPECS) {
            try {
              theme.setFontSize(spec.role, spec.def);
            } catch (error) {
              console.warn('[dsh-text-size-tuner]', error);
            }
          }
        };

        return h('section', { className: 'tst-card', style, 'aria-label': t('panel.title') },
          h('div', { className: 'tst-head' },
            h('span', { className: 'tst-title' }, t('panel.title')),
            h('button', {
              type: 'button',
              className: 'tst-icon',
              'aria-label': 'Close',
              title: 'Close',
              onClick: () => ui.close(),
            }, '\u2715'),
          ),
          h('div', {
            className: 'tst-preview',
            style: { fontSize: valueOf('text') + 'px' },
            'aria-hidden': true,
          }, 'Aa'),
          SPECS.map((spec) => h('label', { className: 'tst-row', key: spec.role },
            h('span', { className: 'tst-row-head' },
              h('span', null, t(spec.label)),
              h('span', { className: 'tst-val' }, valueOf(spec.role) + 'px'),
            ),
            h('input', {
              type: 'range',
              className: 'tst-slider',
              min: spec.min,
              max: spec.max,
              step: 1,
              value: valueOf(spec.role),
              'aria-label': t(spec.label),
              onChange: (event) => change(spec.role, Number(event.target.value)),
            }),
          )),
          h('div', { className: 'tst-foot' },
            h('button', { type: 'button', className: 'tst-reset', onClick: reset }, t('panel.reset')),
            h('span', { className: 'tst-hint' }, t('panel.hint')),
          ),
        );
      }

      ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
        name: 'conversation.session.header.utilities',
        id: 'dsh-text-size-tuner',
        order: 10,
        label: () => t('panel.button'),
      }, Trigger));

      ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'dsh-text-size-tuner.panel',
        order: 20,
      }, Panel));
    }

    return {
      inject: ['slots', 'locale', 'theme'],
      apply,
    };
  },
});
