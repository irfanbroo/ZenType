// ══════════════════════════════════════════════════════════
// SPLASH SCREEN — ZenType landing with smoke WebGL
// ══════════════════════════════════════════════════════════

const SMOKE_VERT = `#version 300 es
precision highp float;
in vec4 position;
void main(){ gl_Position = position; }`;

const SMOKE_FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_color;

#define FC gl_FragCoord.xy
#define R resolution
#define T (time + 660.)

float rnd(vec2 p){ p=fract(p*vec2(12.9898,78.233)); p+=dot(p,p+34.56); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f); return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y); }
float fbm(vec2 p){ float t=.0,a=1.; for(int i=0;i<5;i++){ t+=a*noise(p); p*=mat2(1.,-1.2,.2,1.2)*2.; a*=.5; } return t; }

void main(){
  vec2 uv = (FC - .5*R) / R.y;
  vec3 col = vec3(1);
  uv.x += .25;
  uv *= vec2(2., 1.);

  float n = fbm(uv * .28 - vec2(T*.01, 0.));
  n = noise(uv*3. + n*2.);

  col.r -= fbm(uv + vec2(0., T*.015) + n);
  col.g -= fbm(uv*1.003 + vec2(0., T*.015) + n + .003);
  col.b -= fbm(uv*1.006 + vec2(0., T*.015) + n + .006);

  col = mix(col, u_color, dot(col, vec3(.21,.71,.07)));
  col = mix(vec3(.08), col, min(time * 0.8 + 0.72, 1.));
  col = clamp(col, .08, 1.);
  O = vec4(col, 1);
}`;

const VERTS = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
// Warm golden smoke color matching ZenType theme
const SMOKE_COLOR = new Float32Array([1.0, 0.72, 0.08]);

let splashGL   = null;
let splashRaf  = null;

function initSplashGL(canvas) {
    const gl = canvas.getContext('webgl2');
    if (!gl) return null;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, SMOKE_VERT); gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, SMOKE_FRAG); gl.compileShader(fs);

    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, VERTS, gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    prog._res   = gl.getUniformLocation(prog, 'resolution');
    prog._time  = gl.getUniformLocation(prog, 'time');
    prog._color = gl.getUniformLocation(prog, 'u_color');

    const dpr = Math.max(1, window.devicePixelRatio);
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);

    return { gl, prog };
}

function renderSplash(now) {
    if (!splashGL) return;
    const { gl, prog } = splashGL;
    gl.clearColor(0.05, 0.03, 0.01, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);
    gl.uniform2f(prog._res,  gl.canvas.width, gl.canvas.height);
    gl.uniform1f(prog._time, now * 1e-3);
    gl.uniform3fv(prog._color, SMOKE_COLOR);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    splashRaf = requestAnimationFrame(renderSplash);
}

function destroySplash() {
    if (splashRaf) { cancelAnimationFrame(splashRaf); splashRaf = null; }
    if (splashGL)  { splashGL.gl.deleteProgram(splashGL.prog); splashGL = null; }
}

function hideSplash() {
    const overlay = document.getElementById('splash-overlay');
    if (!overlay) return;
    overlay.classList.add('splash-exit');
    setTimeout(() => {
        overlay.style.display = 'none';
        destroySplash();
    }, 700);
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('splash-canvas');
    if (canvas) {
        splashGL = initSplashGL(canvas);
        if (splashGL) splashRaf = requestAnimationFrame(renderSplash);

        window.addEventListener('resize', () => {
            if (!splashGL) return;
            const dpr = Math.max(1, window.devicePixelRatio);
            canvas.width  = window.innerWidth  * dpr;
            canvas.height = window.innerHeight * dpr;
            splashGL.gl.viewport(0, 0, canvas.width, canvas.height);
        });
    }

    // Start Typing → just close splash
    document.getElementById('splash-classic-btn')?.addEventListener('click', hideSplash);

    // Rhythm Mode → open Star Road
    document.getElementById('splash-music-btn')?.addEventListener('click', () => {
        hideSplash();
        window.startStarRoad?.();
    });
});
