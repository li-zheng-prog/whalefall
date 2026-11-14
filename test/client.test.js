import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8');

function eventTarget(target = {}) {
  const listeners = new Map();
  target.addEventListener = (type, fn) => {
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type).add(fn);
  };
  target.removeEventListener = (type, fn) => listeners.get(type)?.delete(fn);
  target.emit = (type, event = {}) => {
    for (const fn of [...(listeners.get(type) || [])]) fn(event);
  };
  target.listenerCount = type => listeners.get(type)?.size || 0;
  return target;
}

// Model declaration ownership, including shorthand removal of background longhands.
function inlineStyle() {
  const values = new Map();
  return {
    get length() { return values.size; },
    item: i => [...values.keys()][i],
    getPropertyValue: name => values.get(name)?.value || '',
    getPropertyPriority: name => values.get(name)?.priority || '',
    removeProperty(name) {
      for (const key of [...values.keys()]) {
        if (key === name || (name === 'background' && key.startsWith('background-'))) values.delete(key);
      }
    },
    setProperty(name, value, priority = '') {
      if (!value) return this.removeProperty(name);
      if (name === 'background') this.removeProperty(name);
      values.set(name, { value, priority });
    },
  };
}

function canvas2d() {
  let alpha = 1;
  const draws = [], alphaWrites = [];
  const ctx = {
    draws, alphaWrites, paints: 0,
    get globalAlpha() { return alpha; },
    set globalAlpha(value) {
      alphaWrites.push(value);
      if (Number.isFinite(value) && value >= 0 && value <= 1) alpha = value;
    },
    createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }),
    getImageData: (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4).fill(255) }),
    putImageData() { this.paints++; }, drawImage() { this.paints++; }, clearRect() {}, setTransform() {},
    beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, arc() {},
    save() {}, restore() {}, translate() {}, scale() {},
    fill() { record(); }, fillRect() { record(); },
  };
  function record() {
    const match = /^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)$/.exec(ctx.fillStyle);
    draws.push({ effectiveAlpha: (match ? Number(match[1]) : 1) * alpha });
  }
  return ctx;
}

function environment({ reduced = false, dark = false, coarse = false, search = '', bodyReady = true,
  viewport = [90, 90], dpr = 1, userAgent = 'test', webglAvailable = true } = {}) {
  const observers = [], intervals = new Map(), frames = new Map(), timeouts = new Map();
  const media = new Map(), glContexts = [], elements = [];
  let nextId = 0, now = 100, plugin;
  function webgl(options) {
    const gl = {
      lost: false, uniforms: {}, options, draws: [], textures: [], framebuffer: null,
      isContextLost: () => gl.lost,
      bindFramebuffer(target, framebuffer) { gl.framebuffer = framebuffer; },
      drawArrays() { gl.draws.push({ now, framebuffer: gl.framebuffer }); },
      texImage2D(target, level, format, width, height) { gl.textures.push({ width, height }); },
      getExtension: () => ({ loseContext() { gl.lost = true; } }),
      getShaderParameter: () => true, getProgramParameter: () => true,
      getAttribLocation: () => 0, getUniformLocation: (program, name) => name,
      uniform1f(name, value) { gl.uniforms[name] = value; },
    };
    glContexts.push(gl);
    return new Proxy(gl, {
      get(target, key) {
        if (key in target) return target[key];
        if (/^[A-Z0-9_]+$/.test(key)) return key;
        if (key.startsWith('create')) return () => ({});
        return () => {};
      },
    });
  }
  function element(tag) {
    const attrs = new Map(), contexts = new Map(), classes = new Set();
    const el = eventTarget({
      tag, style: inlineStyle(), dataset: {}, children: [], parentNode: null,
      clientWidth: viewport[0], clientHeight: viewport[1], width: 90, height: 90,
      classList: { toggle: (name, on) => on ? classes.add(name) : classes.delete(name), contains: name => classes.has(name) },
      hasAttribute: name => attrs.has(name),
      setAttribute(name, value) {
        attrs.set(name, value);
        if (name.startsWith('data-')) el.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
        notify(name);
      },
      removeAttribute(name) {
        attrs.delete(name);
        if (name.startsWith('data-')) delete el.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())];
        notify(name);
      },
      appendChild(child) { this.children.push(child); child.parentNode = this; return child; },
      removeChild(child) { this.children = this.children.filter(x => x !== child); child.parentNode = null; },
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 90, height: 90, bottom: 90 }),
      getContext(type, options) {
        if (type === 'webgl2' && !webglAvailable) return null;
        if (!contexts.has(type)) contexts.set(type, type === '2d' ? canvas2d() : webgl(options));
        return contexts.get(type);
      },
    });
    function notify(name) {
      for (const observer of observers) {
        if (observer.watches.some(([target, opts]) => target === el && opts.attributeFilter.includes(name))) observer.callback();
      }
    }
    elements.push(el);
    return el;
  }
  const html = element('html'), head = element('head'), body = element('body');
  html.appendChild(head);
  if (bodyReady) html.appendChild(body);
  if (dark) body.setAttribute('data-ds-dark-theme', '');
  const document = eventTarget({
    head, body: bodyReady ? body : null, documentElement: html, hidden: false,
    createElement: element, querySelector: () => null,
    getElementById(id) {
      function find(node) {
        if (node.id === id) return node;
        for (const child of node.children) { const match = find(child); if (match) return match; }
        return null;
      }
      return find(html);
    },
  });
  class MutationObserver {
    constructor(callback) { this.callback = callback; this.watches = []; observers.push(this); }
    observe(target, options) { this.watches.push([target, options]); }
    disconnect() { this.watches = []; }
  }
  const window = eventTarget({
    devicePixelRatio: dpr, innerWidth: viewport[0], innerHeight: viewport[1], MutationObserver,
    matchMedia(query) {
      if (!media.has(query)) media.set(query, eventTarget({ matches: query.includes('reduced-motion') ? reduced : query.includes('coarse') ? coarse : false }));
      return media.get(query);
    },
    __ModuleLoader__: { load(module) { plugin = module.factory(() => {}); } },
  });
  const context = {
    window, document, MutationObserver, URLSearchParams, navigator: { userAgent },
    location: { search }, performance: { now: () => now }, Path2D: class {}, console,
    setInterval(fn, ms) { intervals.set(++nextId, { fn, ms }); return nextId; },
    clearInterval: id => intervals.delete(id),
    setTimeout(fn) { timeouts.set(++nextId, fn); return nextId; }, clearTimeout: id => timeouts.delete(id),
    requestAnimationFrame(fn) { frames.set(++nextId, fn); return nextId; }, cancelAnimationFrame: id => frames.delete(id),
  };
  vm.runInNewContext(source, context);
  return {
    plugin, window, document, html, body, media, observers, intervals, frames, timeouts, glContexts, elements,
    flushStartup() {
      for (let i = 0; i < 21; i++) for (const timer of [...intervals.values()]) if (timer.ms === 250) timer.fn();
    },
    setMotion(value) {
      const query = media.get('(prefers-reduced-motion: reduce)');
      query.matches = value; query.emit('change', { matches: value });
    },
    frame(delta = 50) {
      now += delta;
      for (const [id, fn] of [...frames]) { frames.delete(id); fn(now); }
    },
  };
}

test('inverse preserves column-major matrix and point round trips', () => {
  const ctx = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf('  function m4Identity()'), source.indexOf('  function startWhale()')), ctx);
  const matrices = [ctx.m4Identity(), ctx.m4Translation(2, 3, 4), ctx.m4RotationX(.4), ctx.m4RotationY(-.7), ctx.m4RotationZ(.9), ctx.m4Scale(.75)];
  matrices.push(matrices.reduce((a, b) => ctx.m4Mul(a, b)), ctx.m4Perspective(.9, 1.7, .1, 100));
  for (const matrix of matrices) {
    const inverse = ctx.m4Inverse(matrix);
    for (const product of [ctx.m4Mul(matrix, inverse), ctx.m4Mul(inverse, matrix)]) {
      for (let i = 0; i < 16; i++) assert.ok(Math.abs(product[i] - (i % 5 === 0 ? 1 : 0)) < 1e-5);
    }
  }
  assert.deepEqual(Array.from(ctx.m4Inverse(ctx.m4Translation(2, 3, 4))).slice(12, 15), [-2, -3, -4]);
});

test('dispose restores background declarations and priorities without touching other styles', () => {
  const e = environment();
  e.body.style.setProperty('background-color', 'red', 'important');
  e.body.style.setProperty('background-image', 'linear-gradient(red, blue)');
  e.html.style.setProperty('background', 'blue');
  e.plugin.apply();
  e.body.style.setProperty('color', 'green');
  const handle = e.window.__dshDeepSeekBgHandle;
  handle.dispose(); handle.dispose();
  assert.equal(e.body.style.getPropertyValue('background-color'), 'red');
  assert.equal(e.body.style.getPropertyPriority('background-color'), 'important');
  assert.equal(e.body.style.getPropertyValue('background-image'), 'linear-gradient(red, blue)');
  assert.equal(e.html.style.getPropertyValue('background'), 'blue');
  assert.equal(e.html.style.getPropertyPriority('background'), '');
  assert.equal(e.body.style.getPropertyValue('color'), 'green');
  assert.equal(e.document.getElementById('dsh-ds-bg'), null);
  assert.equal(e.intervals.size + e.frames.size + e.timeouts.size, 0);
  assert.ok(e.glContexts.every(gl => gl.lost));
});

test('dispose removes originally absent backgrounds and preserves later external changes', () => {
  const e = environment(); e.plugin.apply();
  e.body.style.setProperty('background', 'green', 'important');
  e.window.__dshDeepSeekBgHandle.dispose();
  assert.equal(e.body.style.getPropertyValue('background'), 'green');
  assert.equal(e.html.style.length, 0);
});

test('theme attributes remain live after startup polling has finished', () => {
  const e = environment(); e.plugin.apply(); e.flushStartup();
  const dark = () => e.document.getElementById('dsh-ds-bg').classList.contains('dsh-ds-dark');
  assert.ok(![...e.intervals.values()].some(timer => timer.ms === 250));
  e.html.setAttribute('data-theme', 'dark'); assert.equal(dark(), true);
  e.html.setAttribute('data-theme', 'light'); assert.equal(dark(), false);
  e.html.removeAttribute('data-theme');
  const system = e.media.get('(prefers-color-scheme: dark)');
  system.matches = true; system.emit('change'); assert.equal(dark(), true);
  e.html.setAttribute('data-ds-theme-source', 'explicit'); assert.equal(dark(), false);
  e.html.removeAttribute('data-ds-theme-source'); assert.equal(dark(), true);
  e.body.setAttribute('data-ds-light-theme', ''); assert.equal(dark(), false);
});

test('motion preference rebuilds all engines without duplicate handlers or leaked contexts', () => {
  const e = environment(); e.body.style.setProperty('background', 'red'); e.plugin.apply();
  const oldHandle = e.window.__dshDeepSeekBgHandle;
  const normalListeners = e.window.listenerCount('mousemove');
  assert.ok(normalListeners > 0 && e.frames.size > 0);
  for (let i = 0; i < 3; i++) {
    const previousContexts = [...e.glContexts];
    e.setMotion(true);
    assert.equal(e.frames.size, 0);
    assert.equal(e.window.listenerCount('mousemove'), 0);
    assert.equal(e.document.listenerCount('click'), 0);
    assert.ok(previousContexts.every(gl => gl.lost));
    e.setMotion(false);
    assert.ok(e.frames.size > 0);
    assert.equal(e.window.listenerCount('mousemove'), normalListeners);
    assert.equal(e.document.listenerCount('click'), 1);
    assert.equal(e.media.get('(prefers-reduced-motion: reduce)').listenerCount('change'), 1);
    assert.equal(e.observers.filter(observer => observer.watches.length).length, 1);
    assert.equal(e.body.children.filter(el => el.id === 'dsh-ds-bg').length, 1);
    assert.equal(e.glContexts.filter(gl => !gl.lost).length, 2);
  }
  const currentHandle = e.window.__dshDeepSeekBgHandle;
  oldHandle.dispose();
  assert.equal(e.window.__dshDeepSeekBgHandle, currentHandle);
  assert.equal(e.window.__dshDeepSeekBg, true);
  currentHandle.dispose();
  assert.equal(e.body.style.getPropertyValue('background'), 'red');
  assert.equal(e.intervals.size + e.frames.size + e.timeouts.size, 0);
});

test('motion changes before DOM readiness cancel the old boot and initialize only once', () => {
  const e = environment({ bodyReady: false }); e.plugin.apply(); e.setMotion(true);
  assert.equal(e.document.listenerCount('DOMContentLoaded'), 1);
  e.document.body = e.body; e.html.appendChild(e.body); e.document.emit('DOMContentLoaded');
  assert.equal(e.body.children.filter(el => el.id === 'dsh-ds-bg').length, 1);
  assert.equal(e.frames.size, 0);
  e.window.__dshDeepSeekBgHandle.dispose();
  assert.equal(e.body.style.length + e.html.style.length, 0);
});

test('coarse pointer constellation starts and stops when motion preference changes', () => {
  const e = environment({ coarse: true }); e.plugin.apply();
  const grid = () => e.document.getElementById('dsh-ds-constellation').getContext('2d');
  assert.equal(grid().draws.length, 0);
  e.setMotion(true); assert.ok(grid().draws.length > 0); assert.equal(e.frames.size, 0);
  e.setMotion(false); assert.equal(grid().draws.length, 0);
});

test('constellation applies opacity once and keeps hover alpha in range in both themes', () => {
  const start = source.indexOf('    function draw(mx, my, active)');
  const end = source.indexOf('    function wake()', start);
  for (const dark of [false, true]) {
    const ctx = canvas2d(), opacity = dark ? .16 : .24;
    const sandbox = vm.createContext({ ctx, state: { dark }, canvas: { clientWidth: 90, clientHeight: 90 }, rows: 1, cols: 1, dots: [{ x: 0, y: 0 }],
      currentConstellation: () => ({ lineColor: 'rgba(1, 1, 1,', dotColor: 'rgba(1, 1, 1,', lineOpacity: .1, dotOpacity: opacity, round: !dark }) });
    vm.runInContext(source.slice(start, end), sandbox);
    sandbox.draw(NaN, NaN, false);
    assert.equal(ctx.draws.at(-1).effectiveAlpha, opacity);
    sandbox.draw(0, 0, true);
    assert.ok(Math.abs(ctx.draws.at(-1).effectiveAlpha - (opacity + .4)) < 1e-9);
    assert.ok(ctx.alphaWrites.every(alpha => alpha >= 0 && alpha <= 1));
    assert.equal(ctx.globalAlpha, 1);
  }
});

test('nowhale uses decoded parameter names and presence semantics', () => {
  for (const [search, disabled] of [['', false], ['?q=nowhale', false], ['?notnowhale', false], ['?nowhale', true], ['?nowhale=0', true], ['?nowhale=false', true], ['?%6Eowhale', true], ['?%256Eowhale', false]]) {
    const e = environment({ search }); e.plugin.apply();
    const whale = e.elements.find(el => el.className === 'dsh-ds-whale-canvas');
    assert.equal(whale.dataset.state === 'shader-ok', !disabled, search);
    assert.equal(e.document.listenerCount('click'), disabled ? 0 : 1, search);
    e.window.__dshDeepSeekBgHandle.dispose();
  }
});

test('both WebGL engines request the high-performance adapter without MSAA or depth buffers', () => {
  const e = environment({ dark: true }); e.plugin.apply();
  assert.equal(e.glContexts.length, 2);
  for (const gl of e.glContexts) {
    assert.equal(gl.options.powerPreference, 'high-performance');
    assert.equal(gl.options.antialias, false);
    assert.equal(gl.options.depth, false);
    assert.equal(gl.options.stencil, false);
  }
});

test('4K high-DPI layers stay within pixel budgets through resize and theme changes', () => {
  const e = environment({ viewport: [3840, 2160], dpr: 2, dark: true, userAgent: 'Windows' });
  e.plugin.apply();
  const aurora = e.document.getElementById('dsh-ds-aurora');
  const light = e.document.getElementById('dsh-ds-aurora2d');
  const grid = e.document.getElementById('dsh-ds-constellation');
  const whale = e.elements.find(el => el.className === 'dsh-ds-whale-canvas');
  assert.equal(aurora.width * aurora.height, 960 * 540);
  for (const layer of [grid, whale]) assert.ok(layer.width * layer.height <= 1280 * 720);
  const gl = aurora.getContext('webgl2'), allocations = gl.textures.length;
  for (let i = 0; i < 10; i++) e.frame();
  assert.equal(gl.textures.length, allocations, 'stable size must not reallocate flow textures each frame');
  e.body.removeAttribute('data-ds-dark-theme');
  assert.ok(light.width * light.height <= 1280 * 720);
  for (const layer of [aurora, light, grid, whale]) { layer.clientWidth = 2160; layer.clientHeight = 3840; }
  e.window.emit('resize');
  for (const [id, fn] of [...e.timeouts]) { e.timeouts.delete(id); fn(); }
  e.body.setAttribute('data-ds-dark-theme', '');
  for (const layer of [aurora, light, grid, whale]) {
    assert.ok(layer.width * layer.height <= (layer === aurora ? 960 * 540 : 1280 * 720));
    assert.ok(Math.abs(layer.width / layer.height - 2160 / 3840) < .002);
  }
});

test('render size remains bounded for zero-sized and extreme aspect ratio windows', () => {
  for (const viewport of [[0, 0], [100000, 1], [1, 100000]]) {
    const e = environment({ viewport, dark: true, search: '?nowhale', coarse: true });
    e.plugin.apply();
    const canvas = e.document.getElementById('dsh-ds-aurora');
    assert.ok(canvas.width >= 1 && canvas.height >= 1);
    assert.ok(canvas.width <= 4096 && canvas.height <= 4096);
    assert.ok(canvas.width * canvas.height <= 960 * 540);
    const gl = canvas.getContext('webgl2'), allocations = gl.textures.length;
    e.frame(); e.frame();
    assert.equal(gl.textures.length, allocations);
  }
});

test('Windows aurora skips the disabled mouse-flow pass but other platforms retain it', () => {
  for (const userAgent of ['Windows', 'test']) {
    const e = environment({ dark: true, userAgent }); e.plugin.apply();
    const gl = e.document.getElementById('dsh-ds-aurora').getContext('webgl2');
    assert.equal(gl.draws.filter(draw => draw.framebuffer !== null).length, userAgent === 'Windows' ? 0 : 1);
    assert.equal(gl.draws.filter(draw => draw.framebuffer === null).length, 1);
    if (userAgent === 'Windows') {
      assert.equal(gl.textures.length, 1);
      assert.deepEqual(gl.textures[0], { width: 1, height: 1 });
    }
    const before = gl.draws.length;
    e.frame();
    assert.equal(gl.draws.length - before, userAgent === 'Windows' ? 1 : 2);
  }
});

test('144 Hz display does not increase aurora or light-field frame budgets', () => {
  const e = environment({ dark: true, userAgent: 'Windows' }); e.plugin.apply();
  const gl = e.document.getElementById('dsh-ds-aurora').getContext('webgl2');
  for (let i = 0; i < 144; i++) e.frame(1000 / 144);
  assert.ok(gl.draws.length >= 23 && gl.draws.length <= 25, `aurora draws: ${gl.draws.length}`);
  e.body.removeAttribute('data-ds-dark-theme');
  const light = e.document.getElementById('dsh-ds-aurora2d').getContext('2d');
  const before = light.paints, darkBefore = gl.draws.length;
  for (let i = 0; i < 144; i++) e.frame(1000 / 144);
  assert.ok(light.paints - before >= 19 && light.paints - before <= 20);
  assert.equal(gl.draws.length, darkBefore, 'inactive dark engine must not draw');
});

test('hidden documents stop drawing and resume without duplicate loops', () => {
  const e = environment({ dark: true }); e.plugin.apply();
  e.document.hidden = true; e.document.emit('visibilitychange');
  const counts = e.glContexts.map(gl => gl.draws.length);
  for (let i = 0; i < 10; i++) e.frame();
  assert.deepEqual(e.glContexts.map(gl => gl.draws.length), counts);
  assert.equal(e.frames.size, 0);
  e.document.hidden = false; e.document.emit('visibilitychange');
  assert.ok(e.frames.size > 0 && e.frames.size <= 3);
  e.frame();
  assert.ok(e.glContexts[0].draws.length > counts[0]);
});

test('lost WebGL contexts stop drawing and rebuild cleanly after GPU restoration', () => {
  const e = environment({ dark: true }); e.plugin.apply();
  const canvas = e.document.getElementById('dsh-ds-aurora'), gl = canvas.getContext('webgl2');
  gl.lost = true;
  let prevented = false;
  canvas.emit('webglcontextlost', { preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  const count = gl.draws.length, oldHandle = e.window.__dshDeepSeekBgHandle;
  e.frame(); e.frame(); assert.equal(gl.draws.length, count);
  gl.lost = false; canvas.emit('webglcontextrestored');
  assert.notEqual(e.window.__dshDeepSeekBgHandle, oldHandle);
  assert.equal(e.glContexts.filter(ctx => !ctx.lost).length, 2);
  assert.equal(e.body.children.filter(el => el.id === 'dsh-ds-bg').length, 1);
  assert.equal(canvas.listenerCount('webglcontextrestored'), 0);
  assert.equal(e.observers.filter(observer => observer.watches.length).length, 1);
  e.window.__dshDeepSeekBgHandle.dispose();
  assert.equal(e.frames.size + e.intervals.size, 0);
});

test('missing WebGL still leaves the light background and cleanup working', () => {
  const e = environment({ webglAvailable: false }); e.plugin.apply();
  assert.ok(e.document.getElementById('dsh-ds-aurora2d').getContext('2d').paints > 0);
  assert.equal(e.elements.find(el => el.className === 'dsh-ds-whale-canvas').dataset.state, 'no-webgl2');
  e.setMotion(true); assert.equal(e.frames.size, 0);
  e.window.__dshDeepSeekBgHandle.dispose();
  assert.equal(e.frames.size + e.intervals.size, 0);
});
