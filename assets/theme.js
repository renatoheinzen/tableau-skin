// Lê e observa o parâmetro compartilhado de tema do workbook (padrão: "Projedata Tema",
// valores "Claro"/"Escuro"). Extensões de dashboard usam dashboardContent; extensões de
// worksheet usam worksheetContent — este helper tenta as duas.
(function (global) {
  var PARAM_NAME_DEFAULT = 'Projedata Tema';
  var DARK_VALUES = ['escuro', 'dark'];

  function isDarkValue(value) {
    if (value == null) return false;
    return DARK_VALUES.indexOf(String(value).trim().toLowerCase()) !== -1;
  }

  function getParametersAsync() {
    if (typeof tableau === 'undefined' || !tableau.extensions) return Promise.resolve([]);
    if (tableau.extensions.dashboardContent && tableau.extensions.dashboardContent.dashboard) {
      return tableau.extensions.dashboardContent.dashboard.getParametersAsync();
    }
    if (tableau.extensions.worksheetContent && tableau.extensions.worksheetContent.worksheet) {
      return tableau.extensions.worksheetContent.worksheet.getParametersAsync();
    }
    return Promise.resolve([]);
  }

  // onChange('claro'|'escuro') só é chamado se o parâmetro existir no workbook — se não
  // existir, quem chamou decide o tema padrão (nada é invocado).
  function watchTheme(onChange, paramName) {
    var name = paramName || PARAM_NAME_DEFAULT;
    getParametersAsync().then(function (params) {
      var param = (params || []).find(function (p) { return p.name === name; });
      if (!param) return;
      function apply() { onChange(isDarkValue(param.currentValue.value) ? 'escuro' : 'claro'); }
      apply();
      param.addEventListener(tableau.TableauEventType.ParameterChanged, apply);
    }).catch(function (err) {
      console.warn('[Projedata Theme] não foi possível ler parâmetros do workbook:', err);
    });
  }

  global.ProjedataTheme = { watchTheme: watchTheme, isDarkValue: isDarkValue, PARAM_NAME_DEFAULT: PARAM_NAME_DEFAULT };
})(window);
