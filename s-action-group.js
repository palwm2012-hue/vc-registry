(function() {
  var STYLE_INJECTED = false;

  var MORE_SVG = '<svg width="1em" height="1em" viewBox="0 0 12 12" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 5.25001C1.72386 5.25001 1.5 5.47387 1.5 5.75001L1.5 6.25001C1.5 6.52615 1.72386 6.75001 2 6.75001L2.5 6.75001C2.77614 6.75001 3 6.52615 3 6.25001V5.75001C3 5.47387 2.77614 5.25001 2.5 5.25001H2ZM5.75 5.25001C5.47386 5.25001 5.25 5.47387 5.25 5.75001V6.25001C5.25 6.52615 5.47386 6.75001 5.75 6.75001L6.25 6.75001C6.52614 6.75001 6.75 6.52615 6.75 6.25001V5.75001C6.75 5.47387 6.52614 5.25001 6.25 5.25001H5.75ZM9.5 5.25001C9.22386 5.25001 9 5.47387 9 5.75001V6.25001C9 6.52615 9.22386 6.75001 9.5 6.75001L10 6.75001C10.2761 6.75001 10.5 6.52615 10.5 6.25001V5.75001C10.5 5.47387 10.2761 5.25001 10 5.25001H9.5Z"/></svg>';

  var SIZE_MAP = {
    xs:      { height: '24px', padding: '0 8px',  fontSize: '12px', gap: '8px' },
    sm:      { height: '28px', padding: '0 12px', fontSize: '13px', gap: '8px' },
    default: { height: '32px', padding: '0 16px', fontSize: '14px', gap: '12px' },
    lg:      { height: '36px', padding: '0 16px', fontSize: '14px', gap: '12px' }
  };

  function injectStyles() {
    if (STYLE_INJECTED) return;
    STYLE_INJECTED = true;
    var style = document.createElement('style');
    style.textContent = [
      '.sag-container { display: inline-flex; align-items: center; position: relative; }',
      '.sag-btn { display: inline-flex; align-items: center; justify-content: center; position: relative; box-sizing: border-box; border: none; background: none; cursor: pointer; font-family: inherit; line-height: 1; white-space: nowrap; border-radius: var(--border-radius-small, 4px); transition: all 0.2s; outline: none; }',
      '.sag-btn:focus-visible { outline: 2px solid rgb(var(--primary-6, 22 93 255)); outline-offset: 1px; }',

      '.sag-btn-outline { border: 1px solid var(--color-border-2, #e5e6eb); background: #fff; color: var(--color-text-1, #1d2129); }',
      '.sag-btn-outline:hover:not(.sag-btn-disabled) { border-color: rgb(var(--primary-6, 22 93 255)); color: rgb(var(--primary-6, 22 93 255)); }',

      '.sag-btn-default { background: rgb(var(--primary-6, 22 93 255)); color: #fff; border: 1px solid transparent; }',
      '.sag-btn-default:hover:not(.sag-btn-disabled) { opacity: 0.85; }',

      '.sag-btn-secondary { background: var(--color-bg-4, #f2f3f5); color: var(--color-text-1, #1d2129); border: 1px solid transparent; }',
      '.sag-btn-secondary:hover:not(.sag-btn-disabled) { opacity: 0.85; }',

      '.sag-btn-ghost { background: transparent; color: var(--color-text-1, #1d2129); border: 1px solid transparent; }',
      '.sag-btn-ghost:hover:not(.sag-btn-disabled) { background: var(--color-bg-4, #f2f3f5); }',

      '.sag-btn-destructive { background: rgb(var(--red-6, 245 63 63)); color: #fff; border: 1px solid transparent; }',
      '.sag-btn-destructive:hover:not(.sag-btn-disabled) { opacity: 0.85; }',

      '.sag-btn-link { background: transparent; color: rgb(var(--primary-6, 22 93 255)); border: 1px solid transparent; padding: 0 !important; }',
      '.sag-btn-link:hover:not(.sag-btn-disabled) { text-decoration: underline; }',

      '.sag-btn-disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }',

      '.sag-btn-loading .sag-btn-label { visibility: hidden; }',
      '.sag-btn-loading .sag-spinner-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; }',

      '.sag-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: sag-spin 0.8s linear infinite; }',
      '@keyframes sag-spin { to { transform: rotate(360deg); } }',

      '.sag-more-wrapper { position: relative; display: inline-flex; }',

      '.sag-dropdown { position: absolute; top: 100%; right: 0; margin-top: 4px; background: var(--color-bg-1, #fff); border: 1px solid var(--color-border-2, #e5e6eb); border-radius: 4px; padding: 4px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); z-index: 1000; min-width: 80px; }',

      '.sag-dropdown-item { display: flex; align-items: center; gap: 6px; padding: 8px 12px; font-size: 14px; cursor: pointer; white-space: nowrap; color: var(--color-text-1, #1d2129); background: none; border: none; width: 100%; text-align: left; font-family: inherit; box-sizing: border-box; }',
      '.sag-dropdown-item:hover { background: var(--color-bg-4, #f2f3f5); }',

      '.sag-dropdown-item-disabled { opacity: 0.5; pointer-events: none; }',

      '.sag-dropdown-item .sag-spinner { width: 12px; height: 12px; border-width: 1.5px; flex-shrink: 0; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  function SActionGroup() {
    var el = Reflect.construct(HTMLElement, [], SActionGroup);
    el._actions = [];
    el._max = 3;
    el._size = 'default';
    el._moreVariant = 'outline';
    el._dropdownOpen = false;
    el._onDocClick = function(e) {
      if (el._dropdownOpen && !el.contains(e.target)) {
        el._dropdownOpen = false;
        el._render();
      }
    };
    return el;
  }

  SActionGroup.prototype = Object.create(HTMLElement.prototype);
  SActionGroup.prototype.constructor = SActionGroup;

  Object.defineProperty(SActionGroup, 'observedAttributes', {
    get: function() { return ['max', 'size', 'more-variant']; }
  });

  Object.defineProperty(SActionGroup.prototype, 'actions', {
    get: function() { return this._actions; },
    set: function(val) {
      this._actions = Array.isArray(val) ? val : [];
      this._render();
    }
  });

  Object.defineProperty(SActionGroup.prototype, 'max', {
    get: function() { return this._max; },
    set: function(val) {
      this._max = parseInt(val, 10) || 3;
      this._render();
    }
  });

  Object.defineProperty(SActionGroup.prototype, 'size', {
    get: function() { return this._size; },
    set: function(val) {
      this._size = val || 'default';
      this._render();
    }
  });

  Object.defineProperty(SActionGroup.prototype, 'moreVariant', {
    get: function() { return this._moreVariant; },
    set: function(val) {
      this._moreVariant = val || 'outline';
      this._render();
    }
  });

  SActionGroup.prototype.connectedCallback = function() {
    injectStyles();
    this._syncAttributes();
    this._render();
    document.addEventListener('click', this._onDocClick, true);
  };

  SActionGroup.prototype.disconnectedCallback = function() {
    document.removeEventListener('click', this._onDocClick, true);
  };

  SActionGroup.prototype.attributeChangedCallback = function(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    this._syncAttributes();
    this._render();
  };

  SActionGroup.prototype._syncAttributes = function() {
    var maxAttr = this.getAttribute('max');
    if (maxAttr !== null) this._max = parseInt(maxAttr, 10) || 3;

    var sizeAttr = this.getAttribute('size');
    if (sizeAttr !== null) this._size = sizeAttr;

    var mvAttr = this.getAttribute('more-variant');
    if (mvAttr !== null) this._moreVariant = mvAttr;
  };

  SActionGroup.prototype._render = function() {
    if (!this.isConnected) return;

    this.innerHTML = '';

    var actions = this._actions;
    if (!actions || actions.length === 0) return;

    var max = this._max;
    var size = this._size;
    var sizeConf = SIZE_MAP[size] || SIZE_MAP['default'];
    var moreVariant = this._moreVariant;

    var container = document.createElement('div');
    container.className = 'sag-container';
    container.style.gap = sizeConf.gap;

    var visibleActions = actions.slice(0, max);
    var overflowActions = actions.slice(max);
    var self = this;

    visibleActions.forEach(function(action, i) {
      var btn = self._createButton(action, sizeConf);
      btn.setAttribute('data-action-index', i);
      btn.addEventListener('click', function(e) {
        if (action.disabled || action.loading) return;
        if (typeof action.onClick === 'function') action.onClick(e);
        self.dispatchEvent(new CustomEvent('action-click', {
          bubbles: true,
          detail: { index: i, action: action }
        }));
      });
      container.appendChild(btn);
    });

    if (overflowActions.length > 0) {
      var wrapper = document.createElement('div');
      wrapper.className = 'sag-more-wrapper';

      var moreBtn = self._createButton({ label: '', variant: moreVariant }, sizeConf);
      moreBtn.innerHTML = MORE_SVG;
      moreBtn.setAttribute('aria-label', 'More actions');
      moreBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        self._dropdownOpen = !self._dropdownOpen;
        self._render();
      });
      wrapper.appendChild(moreBtn);

      if (self._dropdownOpen) {
        var dropdown = document.createElement('div');
        dropdown.className = 'sag-dropdown';

        overflowActions.forEach(function(action, j) {
          var realIndex = max + j;
          var item = document.createElement('button');
          item.className = 'sag-dropdown-item';
          if (action.disabled) item.classList.add('sag-dropdown-item-disabled');
          item.type = 'button';

          if (action.loading) {
            var spinner = document.createElement('span');
            spinner.className = 'sag-spinner';
            item.appendChild(spinner);
          }

          var labelSpan = document.createElement('span');
          labelSpan.textContent = action.label || '';
          item.appendChild(labelSpan);

          item.addEventListener('click', function(e) {
            if (action.disabled || action.loading) return;
            e.stopPropagation();
            self._dropdownOpen = false;
            self._render();
            if (typeof action.onClick === 'function') action.onClick(e);
            self.dispatchEvent(new CustomEvent('action-click', {
              bubbles: true,
              detail: { index: realIndex, action: action }
            }));
          });

          dropdown.appendChild(item);
        });

        wrapper.appendChild(dropdown);
      }

      container.appendChild(wrapper);
    }

    this.appendChild(container);
  };

  SActionGroup.prototype._createButton = function(action, sizeConf) {
    var variant = action.variant || 'outline';
    var btn = document.createElement('button');
    btn.type = 'button';

    var classes = ['sag-btn', 'sag-btn-' + variant];
    if (action.disabled) classes.push('sag-btn-disabled');
    if (action.loading) classes.push('sag-btn-loading');
    btn.className = classes.join(' ');

    btn.style.height = sizeConf.height;
    btn.style.padding = sizeConf.padding;
    btn.style.fontSize = sizeConf.fontSize;

    if (action.disabled) btn.disabled = true;

    var labelSpan = document.createElement('span');
    labelSpan.className = 'sag-btn-label';
    labelSpan.textContent = action.label || '';
    btn.appendChild(labelSpan);

    if (action.loading) {
      var overlay = document.createElement('span');
      overlay.className = 'sag-spinner-overlay';
      var spinner = document.createElement('span');
      spinner.className = 'sag-spinner';
      overlay.appendChild(spinner);
      btn.appendChild(overlay);
    }

    return btn;
  };

  customElements.define('s-action-group', SActionGroup);
})();
