(function() {
  var STYLE_INJECTED = false;

  var CHEVRON_SVG = '<svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 1.5L4 4.5L7 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var FOLD_SVG = '<svg width="14" height="13" viewBox="0 0 14 13" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.8953 8.56445C13.1143 8.56446 13.2919 8.74202 13.2919 8.96105L13.2918 12.3723C13.2918 12.4445 13.2721 12.5152 13.2348 12.577C13.1218 12.7646 12.878 12.825 12.6904 12.7119L9.86108 11.0064C9.80581 10.9731 9.7595 10.9268 9.72618 10.8715C9.6131 10.6839 9.6735 10.4402 9.86108 10.3271L12.6905 8.62139C12.7523 8.58414 12.8231 8.56445 12.8953 8.56445ZM7 10C7.18409 10 7.33333 10.1492 7.33333 10.3333V11C7.33333 11.1841 7.18409 11.3333 7 11.3333H0.333333C0.149238 11.3333 0 11.1841 0 11V10.3333C0 10.1492 0.149238 10 0.333333 10H7ZM11.6667 5C11.8508 5 12 5.14924 12 5.33333V6C12 6.18409 11.8508 6.33333 11.6667 6.33333H0.333333C0.149238 6.33333 0 6.18409 0 6V5.33333C0 5.14924 0.149238 5 0.333333 5H11.6667ZM11.6667 0C11.8508 0 12 0.149238 12 0.333333V1C12 1.18409 11.8508 1.33333 11.6667 1.33333H0.333333C0.149238 1.33333 0 1.18409 0 1V0.333333C0 0.149238 0.149238 0 0.333333 0H11.6667Z" fill="currentColor"/></svg>';

  var UNFOLD_SVG = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.417707 9.17969C0.187009 9.17969 -4.76837e-06 9.35725 0 9.57628L8.39233e-05 12.9875C8.58307e-05 13.0597 0.0208206 13.1305 0.0600557 13.1923C0.179156 13.3798 0.435875 13.4402 0.633452 13.3272L3.61355 11.6216C3.67177 11.5883 3.72054 11.542 3.75564 11.4867C3.87474 11.2991 3.81113 11.0554 3.61355 10.9423L0.633377 9.23663C0.568283 9.19937 0.493715 9.17968 0.417707 9.17969ZM6.62706 10.6152C6.43316 10.6152 6.27597 10.7645 6.27597 10.9486V11.6152C6.27597 11.7993 6.43316 11.9486 6.62706 11.9486H13.6489C13.8428 11.9486 14 11.7993 14 11.6152V10.9486C14 10.7645 13.8428 10.6152 13.6489 10.6152H6.62706ZM1.71177 5.61523C1.51787 5.61523 1.36068 5.76447 1.36068 5.94857V6.61523C1.36068 6.79933 1.51787 6.94857 1.71177 6.94857H13.6489C13.8428 6.94857 14 6.79933 14 6.61523V5.94857C14 5.76447 13.8428 5.61523 13.6489 5.61523H1.71177ZM1.71177 0.615234C1.51787 0.615234 1.36068 0.764473 1.36068 0.948568V1.61523C1.36068 1.79933 1.51787 1.94857 1.71177 1.94857H13.6489C13.8428 1.94857 14 1.79933 14 1.61523V0.948568C14 0.764473 13.8428 0.615234 13.6489 0.615234H1.71177Z" fill="currentColor"/></svg>';

  var HOME_SVG = '<svg width="20" height="20" viewBox="-1 0 20 20" fill="none"><path d="M0.664062 6.86143V8.41904C0.664062 8.81119 1.10883 9.03786 1.42613 8.80742L8.7783 3.46772C8.94411 3.3473 9.16809 3.34542 9.33589 3.46306L16.7538 8.66306C17.0719 8.88605 17.5094 8.65849 17.5094 8.27001V7.08147C17.5094 6.9282 17.4362 6.78415 17.3124 6.69378L9.3343 0.869599C9.1677 0.747975 8.94202 0.746393 8.77373 0.865667L0.866509 6.46981C0.739526 6.55981 0.664062 6.70579 0.664062 6.86143Z" fill="#9FAABA"/><path d="M16.1763 9.8294L16.1763 16.7469C16.1763 17.012 15.9614 17.2269 15.6963 17.2269H12.0135H6.1628H2.48002C2.21493 17.2269 2.00003 17.012 2.00002 16.7469L2.00001 9.8294C2.00001 9.67605 2.07328 9.53193 2.19718 9.44158L8.80531 4.62229C8.97384 4.49938 9.20245 4.49938 9.37098 4.62229L15.9791 9.44158C16.103 9.53194 16.1763 9.67605 16.1763 9.8294Z" fill="#5E6673"/><rect x="6.08594" y="13.584" width="5.83333" height="1.25" fill="white"/></svg>';

  function injectStyles() {
    if (STYLE_INJECTED) return;
    STYLE_INJECTED = true;
    var css = [
      '.ssm-container {',
      '  height: 100%;',
      '  display: flex;',
      '  flex-direction: column;',
      '  background: var(--color-bg-2);',
      '  border-right: 1px solid var(--color-border);',
      '  overflow: hidden;',
      '  transition: width 0.2s ease;',
      '  box-sizing: border-box;',
      '}',
      '.ssm-menu-list {',
      '  flex: 1;',
      '  overflow-y: auto;',
      '  overflow-x: hidden;',
      '  padding: 4px 0;',
      '}',
      '.ssm-item {',
      '  display: flex;',
      '  align-items: center;',
      '  padding: 8px 12px;',
      '  border-radius: 4px;',
      '  margin: 0 4px;',
      '  font-size: 14px;',
      '  line-height: 22px;',
      '  cursor: pointer;',
      '  user-select: none;',
      '  transition: background-color 0.15s ease;',
      '  color: var(--color-text-1);',
      '  background: transparent;',
      '  white-space: nowrap;',
      '  overflow: hidden;',
      '  text-overflow: ellipsis;',
      '  box-sizing: border-box;',
      '}',
      '.ssm-item:hover {',
      '  background: var(--color-bg-5);',
      '}',
      '.ssm-item.ssm-selected {',
      '  background: var(--color-primary-light-1);',
      '  color: var(--primary-6);',
      '  font-weight: 500;',
      '}',
      '.ssm-item.ssm-selected:hover {',
      '  background: var(--color-primary-light-1);',
      '}',
      '.ssm-item-collapsed {',
      '  padding: 8px 0;',
      '  justify-content: center;',
      '}',
      '.ssm-item-text {',
      '  flex: 1;',
      '  overflow: hidden;',
      '  text-overflow: ellipsis;',
      '}',
      '.ssm-chevron {',
      '  display: flex;',
      '  align-items: center;',
      '  margin-left: 4px;',
      '  transition: transform 0.2s ease;',
      '  flex-shrink: 0;',
      '}',
      '.ssm-chevron-collapsed {',
      '  transform: rotate(-90deg);',
      '}',
      '.ssm-group-header {',
      '  font-size: 12px;',
      '  color: var(--color-text-3);',
      '  font-weight: 500;',
      '  line-height: 22px;',
      '  padding: 8px 12px;',
      '  user-select: none;',
      '  white-space: nowrap;',
      '  overflow: hidden;',
      '  text-overflow: ellipsis;',
      '  box-sizing: border-box;',
      '}',
      '.ssm-overview-item {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 8px;',
      '}',
      '.ssm-overview-icon {',
      '  display: flex;',
      '  align-items: center;',
      '  flex-shrink: 0;',
      '}',
      '.ssm-bottom {',
      '  border-top: 1px solid var(--color-border);',
      '  padding: 8px;',
      '  display: flex;',
      '}',
      '.ssm-bottom-expanded {',
      '  justify-content: flex-end;',
      '}',
      '.ssm-bottom-collapsed {',
      '  justify-content: center;',
      '}',
      '.ssm-collapse-btn {',
      '  width: 28px;',
      '  height: 28px;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  border: none;',
      '  background: transparent;',
      '  cursor: pointer;',
      '  border-radius: 4px;',
      '  color: var(--color-text-1);',
      '  padding: 0;',
      '}',
      '.ssm-collapse-btn:hover {',
      '  background: var(--color-bg-5);',
      '}',
      '.ssm-children {',
      '  overflow: hidden;',
      '}'
    ].join('\n');
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  class SSideMenu extends HTMLElement {
    static get observedAttributes() {
      return ['width', 'collapse', 'show-overview', 'selected-keys'];
    }

    constructor() {
      super();
      this._menuOptions = [];
      this._selectedKeys = [];
      this._expandedKeys = {};
      this._collapsed = false;
      this._width = 200;
      this._showOverview = false;
    }

    get menuOptions() {
      return this._menuOptions;
    }

    set menuOptions(val) {
      this._menuOptions = val || [];
      this._initExpandedKeys(this._menuOptions);
      this._render();
    }

    get selectedKeys() {
      return this._selectedKeys;
    }

    set selectedKeys(val) {
      this._selectedKeys = val || [];
      this._render();
    }

    connectedCallback() {
      injectStyles();
      this._syncAttributes();
      this._render();
    }

    disconnectedCallback() {}

    attributeChangedCallback(name, oldVal, newVal) {
      if (oldVal === newVal) return;
      this._syncAttributes();
      this._render();
    }

    _syncAttributes() {
      var w = this.getAttribute('width');
      if (w !== null) {
        this._width = parseInt(w, 10) || 200;
      }
      this._collapsed = this.hasAttribute('collapse');
      this._showOverview = this.hasAttribute('show-overview');
      var sk = this.getAttribute('selected-keys');
      if (sk !== null) {
        this._selectedKeys = sk.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
      }
    }

    _initExpandedKeys(options) {
      for (var i = 0; i < options.length; i++) {
        var item = options[i];
        if (item.children && item.children.length > 0 && !item.group) {
          if (!(item.key in this._expandedKeys)) {
            this._expandedKeys[item.key] = true;
          }
          this._initExpandedKeys(item.children);
        }
        if (item.children && item.group) {
          this._initExpandedKeys(item.children);
        }
      }
    }

    _isSelected(key) {
      return this._selectedKeys.indexOf(key) !== -1;
    }

    _renderMenuItem(item, level, collapsed) {
      var isGroup = item.group && item.children && item.children.length > 0;
      var isParent = !item.group && item.children && item.children.length > 0;

      if (isGroup) {
        return this._renderGroup(item, level, collapsed);
      }

      var fragment = document.createDocumentFragment();

      if (isParent) {
        fragment.appendChild(this._createParentItem(item, level, collapsed));

        var expanded = this._expandedKeys[item.key] !== false;
        if (!collapsed && expanded) {
          var childrenDiv = document.createElement('div');
          childrenDiv.className = 'ssm-children';
          for (var i = 0; i < item.children.length; i++) {
            childrenDiv.appendChild(this._renderMenuItem(item.children[i], level + 1, collapsed));
          }
          fragment.appendChild(childrenDiv);
        }
        return fragment;
      }

      fragment.appendChild(this._createLeafItem(item, level, collapsed));
      return fragment;
    }

    _createLeafItem(item, level, collapsed) {
      var div = document.createElement('div');
      var classes = 'ssm-item';
      if (collapsed) classes += ' ssm-item-collapsed';
      if (this._isSelected(item.key)) classes += ' ssm-selected';
      div.className = classes;
      div.setAttribute('data-key', item.key);
      div.setAttribute('data-action', 'select');

      if (collapsed) {
        div.textContent = item.display.charAt(0);
        div.title = item.display;
      } else {
        div.style.paddingLeft = (12 + level * 32) + 'px';
        var textSpan = document.createElement('span');
        textSpan.className = 'ssm-item-text';
        textSpan.textContent = item.display;
        div.appendChild(textSpan);
      }

      return div;
    }

    _createParentItem(item, level, collapsed) {
      var div = document.createElement('div');
      var classes = 'ssm-item';
      if (collapsed) classes += ' ssm-item-collapsed';
      div.className = classes;
      div.setAttribute('data-key', item.key);
      div.setAttribute('data-action', 'toggle');

      if (collapsed) {
        div.textContent = item.display.charAt(0);
        div.title = item.display;
      } else {
        div.style.paddingLeft = (12 + level * 32) + 'px';
        var textSpan = document.createElement('span');
        textSpan.className = 'ssm-item-text';
        textSpan.textContent = item.display;
        div.appendChild(textSpan);

        var expanded = this._expandedKeys[item.key] !== false;
        var chevronSpan = document.createElement('span');
        chevronSpan.className = 'ssm-chevron' + (expanded ? '' : ' ssm-chevron-collapsed');
        chevronSpan.innerHTML = CHEVRON_SVG;
        div.appendChild(chevronSpan);
      }

      return div;
    }

    _renderGroup(item, level, collapsed) {
      var fragment = document.createDocumentFragment();

      if (!collapsed) {
        var header = document.createElement('div');
        header.className = 'ssm-group-header';
        header.style.paddingLeft = (12 + level * 32) + 'px';
        header.textContent = item.display;
        fragment.appendChild(header);
      }

      for (var i = 0; i < item.children.length; i++) {
        fragment.appendChild(this._renderMenuItem(item.children[i], collapsed ? level : level + 1, collapsed));
      }

      return fragment;
    }

    _renderOverview(collapsed) {
      var div = document.createElement('div');
      var classes = 'ssm-item';
      if (collapsed) classes += ' ssm-item-collapsed';
      if (this._isSelected('__overview__')) classes += ' ssm-selected';
      div.className = classes;
      div.setAttribute('data-key', '__overview__');
      div.setAttribute('data-action', 'select');

      if (collapsed) {
        var iconSpan = document.createElement('span');
        iconSpan.className = 'ssm-overview-icon';
        iconSpan.innerHTML = HOME_SVG;
        div.appendChild(iconSpan);
        div.title = '\u6982\u89C8';
      } else {
        div.style.paddingLeft = '12px';
        var wrapper = document.createElement('div');
        wrapper.className = 'ssm-overview-item';
        var iconSpan2 = document.createElement('span');
        iconSpan2.className = 'ssm-overview-icon';
        iconSpan2.innerHTML = HOME_SVG;
        wrapper.appendChild(iconSpan2);
        var textSpan = document.createElement('span');
        textSpan.className = 'ssm-item-text';
        textSpan.textContent = '\u6982\u89C8';
        wrapper.appendChild(textSpan);
        div.appendChild(wrapper);
      }

      return div;
    }

    _render() {
      if (!this.isConnected) return;

      var collapsed = this._collapsed;
      var width = collapsed ? 48 : this._width;

      this.innerHTML = '';

      var container = document.createElement('div');
      container.className = 'ssm-container';
      container.style.width = width + 'px';

      var menuList = document.createElement('div');
      menuList.className = 'ssm-menu-list';

      if (this._showOverview) {
        menuList.appendChild(this._renderOverview(collapsed));
      }

      for (var i = 0; i < this._menuOptions.length; i++) {
        menuList.appendChild(this._renderMenuItem(this._menuOptions[i], 0, collapsed));
      }

      container.appendChild(menuList);

      var bottom = document.createElement('div');
      bottom.className = 'ssm-bottom ' + (collapsed ? 'ssm-bottom-collapsed' : 'ssm-bottom-expanded');

      var btn = document.createElement('button');
      btn.className = 'ssm-collapse-btn';
      btn.setAttribute('data-action', 'collapse');
      btn.innerHTML = collapsed ? UNFOLD_SVG : FOLD_SVG;
      bottom.appendChild(btn);

      container.appendChild(bottom);
      this.appendChild(container);

      this._bindEvents(container);
    }

    _bindEvents(container) {
      var self = this;
      container.addEventListener('click', function(e) {
        var target = e.target;
        while (target && target !== container) {
          var action = target.getAttribute('data-action');
          if (action === 'select') {
            var key = target.getAttribute('data-key');
            self._selectedKeys = [key];
            self._render();
            self.dispatchEvent(new CustomEvent('menu-click', {
              bubbles: true,
              detail: { key: key }
            }));
            return;
          }
          if (action === 'toggle') {
            var toggleKey = target.getAttribute('data-key');
            self._expandedKeys[toggleKey] = self._expandedKeys[toggleKey] === false;
            self._render();
            return;
          }
          if (action === 'collapse') {
            self._collapsed = !self._collapsed;
            if (self._collapsed) {
              self.setAttribute('collapse', '');
            } else {
              self.removeAttribute('collapse');
            }
            self._render();
            self.dispatchEvent(new CustomEvent('collapse-change', {
              bubbles: true,
              detail: { collapsed: self._collapsed }
            }));
            return;
          }
          target = target.parentElement;
        }
      });
    }
  }

  customElements.define('s-side-menu', SSideMenu);
})();
