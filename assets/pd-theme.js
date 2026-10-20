/* Seletor de tema (claro/escuro) das extensões Projedata.
   Lê o parâmetro "Tema" do workbook e troca <html data-theme="alt"> (tema alternativo do tokens.css).
   Sem parâmetro (ou fora do Tableau) o tema base continua valendo. Também aceita ?tema=<valor> na URL da página. */
(function () {
  var PARAM = 'Tema';
  var VALUES = {"iniflex pro":"base","pro":"base","escuro":"base","dark":"base","iniflex pro claro":"alt","pro claro":"alt","claro":"alt","light":"alt"}; // valor normalizado do parâmetro → 'base' | 'alt'
  var LABELS = {"base":"Escuro","alt":"Claro"}; // valor gravado no parâmetro quando ele aceita qualquer texto
  var DARK = {"base":true,"alt":false};     // o tema é escuro? (decide o ícone do botão de trocar tema)
  var listeners = [];
  var mode = 'base';

  function norm(v) {
    return String(v == null ? '' : v).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  }
  function modeFor(v) { return VALUES[norm(v)] || 'base'; }

  function apply(next) {
    if (next === mode) return;
    mode = next;
    if (mode === 'alt') document.documentElement.setAttribute('data-theme', 'alt');
    else document.documentElement.removeAttribute('data-theme');
    listeners.forEach(function (fn) { try { fn(mode); } catch (e) { console.error('[pd-theme]', e); } });
  }

  function source() {
    var ext = window.tableau && tableau.extensions;
    if (!ext) return null;
    if (ext.dashboardContent && ext.dashboardContent.dashboard) return ext.dashboardContent.dashboard;
    if (ext.worksheetContent && ext.worksheetContent.worksheet) return ext.worksheetContent.worksheet;
    return null;
  }

  function findParam(params) {
    var want = norm(PARAM);
    for (var i = 0; i < params.length; i++) if (norm(params[i].name) === want) return params[i];
    return null;
  }

  function read(src) {
    return src.getParametersAsync().then(function (params) {
      var p = findParam(params);
      if (!p) return null;
      return p;
    });
  }

  // valor a gravar no parâmetro para chegar em `target`: usa a lista de valores permitidos quando ele tem uma
  function valueFor(p, target) {
    var av = p && p.allowableValues;
    if (av && av.type === 'list') {
      for (var i = 0; i < av.allowableValues.length; i++) {
        var v = av.allowableValues[i];
        var raw = v.value != null ? v.value : v.formattedValue;
        if (modeFor(raw) === target) return raw;
      }
    }
    return LABELS[target];
  }

  window.PDTheme = {
    /* chamar depois do tableau.extensions.initializeAsync() */
    start: function () {
      var src = source();
      if (!src || !src.getParametersAsync) return;
      var bound = null;
      function bind(p) {
        apply(modeFor(p.currentValue && (p.currentValue.value != null ? p.currentValue.value : p.currentValue.formattedValue)));
        if (bound !== p.name && p.addEventListener) {
          bound = p.name;
          p.addEventListener(tableau.TableauEventType.ParameterChanged, function (e) {
            e.getParameterAsync().then(function (np) {
              apply(modeFor(np.currentValue && (np.currentValue.value != null ? np.currentValue.value : np.currentValue.formattedValue)));
            });
          });
        }
      }
      read(src).then(function (p) { if (p) bind(p); }).catch(function (e) {
        console.warn('[pd-theme] não consegui ler o parâmetro "' + PARAM + '":', e);
      });
    },
    /* troca o tema (botão das extensões de navegação): grava o outro valor no parâmetro, e as demais extensões seguem */
    toggle: function () {
      var target = mode === 'alt' ? 'base' : 'alt';
      var src = source();
      if (!src || !src.getParametersAsync) { apply(target); return Promise.resolve(); }
      return read(src).then(function (p) {
        if (!p) { console.warn('[pd-theme] parâmetro "' + PARAM + '" não existe: o tema só muda nesta extensão'); apply(target); return; }
        return p.changeValueAsync(valueFor(p, target)).then(function () { apply(target); });
      }).catch(function (e) { console.warn('[pd-theme] não consegui trocar o tema:', e); });
    },
    isDark: function (m) { return !!DARK[m]; },
    label: function (m) { return LABELS[m]; },
    _apply: apply,
    onChange: function (fn) { listeners.push(fn); },
    mode: function () { return mode; },
    set: function (v) { apply(modeFor(v)); }
  };

  var m = /[?&]tema=([^&]+)/.exec(location.search);
  if (m) apply(modeFor(decodeURIComponent(m[1])));
})();
