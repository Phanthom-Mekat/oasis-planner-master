// GLSL Shaders for Digital Etherealism

export const heatHazeVertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform float uIntensity;
  
  void main() {
    vUv = uv;
    
    // Create undulating heat effect
    vec3 pos = position;
    float wave = sin(pos.x * 2.0 + uTime) * cos(pos.y * 2.0 + uTime) * 0.3;
    pos.z += wave * uIntensity;
    vElevation = wave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const heatHazeFragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uHotColor;
  uniform vec3 uCoolColor;
  
  // Noise function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  void main() {
    // Multi-octave noise for heat distortion
    float n = noise(vUv * 10.0 + uTime * 0.1);
    n += noise(vUv * 20.0 + uTime * 0.2) * 0.5;
    n += noise(vUv * 40.0 + uTime * 0.3) * 0.25;
    n /= 1.75;
    
    // Mix colors based on intensity and noise
    vec3 color = mix(uCoolColor, uHotColor, n * uIntensity);
    
    // Pulsing opacity
    float pulse = sin(uTime * 2.0) * 0.2 + 0.8;
    float alpha = n * uIntensity * pulse * 0.6;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export const pollutionNebulaVertexShader = `
  varying vec3 vPosition;
  varying float vDistance;
  uniform float uTime;
  
  void main() {
    vPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDistance = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (300.0 / -mvPosition.z) * (1.0 + sin(uTime + position.x * 10.0) * 0.3);
  }
`;

export const pollutionNebulaFragmentShader = `
  varying vec3 vPosition;
  varying float vDistance;
  uniform vec3 uColorClean;
  uniform vec3 uColorPolluted;
  uniform float uPollutionLevel;
  uniform float uTime;
  
  void main() {
    // Circular particle shape
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;
    
    // Soft edges
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    
    // Color based on pollution level
    vec3 color = mix(uColorClean, uColorPolluted, uPollutionLevel);
    
    // Add shimmer effect
    float shimmer = sin(vDistance * 0.1 + uTime * 2.0) * 0.5 + 0.5;
    color *= (0.7 + shimmer * 0.3);
    
    // Distance fade
    alpha *= smoothstep(50.0, 10.0, vDistance);
    
    gl_FragColor = vec4(color, alpha * uPollutionLevel);
  }
`;

export const waterRefractionVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uWaveHeight;
  
  void main() {
    vUv = uv;
    vNormal = normal;
    
    // Water waves
    vec3 pos = position;
    float wave1 = sin(pos.x * 2.0 + uTime) * cos(pos.y * 2.0 + uTime) * uWaveHeight;
    float wave2 = sin(pos.x * 3.0 - uTime * 0.7) * cos(pos.y * 3.0 - uTime * 0.7) * uWaveHeight * 0.5;
    pos.z += wave1 + wave2;
    
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const waterRefractionFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3 uWaterColor;
  uniform vec3 uPollutionColor;
  uniform float uTurbidity;
  uniform sampler2D uRefractionMap;
  
  void main() {
    // Refraction distortion
    vec2 distortion = vNormal.xy * 0.1;
    vec2 refractUv = vUv + distortion + vec2(sin(uTime * 0.5 + vUv.y * 10.0) * 0.02);
    
    // Mix clean and polluted water colors
    vec3 waterColor = mix(uWaterColor, uPollutionColor, uTurbidity);
    
    // Caustics effect
    float caustics = sin(vPosition.x * 10.0 + uTime) * cos(vPosition.y * 10.0 + uTime);
    caustics = abs(caustics) * 0.3;
    waterColor += vec3(caustics);
    
    // Depth-based opacity
    float depth = smoothstep(0.0, 5.0, abs(vPosition.z));
    float alpha = 0.4 + depth * 0.4;
    
    gl_FragColor = vec4(waterColor, alpha);
  }
`;

export const crystallineGrowthVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vGrowth;
  uniform float uGrowthProgress;
  uniform float uTime;
  
  void main() {
    vPosition = position;
    vNormal = normal;
    
    // Scale based on growth progress
    vec3 pos = position * uGrowthProgress;
    
    // Add emergence animation
    float emergence = smoothstep(0.0, 0.3, uGrowthProgress);
    pos.y += (1.0 - emergence) * -2.0;
    
    // Subtle crystalline vibration
    pos += normal * sin(uTime * 3.0 + position.y * 5.0) * 0.02 * uGrowthProgress;
    
    vGrowth = uGrowthProgress;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const crystallineGrowthFragmentShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vGrowth;
  uniform vec3 uCrystalColor;
  uniform float uTime;
  uniform float uEmissiveIntensity;
  
  void main() {
    // Fresnel effect for crystal edges
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
    
    // Pulsing glow
    float pulse = sin(uTime * 2.0 + vPosition.y * 3.0) * 0.3 + 0.7;
    
    // Crystal color with glow
    vec3 color = uCrystalColor * (1.0 + fresnel * 2.0);
    color += uCrystalColor * pulse * uEmissiveIntensity * vGrowth;
    
    // Transparency
    float alpha = 0.7 + fresnel * 0.3;
    
    gl_FragColor = vec4(color, alpha * vGrowth);
  }
`;
