// Pulsing core vertex shader
export const coreVertexShader = `
  uniform float time;
  uniform float pulseRate;
  uniform float baseRadius;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    
    // Pulsing effect based on time and pulse rate
    float pulse = sin(time * pulseRate) * 0.15 + 0.85;
    vec3 newPosition = position * pulse;
    
    vPosition = newPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// Pulsing core fragment shader
export const coreFragmentShader = `
  uniform vec3 coreColor;
  uniform float opacity;
  uniform float time;
  uniform float pulseRate;
  uniform bool isStarved;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    // Fresnel effect for glow
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 3.0);
    
    // Pulsing opacity
    float pulseOpacity = sin(time * pulseRate) * 0.3 + 0.7;
    
    // Starved cores flicker
    float flicker = 1.0;
    if (isStarved) {
      flicker = sin(time * pulseRate * 2.0) * 0.4 + 0.6;
    }
    
    // Combine effects
    vec3 finalColor = coreColor * (1.0 + fresnel * 2.0);
    float finalOpacity = opacity * pulseOpacity * flicker;
    
    gl_FragColor = vec4(finalColor, finalOpacity);
  }
`;

// Infrastructure stream vertex shader
export const streamVertexShader = `
  attribute float flowProgress;
  uniform float time;
  uniform float flowSpeed;
  varying float vFlowProgress;
  varying vec3 vPosition;
  
  void main() {
    vFlowProgress = mod(flowProgress + time * flowSpeed, 1.0);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Infrastructure stream fragment shader
export const streamFragmentShader = `
  uniform vec3 streamColor;
  uniform float opacity;
  uniform float brightness;
  varying float vFlowProgress;
  varying vec3 vPosition;
  
  void main() {
    // Flowing gradient effect
    float gradient = smoothstep(0.0, 0.2, vFlowProgress) * smoothstep(1.0, 0.8, vFlowProgress);
    
    // Brightness boost for flowing section
    vec3 finalColor = streamColor * (1.0 + gradient * brightness);
    float finalOpacity = opacity * (0.3 + gradient * 0.7);
    
    gl_FragColor = vec4(finalColor, finalOpacity);
  }
`;

// Resource well vertex shader
export const wellVertexShader = `
  uniform float time;
  uniform float pulseSpeed;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Resource well fragment shader
export const wellFragmentShader = `
  uniform vec3 wellColor;
  uniform float time;
  uniform float pulseSpeed;
  uniform float radius;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    // Radial gradient from center
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    
    // Pulsing rings
    float rings = sin(dist * 20.0 - time * pulseSpeed) * 0.5 + 0.5;
    
    // Fade at edges
    float alpha = smoothstep(radius, 0.0, dist) * rings;
    
    // Energy glow
    vec3 finalColor = wellColor * (1.0 + rings);
    
    gl_FragColor = vec4(finalColor, alpha * 0.8);
  }
`;

// Connection thread vertex shader
export const threadVertexShader = `
  uniform float time;
  attribute float pathProgress;
  varying float vPathProgress;
  
  void main() {
    vPathProgress = pathProgress;
    
    // Slight wavering motion
    vec3 offset = vec3(
      sin(time * 2.0 + pathProgress * 10.0) * 0.0001,
      cos(time * 2.0 + pathProgress * 10.0) * 0.0001,
      0.0
    );
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + offset, 1.0);
  }
`;

// Connection thread fragment shader
export const threadFragmentShader = `
  uniform vec3 threadColor;
  uniform float time;
  uniform float flickerSpeed;
  varying float vPathProgress;
  
  void main() {
    // Traveling light particle
    float particle = smoothstep(0.0, 0.05, mod(vPathProgress - time * 0.1, 1.0)) * 
                     smoothstep(0.1, 0.05, mod(vPathProgress - time * 0.1, 1.0));
    
    // Flickering effect
    float flicker = sin(time * flickerSpeed) * 0.3 + 0.7;
    
    // Thin, fragile appearance
    float alpha = (0.2 + particle * 0.8) * flicker;
    
    vec3 finalColor = threadColor * (1.0 + particle * 3.0);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Glitchy housing shader for overcrowded areas
export const glitchFragmentShader = `
  uniform vec3 baseColor;
  uniform float time;
  uniform float glitchIntensity;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  // Random function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  void main() {
    // Glitch displacement
    float glitch = random(vec2(time * 0.1, vPosition.y)) * glitchIntensity;
    
    // Color distortion
    vec3 colorShift = vec3(
      baseColor.r + glitch * 0.3,
      baseColor.g,
      baseColor.b - glitch * 0.2
    );
    
    // Fracture lines
    float fracture = step(0.95, random(vec2(vPosition.x * 100.0, time * 0.05)));
    
    // Unstable flickering
    float unstable = sin(time * 10.0 + vPosition.y * 20.0) * 0.2 + 0.8;
    
    vec3 finalColor = mix(colorShift, vec3(1.0, 0.0, 0.0), fracture);
    float alpha = unstable * (0.7 + glitch * 0.3);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;
