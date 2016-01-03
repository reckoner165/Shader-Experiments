#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) - 
          smoothstep( pct, pct+0.02, st.y);
}

float quadraticBezier (float x, float a, float b){
  // adapted from BEZMATH.PS (1993)
  // by Don Lancaster, SYNERGETICS Inc. 
  // http://www.tinaja.com/text/bezmath.html

  float epsilon = 0.00001;
  a = max(0.0, min(1.0, a)); 
  b = max(0.0, min(1.0, b)); 
  if (a == 0.5){
    a += epsilon;
  }
  
  // solve t from x (an inverse operation)
  float om2a = 1.0 - 2.0*a;
  float t = (sqrt(a*a + om2a*x) - a)/om2a;
  float y = (1.0-2.0*b)*(t*t) + (2.0*b)*t;
  return y;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	//float t = u_time*st.x;

    //float y = smoothstep(0.2,0.5,st.x) - smoothstep(0.5,0.8,st.x);
    float a = u_mouse.y/u_resolution.y;
    float b = u_mouse.x/u_resolution.x;

    float y = quadraticBezier(st.x,a,b);

    vec3 color = vec3(y-0.5);
    
    // Plot a line
    float pct = plot(st,y);
    float pct2 = plot((1.0-st),y);
  
    color = (0.5-pct)*color+pct*vec3(1.0,0.7,0.0);
    color = (0.5-pct2)*color+pct2*vec3(1.0,0.0,0.7);
    
    
	gl_FragColor = vec4(color,1.0);
}