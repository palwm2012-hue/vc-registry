(function () {
  var STYLE_INJECTED = false;

  function injectStyles() {
    if (STYLE_INJECTED) return;
    STYLE_INJECTED = true;
    var style = document.createElement("style");
    style.textContent =
      "@keyframes s-table-spin { to { transform: rotate(360deg); } }" +
      ".st-wrapper { position: relative; overflow: hidden; border: 1px solid var(--color-border-2, #e5e6eb); border-radius: var(--border-radius-small, 4px); background: var(--color-bg-1, #fff); }" +
      ".st-scroll-container { overflow: auto; }" +
      ".st-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 14px; color: var(--color-text-1, #1d2129); }" +
      ".st-table-fixed { table-layout: fixed; }" +
      ".st-th { padding: 9px 16px; font-weight: 500; font-size: 14px; line-height: 22px; color: var(--color-text-2, #4e5969); background: var(--color-bg-4, #f2f3f5); white-space: nowrap; position: relative; box-sizing: border-box; }" +
      ".st-td { padding: 9px 16px; font-size: 14px; line-height: 22px; box-sizing: border-box; transition: background 0.2s; }" +
      ".st-td-editable { padding: 4px 8px; }" +
      ".st-border-bottom { border-bottom: 1px solid var(--color-border-2, #e5e6eb); }" +
      ".st-border-right { border-right: 1px solid var(--color-border-2, #e5e6eb); }" +
      ".st-bg-hover { background: var(--color-bg-4, #f2f3f5) !important; }" +
      ".st-bg-stripe { background: var(--color-bg-4, #f2f3f5); }" +
      ".st-bg-default { background: var(--color-bg-1, #fff); }" +
      ".st-spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid rgb(var(--primary-6, 22 93 255)); border-top-color: transparent; border-radius: 50%; animation: s-table-spin 0.8s linear infinite; }" +
      ".st-empty { color: var(--color-text-3, #86909c); font-size: 14px; }" +
      ".st-pagination { display: flex; justify-content: flex-end; padding: 12px 0; }" +
      ".st-page-list { display: flex; align-items: center; gap: 8px; list-style: none; margin: 0; padding: 0; }" +
      ".st-page-btn { display: inline-flex; align-items: center; justify-content: center; min-width: 32px; height: 32px; padding: 0 6px; border: 1px solid var(--color-border-2, #e5e6eb); border-radius: var(--border-radius-small, 4px); background: var(--color-bg-1, #fff); color: var(--color-text-1, #1d2129); font-size: 14px; cursor: pointer; user-select: none; box-sizing: border-box; transition: all 0.2s; }" +
      ".st-page-btn:hover { border-color: rgb(var(--primary-6, 22 93 255)); color: rgb(var(--primary-6, 22 93 255)); }" +
      ".st-page-btn-active { border-color: rgb(var(--primary-6, 22 93 255)); color: rgb(var(--primary-6, 22 93 255)); font-weight: 500; }" +
      ".st-page-btn-disabled { opacity: 0.5; pointer-events: none; cursor: default; }" +
      ".st-page-ellipsis { display: inline-flex; align-items: center; justify-content: center; min-width: 32px; height: 32px; font-size: 14px; color: var(--color-text-3, #86909c); user-select: none; }" +
      ".st-text-btn { font-size: 12px; cursor: pointer; margin-right: 12px; color: rgb(var(--primary-6, 22 93 255)); }" +
      ".st-text-btn-disabled { color: var(--color-text-4, #c9cdd4); cursor: default; }" +
      ".st-add-row-btn { width: 100%; height: 32px; display: flex; align-items: center; justify-content: center; gap: 4px; border: 1px dashed var(--color-border-2, #e5e6eb); border-radius: var(--border-radius-small, 4px); background: var(--color-bg-4, #f2f3f5); color: var(--color-text-2, #4e5969); font-size: 14px; cursor: pointer; transition: all 0.2s; box-sizing: border-box; margin-top: 12px; }" +
      ".st-add-row-btn:hover { border-color: rgb(var(--primary-6, 22 93 255)); color: rgb(var(--primary-6, 22 93 255)); }" +
      ".st-add-row-btn-disabled { color: var(--color-text-4, #c9cdd4); cursor: not-allowed; }" +
      ".st-add-row-btn-disabled:hover { border-color: var(--color-border-2, #e5e6eb); color: var(--color-text-4, #c9cdd4); }" +
      ".st-edit-cell-wrap { box-sizing: border-box; padding: 6px 12px; min-height: 32px; cursor: pointer; border: 1px solid transparent; border-radius: var(--border-radius-small, 4px); transition: border-color 0.2s; }" +
      ".st-edit-cell-wrap:hover { border-color: var(--color-border-2, #e5e6eb); }" +
      ".st-edit-cell-wrap-status { cursor: default; }" +
      ".st-edit-cell-wrap-status:hover { border-color: transparent; }" +
      ".st-edit-input { width: 100%; height: 30px; padding: 4px 8px; border: 1px solid rgb(var(--primary-6, 22 93 255)); border-radius: var(--border-radius-small, 4px); outline: none; font-size: 14px; box-sizing: border-box; }" +
      ".st-row { transition: background 0.2s; }";
    document.head.appendChild(style);
  }

  var ROW_STATUS = { DEFAULT: "default", NEW: "new", EDITING: "editing", TEMPORARY: "temporary" };

  function getRowKey(record, rowKeyProp) {
    if (typeof rowKeyProp === "function") return rowKeyProp(record);
    if (typeof rowKeyProp === "string") return String(record[rowKeyProp]);
    return record.key != null ? String(record.key) : String(Math.random());
  }

  function getLeafColumns(columns) {
    var leaves = [];
    function traverse(cols) {
      cols.forEach(function (col) {
        if (col.children && col.children.length > 0) {
          traverse(col.children);
        } else {
          leaves.push(col);
        }
      });
    }
    traverse(columns);
    return leaves;
  }

  function getMaxDepth(columns) {
    var max = 1;
    columns.forEach(function (col) {
      if (col.children && col.children.length > 0) {
        max = Math.max(max, 1 + getMaxDepth(col.children));
      }
    });
    return max;
  }

  function getLeafCount(col) {
    if (!col.children || col.children.length === 0) return 1;
    return col.children.reduce(function (sum, c) { return sum + getLeafCount(c); }, 0);
  }

  function getHeaderRows(columns) {
    var maxDepth = getMaxDepth(columns);
    var rows = [];
    for (var i = 0; i < maxDepth; i++) rows.push([]);

    function fill(cols, depth, startLeafIndex) {
      var currentLeafIndex = startLeafIndex;
      cols.forEach(function (col) {
        var leafCount = getLeafCount(col);
        if (col.children && col.children.length > 0) {
          rows[depth].push({
            col: col,
            colSpan: leafCount,
            rowSpan: 1,
            startLeafIndex: currentLeafIndex,
            endLeafIndex: currentLeafIndex + leafCount - 1,
          });
          fill(col.children, depth + 1, currentLeafIndex);
        } else {
          rows[depth].push({
            col: col,
            colSpan: 1,
            rowSpan: maxDepth - depth,
            startLeafIndex: currentLeafIndex,
            endLeafIndex: currentLeafIndex,
          });
        }
        currentLeafIndex += leafCount;
      });
    }
    fill(columns, 0, 0);
    return rows;
  }

  function getPageNumbers(current, total) {
    if (total <= 7) {
      var arr = [];
      for (var i = 1; i <= total; i++) arr.push(i);
      return arr;
    }
    var pages = [1];
    if (current > 3) pages.push("ellipsis");
    var start = Math.max(2, current - 1);
    var end = Math.min(total - 1, current + 1);
    for (var j = start; j <= end; j++) pages.push(j);
    if (current < total - 2) pages.push("ellipsis");
    pages.push(total);
    return pages;
  }

  function getPureData(statusData) {
    if (Array.isArray(statusData)) {
      return statusData.map(function (item) {
        var d = Object.assign({}, item);
        delete d.__STATUS;
        return d;
      });
    }
    var d = Object.assign({}, statusData);
    delete d.__STATUS;
    return d;
  }

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var chevronLeft = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
  var chevronRight = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
  var plusCircleSvg = '<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle"><circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="3"/><path d="M24 16v16M16 24h16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';

  var OBSERVED_ATTRS = [
    "border-cell", "stripe", "hover", "page-size", "row-key",
    "loading", "no-data-text", "scroll-x", "scroll-y",
    "show-action-column", "action-column-title",
    "add-row-btn", "add-row-btn-text", "max-data-length"
  ];

  function STable() {
    var el = Reflect.construct(HTMLElement, [], STable);
    el._columns = [];
    el._data = [];
    el._config = {};
    el._innerData = [];
    el._currentPage = 1;
    el._hoverRow = null;
    el._editingCells = {};
    el._formValues = {};
    el._renderScheduled = false;
    el._mounted = false;
    el._clickHandler = null;
    return el;
  }

  STable.prototype = Object.create(HTMLElement.prototype);
  STable.prototype.constructor = STable;

  Object.defineProperty(STable, "observedAttributes", {
    get: function () { return OBSERVED_ATTRS; }
  });

  STable.prototype.connectedCallback = function () {
    injectStyles();
    this._mounted = true;
    this._bindDelegatedEvents();
    this._render();
    this._bindGlobalClick();
  };

  STable.prototype.disconnectedCallback = function () {
    this._mounted = false;
    this._unbindGlobalClick();
    this._unbindDelegatedEvents();
  };

  STable.prototype.attributeChangedCallback = function () {
    if (this._mounted) this._scheduleRender();
  };

  STable.prototype._bindGlobalClick = function () {
    var self = this;
    this._clickHandler = function (e) {
      var keys = Object.keys(self._editingCells);
      if (keys.length === 0) return;
      keys.forEach(function (cellKey) {
        var cellEl = self.querySelector('[data-cell-key="' + cellKey + '"]');
        if (cellEl && !cellEl.contains(e.target)) {
          self._saveCellEdit(cellKey);
        }
      });
    };
    document.addEventListener("click", this._clickHandler, true);
  };

  STable.prototype._unbindGlobalClick = function () {
    if (this._clickHandler) {
      document.removeEventListener("click", this._clickHandler, true);
      this._clickHandler = null;
    }
  };

  Object.defineProperty(STable.prototype, "columns", {
    get: function () { return this._columns; },
    set: function (val) {
      this._columns = val || [];
      this._scheduleRender();
    }
  });

  Object.defineProperty(STable.prototype, "data", {
    get: function () { return this._data; },
    set: function (val) {
      this._data = val || [];
      this._syncInnerData();
      this._scheduleRender();
    }
  });

  Object.defineProperty(STable.prototype, "config", {
    get: function () { return this._config; },
    set: function (val) {
      this._config = val || {};
      this._scheduleRender();
    }
  });

  STable.prototype._getConfig = function (key, defaultVal) {
    if (this._config && this._config[key] !== undefined) return this._config[key];
    var attrMap = {
      borderCell: "border-cell",
      stripe: "stripe",
      hover: "hover",
      pageSize: "page-size",
      rowKey: "row-key",
      loading: "loading",
      noDataText: "no-data-text",
      scrollX: "scroll-x",
      scrollY: "scroll-y",
      showActionColumn: "show-action-column",
      actionColumnTitle: "action-column-title",
      addRowBtn: "add-row-btn",
      addRowBtnText: "add-row-btn-text",
      maxDataLength: "max-data-length",
    };
    var attr = attrMap[key];
    if (attr) {
      var booleans = ["borderCell", "stripe", "hover", "loading", "showActionColumn", "addRowBtn"];
      var numbers = ["pageSize", "scrollX", "scrollY", "maxDataLength"];
      if (booleans.indexOf(key) !== -1) {
        if (!this.hasAttribute(attr)) return defaultVal;
        var v = this.getAttribute(attr);
        if (v === "" || v === "true") return true;
        if (v === "false") return false;
        return defaultVal;
      }
      if (numbers.indexOf(key) !== -1) {
        var nv = this.getAttribute(attr);
        if (nv != null) { var parsed = Number(nv); return isNaN(parsed) ? defaultVal : parsed; }
        return defaultVal;
      }
      var sv = this.getAttribute(attr);
      if (sv != null) return sv;
    }
    return defaultVal;
  };

  STable.prototype._syncInnerData = function () {
    var self = this;
    var showAction = this._getConfig("showActionColumn", false);
    var rowKey = this._getConfig("rowKey", "key");
    var prev = this._innerData;
    this._innerData = this._data.map(function (item) {
      var stateItem = null;
      for (var i = 0; i < prev.length; i++) {
        if (getRowKey(prev[i], rowKey) === getRowKey(item, rowKey)) {
          stateItem = prev[i];
          break;
        }
      }
      var status;
      if (item.__STATUS) {
        status = item.__STATUS;
      } else if (!stateItem || stateItem.__STATUS === ROW_STATUS.TEMPORARY) {
        status = ROW_STATUS.NEW;
      } else if (!stateItem.__STATUS) {
        status = ROW_STATUS.DEFAULT;
      } else {
        status = stateItem.__STATUS;
      }
      if (showAction) {
        return Object.assign({}, item, { __STATUS: status });
      }
      return Object.assign({}, item);
    });
    this._adjustPage();
  };

  STable.prototype._adjustPage = function () {
    var pageSize = this._getConfig("pageSize", 10);
    var maxPage = Math.max(1, Math.ceil(this._innerData.length / pageSize));
    if (this._currentPage > maxPage) this._currentPage = maxPage;
  };

  STable.prototype._scheduleRender = function () {
    if (this._renderScheduled) return;
    this._renderScheduled = true;
    var self = this;
    Promise.resolve().then(function () {
      self._renderScheduled = false;
      if (self._mounted) self._render();
    });
  };

  STable.prototype._emit = function (name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail: detail, bubbles: true, composed: true }));
  };

  STable.prototype._saveRow = function (row) {
    var rowKey = this._getConfig("rowKey", "key");
    var rk = getRowKey(row, rowKey);
    var formVals = this._formValues[rk] || {};
    var merged = Object.assign({}, row, formVals, { __STATUS: ROW_STATUS.DEFAULT });
    this._innerData = this._innerData.map(function (item) {
      return getRowKey(item, rowKey) === rk ? merged : item;
    });
    delete this._formValues[rk];
    var cellKeys = Object.keys(this._editingCells);
    for (var i = 0; i < cellKeys.length; i++) {
      if (cellKeys[i].indexOf(rk + "::") === 0) delete this._editingCells[cellKeys[i]];
    }
    this._emit("row-save", { data: getPureData(this._innerData), savedRow: getPureData(merged) });
    this._scheduleRender();
  };

  STable.prototype._removeRow = function (row) {
    var rowKey = this._getConfig("rowKey", "key");
    var rk = getRowKey(row, rowKey);
    this._innerData = this._innerData.filter(function (item) {
      return getRowKey(item, rowKey) !== rk;
    });
    delete this._formValues[rk];
    this._adjustPage();
    this._emit("row-remove", { data: getPureData(this._innerData), removedRow: getPureData(row) });
    this._scheduleRender();
  };

  STable.prototype._editRow = function (row) {
    var rowKey = this._getConfig("rowKey", "key");
    var rk = getRowKey(row, rowKey);
    this._innerData = this._innerData.map(function (item) {
      return getRowKey(item, rowKey) === rk ? Object.assign({}, item, { __STATUS: ROW_STATUS.EDITING }) : item;
    });
    this._formValues[rk] = Object.assign({}, row);
    delete this._formValues[rk].__STATUS;
    this._emit("row-edit", { data: getPureData(this._innerData), editingRow: getPureData(row) });
    this._scheduleRender();
  };

  STable.prototype._cancelRow = function (row) {
    var rowKey = this._getConfig("rowKey", "key");
    var rk = getRowKey(row, rowKey);
    var status = row.__STATUS;
    if (status === ROW_STATUS.EDITING) {
      this._innerData = this._innerData.map(function (item) {
        return getRowKey(item, rowKey) === rk ? Object.assign({}, item, { __STATUS: ROW_STATUS.DEFAULT }) : item;
      });
    } else {
      this._innerData = this._innerData.filter(function (item) {
        return getRowKey(item, rowKey) !== rk;
      });
    }
    delete this._formValues[rk];
    var cellKeys = Object.keys(this._editingCells);
    for (var i = 0; i < cellKeys.length; i++) {
      if (cellKeys[i].indexOf(rk + "::") === 0) delete this._editingCells[cellKeys[i]];
    }
    this._adjustPage();
    this._emit("row-cancel", { data: getPureData(this._innerData), canceledRow: getPureData(row) });
    this._scheduleRender();
  };

  STable.prototype._addRow = function () {
    var columns = this._columns;
    var showAction = this._getConfig("showActionColumn", false);
    var defaultRow = { key: String(Date.now()) };
    if (showAction) {
      defaultRow.__STATUS = ROW_STATUS.NEW;
    }
    columns.forEach(function (col) {
      if (col.dataIndex) defaultRow[col.dataIndex] = "";
    });
    this._innerData = this._innerData.concat([defaultRow]);
    var pageSize = this._getConfig("pageSize", 10);
    var totalPages = Math.ceil(this._innerData.length / pageSize);
    if (this._innerData.length > pageSize) {
      this._currentPage = totalPages;
    }
    this._emit("row-add", { data: getPureData(this._innerData) });
    this._scheduleRender();
  };

  STable.prototype._startCellEdit = function (cellKey, rowKey, dataIndex, value) {
    if (!this._formValues[rowKey]) this._formValues[rowKey] = {};
    this._formValues[rowKey][dataIndex] = value;
    this._editingCells[cellKey] = true;
    this._scheduleRender();
  };

  STable.prototype._saveCellEdit = function (cellKey) {
    if (!this._editingCells[cellKey]) return;
    var parts = cellKey.split("::");
    var rk = parts[0];
    var dataIndex = parts[1];
    var rowKeyProp = this._getConfig("rowKey", "key");
    var formVals = this._formValues[rk] || {};
    delete this._editingCells[cellKey];
    this._innerData = this._innerData.map(function (item) {
      if (getRowKey(item, rowKeyProp) === rk) {
        return Object.assign({}, item, formVals);
      }
      return item;
    });
    this._scheduleRender();
  };

  STable.prototype._render = function () {
    var self = this;
    var columns = this._columns || [];
    var borderCell = this._getConfig("borderCell", true);
    var stripe = this._getConfig("stripe", false);
    var hover = this._getConfig("hover", true);
    var pageSize = this._getConfig("pageSize", 10);
    var rowKey = this._getConfig("rowKey", "key");
    var loading = this._getConfig("loading", false);
    var noDataText = this._getConfig("noDataText", "暂无数据");
    var scrollX = this._getConfig("scrollX", null);
    var scrollY = this._getConfig("scrollY", null);
    var showActionColumn = this._getConfig("showActionColumn", false);
    var actionColumnTitle = this._getConfig("actionColumnTitle", "操作");
    var addRowBtn = this._getConfig("addRowBtn", false);
    var addRowBtnText = this._getConfig("addRowBtnText", "添加一行");
    var maxDataLength = this._getConfig("maxDataLength", null);

    var innerData = this._innerData;

    var fullColumns = columns.slice();
    if (showActionColumn) {
      fullColumns.push({
        title: actionColumnTitle,
        dataIndex: "__ACTION_COLUMN__",
        width: 150,
      });
    }

    var leafCols = getLeafColumns(columns);
    var allLeafColumns = leafCols.slice();
    if (showActionColumn) {
      allLeafColumns.push({
        title: actionColumnTitle,
        dataIndex: "__ACTION_COLUMN__",
        width: 150,
      });
    }

    var headerRows = getHeaderRows(fullColumns);

    var totalItems = innerData.length;
    var totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    var showPagination = totalItems > pageSize;

    if (this._currentPage > totalPages) this._currentPage = totalPages;
    if (this._currentPage < 1) this._currentPage = 1;

    var paginatedData = showPagination
      ? innerData.slice((this._currentPage - 1) * pageSize, this._currentPage * pageSize)
      : innerData;

    var html = "";

    html += '<div class="st-wrapper">';
    html += '<div class="st-scroll-container"';
    if (scrollY) html += ' style="max-height:' + scrollY + 'px;overflow-y:auto"';
    html += ">";

    html += '<table class="st-table';
    if (scrollX) html += " st-table-fixed";
    html += '"';
    if (scrollX) html += ' style="min-width:' + scrollX + 'px"';
    html += ">";

    html += "<colgroup>";
    allLeafColumns.forEach(function (col, i) {
      var w = col.width;
      if (w != null) {
        html += '<col style="width:' + (typeof w === "number" ? w + "px" : w) + '">';
      } else {
        html += "<col>";
      }
    });
    html += "</colgroup>";

    html += "<thead>";
    headerRows.forEach(function (row) {
      html += "<tr>";
      row.forEach(function (cell) {
        html += "<th class=\"st-th";
        var isLastLeaf = cell.endLeafIndex >= allLeafColumns.length - 1;
        html += " st-border-bottom";
        if (borderCell && !isLastLeaf) html += " st-border-right";
        html += '"';
        if (cell.colSpan > 1) html += ' colspan="' + cell.colSpan + '"';
        if (cell.rowSpan > 1) html += ' rowspan="' + cell.rowSpan + '"';
        var align = cell.col.align || "left";
        html += ' style="text-align:' + align + '"';
        html += ">";
        html += escapeHtml(cell.col.title);
        html += "</th>";
      });
      html += "</tr>";
    });
    html += "</thead>";

    html += "<tbody>";

    if (loading) {
      html += '<tr><td colspan="' + allLeafColumns.length + '" style="padding:40px;text-align:center">';
      html += '<div class="st-spinner"></div>';
      html += "</td></tr>";
    } else if (innerData.length === 0) {
      html += '<tr><td colspan="' + allLeafColumns.length + '" style="padding:40px;text-align:center">';
      html += '<div class="st-empty">' + escapeHtml(noDataText) + "</div>";
      html += "</td></tr>";
    } else {
      paginatedData.forEach(function (record, rowIndex) {
        var rk = getRowKey(record, rowKey);
        var isLastRow = rowIndex >= paginatedData.length - 1;
        var isStatusEditing = record.__STATUS === ROW_STATUS.NEW || record.__STATUS === ROW_STATUS.EDITING;

        html += '<tr class="st-row" data-row-key="' + escapeHtml(rk) + '">';

        allLeafColumns.forEach(function (col, colIndex) {
          var isLastCol = colIndex >= allLeafColumns.length - 1;
          var isActionCol = col.dataIndex === "__ACTION_COLUMN__";
          var value = col.dataIndex && !isActionCol ? record[col.dataIndex] : undefined;
          var align = col.align || "left";
          var isEditable = col.editable && !isActionCol;
          var cellKey = rk + "::" + (col.dataIndex || col.key || colIndex);
          var isCellEditing = !!self._editingCells[cellKey];

          var tdClasses = "st-td";
          if (isEditable) tdClasses += " st-td-editable";
          if (!isLastRow) tdClasses += " st-border-bottom";
          if (borderCell && !isLastCol) tdClasses += " st-border-right";
          if (stripe && rowIndex % 2 === 1) tdClasses += " st-bg-stripe";

          html += '<td class="' + tdClasses + '" style="text-align:' + align + '"';
          html += ' data-row-key="' + escapeHtml(rk) + '"';
          html += ' data-col-index="' + colIndex + '"';
          html += ">";

          if (isActionCol && showActionColumn) {
            if (isStatusEditing) {
              html += '<span class="st-text-btn" data-action="save" data-row-key="' + escapeHtml(rk) + '">保存</span>';
              html += '<span class="st-text-btn" data-action="cancel" data-row-key="' + escapeHtml(rk) + '">取消</span>';
            } else {
              html += '<span class="st-text-btn" data-action="edit" data-row-key="' + escapeHtml(rk) + '">编辑</span>';
              html += '<span class="st-text-btn" data-action="remove" data-row-key="' + escapeHtml(rk) + '">删除</span>';
            }
          } else if (isEditable) {
            if (isCellEditing || isStatusEditing) {
              var fv = self._formValues[rk] && self._formValues[rk][col.dataIndex] != null
                ? self._formValues[rk][col.dataIndex]
                : (value != null ? value : "");
              html += '<div data-cell-key="' + escapeHtml(cellKey) + '">';
              html += '<input class="st-edit-input" data-cell-key="' + escapeHtml(cellKey) + '" data-row-key="' + escapeHtml(rk) + '" data-data-index="' + escapeHtml(col.dataIndex) + '" value="' + escapeHtml(fv) + '">';
              html += "</div>";
            } else {
              html += '<div class="st-edit-cell-wrap' + (record.__STATUS ? " st-edit-cell-wrap-status" : "") + '" data-cell-key="' + escapeHtml(cellKey) + '" data-row-key="' + escapeHtml(rk) + '" data-data-index="' + escapeHtml(col.dataIndex || "") + '" data-editable="true">';
              var cellContent;
              if (col.render) {
                var rendered = col.render(value, record, rowIndex);
                if (rendered instanceof HTMLElement) {
                  cellContent = "__HTML_ELEMENT__:" + colIndex + ":" + rowIndex;
                } else {
                  cellContent = rendered != null ? escapeHtml(rendered) : "";
                }
              } else {
                cellContent = value != null ? escapeHtml(value) : "";
              }
              html += cellContent;
              html += "</div>";
            }
          } else {
            if (col.render) {
              var rendered = col.render(value, record, rowIndex);
              if (rendered instanceof HTMLElement) {
                html += '<span data-placeholder="render" data-col-index="' + colIndex + '" data-row-index="' + rowIndex + '"></span>';
              } else if (rendered != null) {
                html += typeof rendered === "string" ? rendered : escapeHtml(rendered);
              }
            } else {
              html += value != null ? escapeHtml(value) : "";
            }
          }

          html += "</td>";
        });

        html += "</tr>";
      });
    }

    html += "</tbody></table></div></div>";

    if (showPagination) {
      var pageNumbers = getPageNumbers(self._currentPage, totalPages);
      html += '<div class="st-pagination"><ul class="st-page-list">';
      html += '<li><button class="st-page-btn' + (self._currentPage <= 1 ? " st-page-btn-disabled" : "") + '" data-page="prev">' + chevronLeft + "</button></li>";
      pageNumbers.forEach(function (p, i) {
        if (p === "ellipsis") {
          html += '<li><span class="st-page-ellipsis">...</span></li>';
        } else {
          html += '<li><button class="st-page-btn' + (p === self._currentPage ? " st-page-btn-active" : "") + '" data-page="' + p + '">' + p + "</button></li>";
        }
      });
      html += '<li><button class="st-page-btn' + (self._currentPage >= totalPages ? " st-page-btn-disabled" : "") + '" data-page="next">' + chevronRight + "</button></li>";
      html += "</ul></div>";
    }

    if (addRowBtn) {
      var isDisabled = maxDataLength != null && innerData.length >= maxDataLength;
      html += '<button class="st-add-row-btn' + (isDisabled ? " st-add-row-btn-disabled" : "") + '" data-action="add-row"' + (isDisabled ? " disabled" : "") + ">";
      html += plusCircleSvg;
      html += " " + escapeHtml(addRowBtnText);
      html += "</button>";
    }

    this.innerHTML = html;

    var renderPlaceholders = this.querySelectorAll("[data-placeholder='render']");
    renderPlaceholders.forEach(function (placeholder) {
      var ci = parseInt(placeholder.getAttribute("data-col-index"), 10);
      var ri = parseInt(placeholder.getAttribute("data-row-index"), 10);
      var col = allLeafColumns[ci];
      var record = paginatedData[ri];
      if (col && record && col.render) {
        var value = col.dataIndex ? record[col.dataIndex] : undefined;
        var rendered = col.render(value, record, ri);
        if (rendered instanceof HTMLElement) {
          placeholder.parentNode.replaceChild(rendered, placeholder);
        }
      }
    });

    var editableRenderPlaceholders = this.querySelectorAll(".st-edit-cell-wrap");
    editableRenderPlaceholders.forEach(function (wrap) {
      if (wrap.textContent && wrap.textContent.indexOf("__HTML_ELEMENT__:") === 0) {
        var parts = wrap.textContent.split(":");
        var ci = parseInt(parts[1], 10);
        var ri = parseInt(parts[2], 10);
        var col = allLeafColumns[ci];
        var record = paginatedData[ri];
        if (col && record && col.render) {
          var value = col.dataIndex ? record[col.dataIndex] : undefined;
          var rendered = col.render(value, record, ri);
          if (rendered instanceof HTMLElement) {
            wrap.textContent = "";
            wrap.appendChild(rendered);
          }
        }
      }
    });

    this._bindHoverEvents();

    var inputs = this.querySelectorAll(".st-edit-input");
    if (inputs.length > 0) {
      var lastInput = inputs[inputs.length - 1];
      lastInput.focus();
    }
  };

  STable.prototype._bindDelegatedEvents = function () {
    var self = this;

    this._delegatedClick = function (e) {
      var target = e.target;
      var rowKeyProp = self._getConfig("rowKey", "key");

      var actionEl = target.closest ? target.closest("[data-action]") : null;
      if (actionEl) {
        var action = actionEl.getAttribute("data-action");
        var actionRowKey = actionEl.getAttribute("data-row-key");

        if (action === "add-row") {
          self._addRow();
          return;
        }

        var row = null;
        for (var i = 0; i < self._innerData.length; i++) {
          if (getRowKey(self._innerData[i], rowKeyProp) === actionRowKey) {
            row = self._innerData[i];
            break;
          }
        }
        if (!row) return;

        if (action === "save") { self._saveRow(row); return; }
        if (action === "remove") { self._removeRow(row); return; }
        if (action === "edit") { self._editRow(row); return; }
        if (action === "cancel") { self._cancelRow(row); return; }
      }

      var editWrap = target.closest ? target.closest("[data-editable='true']") : null;
      if (editWrap) {
        var ck = editWrap.getAttribute("data-cell-key");
        var rk = editWrap.getAttribute("data-row-key");
        var di = editWrap.getAttribute("data-data-index");
        var record = null;
        for (var j = 0; j < self._innerData.length; j++) {
          if (getRowKey(self._innerData[j], rowKeyProp) === rk) {
            record = self._innerData[j];
            break;
          }
        }
        if (record && !record.__STATUS) {
          self._startCellEdit(ck, rk, di, record[di]);
        }
        return;
      }

      var pageBtn = target.closest ? target.closest("[data-page]") : null;
      if (pageBtn) {
        var page = pageBtn.getAttribute("data-page");
        var pageSize = self._getConfig("pageSize", 10);
        var tp = Math.max(1, Math.ceil(self._innerData.length / pageSize));
        if (page === "prev") {
          if (self._currentPage > 1) { self._currentPage--; self._scheduleRender(); }
        } else if (page === "next") {
          if (self._currentPage < tp) { self._currentPage++; self._scheduleRender(); }
        } else {
          self._currentPage = parseInt(page, 10);
          self._scheduleRender();
        }
        return;
      }
    };

    this._delegatedInput = function (e) {
      var target = e.target;
      if (target.classList && target.classList.contains("st-edit-input")) {
        var rk = target.getAttribute("data-row-key");
        var di = target.getAttribute("data-data-index");
        if (!self._formValues[rk]) self._formValues[rk] = {};
        self._formValues[rk][di] = target.value;
      }
    };

    this._delegatedKeydown = function (e) {
      if (e.key === "Enter" && e.target.classList && e.target.classList.contains("st-edit-input")) {
        var ck = e.target.getAttribute("data-cell-key");
        self._saveCellEdit(ck);
      }
    };

    this.addEventListener("click", this._delegatedClick);
    this.addEventListener("input", this._delegatedInput);
    this.addEventListener("keydown", this._delegatedKeydown);
  };

  STable.prototype._unbindDelegatedEvents = function () {
    if (this._delegatedClick) this.removeEventListener("click", this._delegatedClick);
    if (this._delegatedInput) this.removeEventListener("input", this._delegatedInput);
    if (this._delegatedKeydown) this.removeEventListener("keydown", this._delegatedKeydown);
  };

  STable.prototype._bindHoverEvents = function () {
    var hover = this._getConfig("hover", true);
    if (!hover) return;
    var rows = this.querySelectorAll("tbody tr.st-row");
    rows.forEach(function (tr) {
      tr.addEventListener("mouseenter", function () {
        var cells = tr.querySelectorAll(".st-td");
        cells.forEach(function (td) { td.classList.add("st-bg-hover"); });
      });
      tr.addEventListener("mouseleave", function () {
        var cells = tr.querySelectorAll(".st-td");
        cells.forEach(function (td) { td.classList.remove("st-bg-hover"); });
      });
    });
  };

  if (typeof customElements !== "undefined" && !customElements.get("s-table")) {
    customElements.define("s-table", STable);
  }
})();
