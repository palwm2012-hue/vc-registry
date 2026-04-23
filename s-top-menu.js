(function () {
  var STYLE_INJECTED = false;

  function injectStyles() {
    if (STYLE_INJECTED) return;
    STYLE_INJECTED = true;
    var style = document.createElement('style');
    style.textContent = [
      '.stm-container{display:flex;align-items:center;height:56px;background:var(--color-bg-1,#fff);border-bottom:1px solid var(--color-border-2,#e5e6eb);padding:0 16px;gap:16px;box-sizing:border-box;font-family:inherit;}',
      '.stm-left{display:flex;align-items:center;gap:8px;flex-shrink:0;}',
      '.stm-center{flex:1;display:flex;align-items:center;justify-content:center;}',
      '.stm-right{display:flex;align-items:center;gap:8px;flex-shrink:0;}',
      '.stm-hamburger{width:32px;height:32px;border-radius:4px;border:none;background:transparent;color:var(--color-text-2,#4e5969);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;flex-shrink:0;}',
      '.stm-hamburger:hover{background:var(--color-fill-2,#f2f3f5);}',
      '.stm-logo-img{border-radius:4px;object-fit:contain;}',
      '.stm-logo-placeholder{width:32px;height:32px;border-radius:4px;background:var(--color-fill-3,#c9cdd4);display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:600;flex-shrink:0;}',
      '.stm-search{display:flex;align-items:center;gap:6px;padding:0 10px;height:32px;border-radius:4px;border:1px solid var(--color-border-3,#c9cdd4);background:transparent;color:var(--color-text-3,#86909c);font-size:14px;box-sizing:border-box;}',
      '.stm-search-icon{flex-shrink:0;display:flex;align-items:center;}',
      '.stm-search-input{border:none;outline:none;background:transparent;color:var(--color-text-1,#1d2129);width:160px;font-size:14px;padding:0;margin:0;line-height:1;}',
      '.stm-search-input::placeholder{color:var(--color-text-3,#86909c);}',
      '.stm-tabs{display:flex;align-items:center;height:100%;}',
      '.stm-tab{display:flex;align-items:center;height:100%;padding:0 12px;font-size:14px;cursor:pointer;position:relative;box-sizing:border-box;white-space:nowrap;user-select:none;}',
      '.stm-tab-active{color:rgb(var(--primary-6,22 93 255));font-weight:500;}',
      '.stm-tab-active::after{content:"";position:absolute;bottom:0;left:0;right:0;height:2px;background:rgb(var(--primary-6,22 93 255));}',
      '.stm-tab-inactive{color:var(--color-text-2,#4e5969);font-weight:400;}',
      '.stm-tab-inactive:hover{color:rgb(var(--primary-6,22 93 255));}',
      '.stm-avatar{width:32px;height:32px;border-radius:50%;background:#aaa;flex-shrink:0;}',
      '.stm-sub-container{display:flex;align-items:center;height:48px;background:var(--color-bg-1,#fff);border-bottom:1px solid var(--color-border-2,#e5e6eb);padding:0 16px;gap:16px;box-sizing:border-box;font-family:inherit;}',
      '.stm-sub-tabs{display:flex;align-items:center;height:100%;flex:1;}',
      '.stm-sub-tab{display:flex;align-items:center;height:100%;padding:0 12px;font-size:14px;cursor:pointer;position:relative;box-sizing:border-box;white-space:nowrap;user-select:none;}',
      '.stm-sub-tab-active{color:rgb(var(--primary-6,22 93 255));font-weight:500;}',
      '.stm-sub-tab-active::after{content:"";position:absolute;bottom:0;left:0;right:0;height:2px;background:rgb(var(--primary-6,22 93 255));}',
      '.stm-sub-tab-inactive{color:var(--color-text-2,#4e5969);font-weight:400;}',
      '.stm-sub-tab-inactive:hover{color:rgb(var(--primary-6,22 93 255));}',
      '.stm-sub-operations{flex-shrink:0;display:flex;align-items:center;}'
    ].join('\n');
    document.head.appendChild(style);
  }

  var HAMBURGER_SVG = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  var SEARCH_SVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5"/><line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  function STopMenu() {
    var el = Reflect.construct(HTMLElement, [], STopMenu);
    el._menuOptions = [];
    el._activeKey = '';
    el._menuVisible = false;
    el._logoSrc = '';
    el._logoWidth = 96;
    el._logoHeight = 96;
    el._showSearch = true;
    el._searchPlaceholder = '请输入关键词进行搜索';
    el._showHamburger = true;
    el._showAvatar = true;
    return el;
  }

  STopMenu.prototype = Object.create(HTMLElement.prototype);
  STopMenu.prototype.constructor = STopMenu;

  Object.defineProperty(STopMenu, 'observedAttributes', {
    get: function () {
      return ['logo-src', 'logo-width', 'logo-height', 'show-search', 'search-placeholder', 'show-hamburger', 'show-avatar'];
    }
  });

  STopMenu.prototype.connectedCallback = function () {
    injectStyles();
    this._syncAttributes();
    this._render();
  };

  STopMenu.prototype.attributeChangedCallback = function () {
    this._syncAttributes();
    this._render();
  };

  STopMenu.prototype._syncAttributes = function () {
    var logoSrc = this.getAttribute('logo-src');
    if (logoSrc !== null) this._logoSrc = logoSrc;

    var logoWidth = this.getAttribute('logo-width');
    if (logoWidth !== null) this._logoWidth = parseInt(logoWidth, 10) || 96;

    var logoHeight = this.getAttribute('logo-height');
    if (logoHeight !== null) this._logoHeight = parseInt(logoHeight, 10) || 96;

    var showSearch = this.getAttribute('show-search');
    if (showSearch !== null) this._showSearch = showSearch !== 'false';

    var searchPlaceholder = this.getAttribute('search-placeholder');
    if (searchPlaceholder !== null) this._searchPlaceholder = searchPlaceholder;

    var showHamburger = this.getAttribute('show-hamburger');
    if (showHamburger !== null) this._showHamburger = showHamburger !== 'false';

    var showAvatar = this.getAttribute('show-avatar');
    if (showAvatar !== null) this._showAvatar = showAvatar !== 'false';
  };

  Object.defineProperty(STopMenu.prototype, 'menuOptions', {
    get: function () { return this._menuOptions; },
    set: function (val) {
      this._menuOptions = Array.isArray(val) ? val : [];
      if (this._menuOptions.length > 0 && !this._activeKey) {
        this._activeKey = this._menuOptions[0].key;
      }
      this._render();
    }
  });

  Object.defineProperty(STopMenu.prototype, 'logoSrc', {
    get: function () { return this._logoSrc; },
    set: function (val) {
      this._logoSrc = val || '';
      this._render();
    }
  });

  Object.defineProperty(STopMenu.prototype, 'showSearch', {
    get: function () { return this._showSearch; },
    set: function (val) {
      this._showSearch = !!val;
      this._render();
    }
  });

  STopMenu.prototype._render = function () {
    if (!this.isConnected) return;

    var self = this;
    var html = '';

    html += '<div class="stm-container">';

    html += '<div class="stm-left">';
    if (self._showHamburger) {
      html += '<button class="stm-hamburger" data-action="hamburger">' + HAMBURGER_SVG + '</button>';
    }
    if (self._logoSrc) {
      html += '<img class="stm-logo-img" src="' + self._escapeAttr(self._logoSrc) + '" width="' + self._logoWidth + '" height="' + self._logoHeight + '"/>';
    } else {
      html += '<div class="stm-logo-placeholder">L</div>';
    }
    html += '</div>';

    html += '<div class="stm-center"></div>';

    html += '<div class="stm-right">';
    if (self._showSearch) {
      html += '<div class="stm-search">';
      html += '<span class="stm-search-icon">' + SEARCH_SVG + '</span>';
      html += '<input class="stm-search-input" type="text" placeholder="' + self._escapeAttr(self._searchPlaceholder) + '" data-action="search"/>';
      html += '</div>';
    }

    if (self._menuOptions.length > 0) {
      html += '<div class="stm-tabs">';
      for (var i = 0; i < self._menuOptions.length; i++) {
        var opt = self._menuOptions[i];
        var isActive = opt.key === self._activeKey;
        html += '<div class="stm-tab ' + (isActive ? 'stm-tab-active' : 'stm-tab-inactive') + '" data-action="tab" data-key="' + self._escapeAttr(opt.key) + '">';
        html += self._escapeHtml(opt.value);
        html += '</div>';
      }
      html += '</div>';
    }

    if (self._showAvatar) {
      html += '<div class="stm-avatar"></div>';
    }
    html += '</div>';

    html += '</div>';

    self.innerHTML = html;
    self._bindEvents();
  };

  STopMenu.prototype._bindEvents = function () {
    var self = this;

    var hamburgerBtn = self.querySelector('[data-action="hamburger"]');
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', function () {
        self._menuVisible = !self._menuVisible;
        self.dispatchEvent(new CustomEvent('hamburger-click', {
          bubbles: true,
          detail: { visible: self._menuVisible }
        }));
      });
    }

    var tabs = self.querySelectorAll('[data-action="tab"]');
    for (var i = 0; i < tabs.length; i++) {
      (function (tab) {
        tab.addEventListener('click', function () {
          var key = tab.getAttribute('data-key');
          self._activeKey = key;
          self._render();
          self.dispatchEvent(new CustomEvent('menu-select', {
            bubbles: true,
            detail: { key: key }
          }));
        });
      })(tabs[i]);
    }

    var searchInput = self.querySelector('[data-action="search"]');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        self.dispatchEvent(new CustomEvent('search-input', {
          bubbles: true,
          detail: { value: e.target.value }
        }));
      });
    }
  };

  STopMenu.prototype._escapeAttr = function (str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  STopMenu.prototype._escapeHtml = function (str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  function SSubTopMenu() {
    var el = Reflect.construct(HTMLElement, [], SSubTopMenu);
    el._menuOptions = [];
    el._activeKey = '';
    return el;
  }

  SSubTopMenu.prototype = Object.create(HTMLElement.prototype);
  SSubTopMenu.prototype.constructor = SSubTopMenu;

  SSubTopMenu.prototype.connectedCallback = function () {
    injectStyles();
    this._render();
  };

  Object.defineProperty(SSubTopMenu.prototype, 'menuOptions', {
    get: function () { return this._menuOptions; },
    set: function (val) {
      this._menuOptions = Array.isArray(val) ? val : [];
      if (this._menuOptions.length > 0 && !this._activeKey) {
        this._activeKey = this._menuOptions[0].key;
      }
      this._render();
    }
  });

  SSubTopMenu.prototype._render = function () {
    if (!this.isConnected) return;

    var self = this;
    var html = '';

    html += '<div class="stm-sub-container">';

    if (self._menuOptions.length > 0) {
      html += '<div class="stm-sub-tabs">';
      for (var i = 0; i < self._menuOptions.length; i++) {
        var opt = self._menuOptions[i];
        var isActive = opt.key === self._activeKey;
        html += '<div class="stm-sub-tab ' + (isActive ? 'stm-sub-tab-active' : 'stm-sub-tab-inactive') + '" data-action="sub-tab" data-key="' + self._escapeAttr(opt.key) + '">';
        html += self._escapeHtml(opt.value);
        html += '</div>';
      }
      html += '</div>';
    }

    html += '<div class="stm-sub-operations"></div>';

    html += '</div>';

    self.innerHTML = html;
    self._bindEvents();
  };

  SSubTopMenu.prototype._bindEvents = function () {
    var self = this;

    var tabs = self.querySelectorAll('[data-action="sub-tab"]');
    for (var i = 0; i < tabs.length; i++) {
      (function (tab) {
        tab.addEventListener('click', function () {
          var key = tab.getAttribute('data-key');
          self._activeKey = key;
          self._render();
          self.dispatchEvent(new CustomEvent('menu-select', {
            bubbles: true,
            detail: { key: key }
          }));
        });
      })(tabs[i]);
    }
  };

  SSubTopMenu.prototype._escapeAttr = function (str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  SSubTopMenu.prototype._escapeHtml = function (str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  customElements.define('s-top-menu', STopMenu);
  customElements.define('s-sub-top-menu', SSubTopMenu);
})();
