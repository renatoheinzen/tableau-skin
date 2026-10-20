/* Seletor de tema (claro/escuro) das extensões Projedata.
   Lê o parâmetro "Tema" do workbook e troca <html data-theme="alt"> (tema alternativo do tokens.css).
   Sem parâmetro (ou fora do Tableau) o tema base continua valendo. Também aceita ?tema=<valor> na URL da página. */
(function () {
  var PARAM = 'Tema';
  var VALUES = {"iniflex pro escuro":"base","pro":"base","escuro":"base","dark":"base","iniflex smart claro":"alt","smart":"alt","claro":"alt","light":"alt"}; // valor normalizado do parâmetro → 'base' | 'alt'
  var listeners = [];
  var mode = 'base';

  function norm(v) {
    return String(v == null ? '' : v).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  }
  function modeFor(v) { return VALUES[norm(v)] || 'base'; }

  function apply(next) {
    if (next === mode && document.documentElement.getAttribute('data-theme') !== null) return;
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
      // rede de segurança: nem toda versão dispara ParameterChanged para extensões de planilha
      setInterval(function () {
        read(src).then(function (p) {
          if (p) apply(modeFor(p.currentValue && (p.currentValue.value != null ? p.currentValue.value : p.currentValue.formattedValue)));
        }).catch(function () {});
      }, 3000);
    },
    onChange: function (fn) { listeners.push(fn); },
    mode: function () { return mode; },
    set: function (v) { apply(modeFor(v)); }
  };

  var m = /[?&]tema=([^&]+)/.exec(location.search);
  if (m) apply(modeFor(decodeURIComponent(m[1])));
})();
