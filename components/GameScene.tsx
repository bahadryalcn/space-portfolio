import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GameState, InputState } from '../types';
import { GAME_CONFIG, COLORS, MILESTONES } from '../constants';
import { audioService } from '../services/audioService';

interface GameSceneProps {
  input: React.MutableRefObject<InputState>;
  gameStateRef: React.MutableRefObject<GameState>;
  onGameUpdate: (state: Partial<GameState>) => void;
}

const GameScene: React.FC<GameSceneProps> = ({ input, gameStateRef, onGameUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.0015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 15000);
    camera.position.set(0, 6, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.setClearColor(0x000000, 1);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    // Handle both old and new Three.js versions
    if ('outputColorSpace' in renderer) {
      (renderer as any).outputColorSpace = THREE.SRGBColorSpace;
    } else if ('outputEncoding' in renderer) {
      (renderer as any).outputEncoding = THREE.sRGBEncoding;
    }
    renderer.shadowMap.enabled = false;
    
    // Ensure canvas is visible and properly sized
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.zIndex = '0';
    
    containerRef.current.appendChild(renderer.domElement);
    console.log('Renderer canvas added to DOM:', {
      container: containerRef.current,
      canvas: renderer.domElement,
      canvasSize: { width: renderer.domElement.width, height: renderer.domElement.height }
    });

    // --- POST PROCESSING (BLOOM) ---
    let composer: EffectComposer | null = null;
    try {
      const renderScene = new RenderPass(scene, camera);
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
      bloomPass.threshold = 0;
      bloomPass.strength = 1.2;
      bloomPass.radius = 0.5;

      composer = new EffectComposer(renderer);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);
    } catch (error) {
      console.warn('Post-processing initialization failed, using direct render:', error);
      composer = null;
    }

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x404040, 4);
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xffffff, 5);
    sunLight.position.set(-100, 100, 50);
    sunLight.castShadow = false;
    scene.add(sunLight);

    const pointLight = new THREE.PointLight(COLORS.NEON_BLUE, 10, 100);
    pointLight.position.set(0, 0, 0); // Start at ship position
    scene.add(pointLight);
    
    // Add additional light for better visibility
    const fillLight = new THREE.DirectionalLight(0xffffff, 2);
    fillLight.position.set(100, 50, 100);
    scene.add(fillLight);

    // --- STARFIELD ---
    const starGeo = new THREE.BufferGeometry();
    const starCount = 6000;
    const posArray = new Float32Array(starCount * 3);
    for(let i=0; i<starCount*3; i++) {
      posArray[i] = (Math.random() - 0.5) * 3000;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMat = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 2, 
      transparent: true,
      opacity: 1,
      sizeAttenuation: true
    });
    const starField = new THREE.Points(starGeo, starMat);
    starField.position.set(0, 0, 0);
    scene.add(starField);

    // --- PROCEDURAL SHIP ---
    const shipGroup = new THREE.Group();
    shipGroup.position.set(0, 0, 0); // Explicit starting position
    
    // Fuselage
    const bodyGeo = new THREE.ConeGeometry(0.8, 4, 4);
    bodyGeo.rotateX(Math.PI / 2);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.4, metalness: 0.8, emissive: 0x222222, emissiveIntensity: 0.2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    shipGroup.add(body);

    // Wings
    const wingGeo = new THREE.BoxGeometry(4, 0.1, 1);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5 });
    const wing1 = new THREE.Mesh(wingGeo, wingMat);
    wing1.rotation.z = Math.PI / 8;
    const wing2 = new THREE.Mesh(wingGeo, wingMat);
    wing2.rotation.z = -Math.PI / 8;
    shipGroup.add(wing1);
    shipGroup.add(wing2);

    // Engines
    const engineGeo = new THREE.CylinderGeometry(0.2, 0.4, 1, 8);
    engineGeo.rotateX(Math.PI / 2);
    const engineMat = new THREE.MeshBasicMaterial({ color: COLORS.NEON_RED });
    const engineL = new THREE.Mesh(engineGeo, engineMat);
    engineL.position.set(-1, 0, 1.5);
    const engineR = new THREE.Mesh(engineGeo, engineMat);
    engineR.position.set(1, 0, 1.5);
    shipGroup.add(engineL);
    shipGroup.add(engineR);

    scene.add(shipGroup);

    // --- GAME OBJECTS ---
    const projectiles: { mesh: THREE.Mesh, velocity: THREE.Vector3, alive: boolean }[] = [];
    const enemies: { mesh: THREE.Group, alive: boolean, type: 'asteroid' | 'drone' }[] = [];
    const milestoneMarkers: THREE.Group[] = [];

    // Create Milestones
    MILESTONES.forEach(m => {
      const group = new THREE.Group();
      group.position.z = -m.zDistance;
      
      // Text Label (Canvas Texture)
      const canvas = document.createElement('canvas');
      canvas.width = 1024; 
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        // Use modern rounded rectangle API
        if (ctx.roundRect) {
          ctx.roundRect(50, 20, 924, 216, 20);
        } else {
          // Fallback for older browsers
          const x = 50, y = 20, w = 924, h = 216, r = 20;
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + w - r, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + r);
          ctx.lineTo(x + w, y + h - r);
          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          ctx.lineTo(x + r, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
        }
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 90px Orbitron';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 8;
        ctx.strokeText(m.title, 512, 128);

        ctx.fillStyle = m.color;
        ctx.fillText(m.title, 512, 128);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      const spriteMat = new THREE.SpriteMaterial({ 
        map: tex, 
        transparent: true,
        alphaTest: 0.1
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(40, 10, 1); // Reduced size for better visibility
      sprite.position.y = 18;
      group.add(sprite);

      // Structure based on type
      let geo;
      if (m.type === 'education') geo = new THREE.IcosahedronGeometry(10, 0);
      else if (m.type === 'project') geo = new THREE.TorusGeometry(8, 2, 16, 50);
      else geo = new THREE.BoxGeometry(15, 5, 30); 

      const mat = new THREE.MeshStandardMaterial({ 
        color: m.color, 
        wireframe: false, // Changed to false for better visibility
        emissive: m.color,
        emissiveIntensity: 1.0, // Increased for better visibility
        transparent: true,
        opacity: 0.9
      });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
      
      const ringGeo = new THREE.TorusGeometry(20, 0.5, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      group.add(ringMesh);

      scene.add(group);
      milestoneMarkers.push(group);
    });

    // --- SPAWN LOGIC ---
    const spawnEnemy = (zPos: number) => {
      const isDrone = Math.random() > 0.6;
      const group = new THREE.Group();
      
      if (isDrone) {
        const centerMat = new THREE.MeshStandardMaterial({ 
          color: 0x333333,
          emissive: 0x0000ff,
          emissiveIntensity: 0.3
        });
        const center = new THREE.Mesh(new THREE.SphereGeometry(1.5), centerMat);
        const wingMat = new THREE.MeshStandardMaterial({ 
          color: 0x222222,
          emissive: 0x0000ff,
          emissiveIntensity: 0.2
        });
        const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4, 4), wingMat);
        wingL.position.x = -2;
        const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4, 4), wingMat);
        wingR.position.x = 2;
        group.add(center, wingL, wingR);
      } else {
        const geo = new THREE.DodecahedronGeometry(Math.random() * 2 + 2);
        const mat = new THREE.MeshStandardMaterial({ 
          color: 0x555555, 
          roughness: 0.9,
          emissive: 0x444444,
          emissiveIntensity: 0.2
        });
        const mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);
      }

      group.position.set(
        (Math.random() - 0.5) * (GAME_CONFIG.MAX_X * 1.8),
        (Math.random() - 0.5) * (GAME_CONFIG.MAX_Y * 1.8),
        zPos - 400 
      );

      scene.add(group);
      enemies.push({ mesh: group, alive: true, type: isDrone ? 'drone' : 'asteroid' });
    };

    // --- GAME LOOP STATE ---
    let frameId: number;
    let lastTime: number | null = null;
    let lastShot = 0;
    let shipVelocityX = 0;
    let shipVelocityY = 0;
    let currentForwardSpeed = GAME_CONFIG.SHIP_SPEED; 

    const animate = (time: number) => {
      // PAUSE HANDLING
      if (gameStateRef.current.isPaused) {
        if (lastTime === null) lastTime = time;
        else lastTime = time; // Prevent large delta time jump on resume
        frameId = requestAnimationFrame(animate);
        if (composer) {
          composer.render();
        } else {
          renderer.render(scene, camera);
        }
        return;
      }

      const dt = lastTime === null ? 0 : (time - lastTime) / 1000;
      lastTime = time;

      if (gameStateRef.current.gamePhase === 'playing') {
        // 1. SPEED CONTROL & MILESTONE DETECTION
        const currentZ = Math.abs(shipGroup.position.z);
        let targetSpeed = GAME_CONFIG.SHIP_SPEED;

        for (const m of MILESTONES) {
          const dist = Math.abs(currentZ - m.zDistance);
          if (dist < 400) {
             targetSpeed = GAME_CONFIG.SHIP_SPEED * 0.3; 
             break;
          }
        }

        currentForwardSpeed = THREE.MathUtils.lerp(currentForwardSpeed, targetSpeed, 0.05);
        const speed = currentForwardSpeed * 60 * dt; 
        
        // 2. SHIP MOVEMENT
        const maneuveringForce = 0.25 * 60 * dt; 
        const maxStrafeSpeed = 0.35; 

        if (input.current.left) shipVelocityX -= maneuveringForce;
        if (input.current.right) shipVelocityX += maneuveringForce;
        if (input.current.up) shipVelocityY += maneuveringForce;
        if (input.current.down) shipVelocityY -= maneuveringForce;

        shipVelocityX *= 0.94;
        shipVelocityY *= 0.94;

        shipVelocityX = THREE.MathUtils.clamp(shipVelocityX, -maxStrafeSpeed, maxStrafeSpeed);
        shipVelocityY = THREE.MathUtils.clamp(shipVelocityY, -maxStrafeSpeed, maxStrafeSpeed);

        shipGroup.position.x += shipVelocityX;
        shipGroup.position.y += shipVelocityY;
        shipGroup.position.z -= speed; 

        shipGroup.position.x = THREE.MathUtils.clamp(shipGroup.position.x, -GAME_CONFIG.MAX_X, GAME_CONFIG.MAX_X);
        shipGroup.position.y = THREE.MathUtils.clamp(shipGroup.position.y, -GAME_CONFIG.MAX_Y, GAME_CONFIG.MAX_Y);

        shipGroup.rotation.z = THREE.MathUtils.lerp(shipGroup.rotation.z, -shipVelocityX * 0.3, GAME_CONFIG.ROTATION_SPEED);
        shipGroup.rotation.x = THREE.MathUtils.lerp(shipGroup.rotation.x, shipVelocityY * 0.15, GAME_CONFIG.ROTATION_SPEED);

        const targetCamPos = new THREE.Vector3(
          shipGroup.position.x * 0.6, 
          shipGroup.position.y * 0.5 + 6,
          shipGroup.position.z + 16
        );
        camera.position.lerp(targetCamPos, GAME_CONFIG.CAMERA_LAG); 
        camera.lookAt(shipGroup.position.x, shipGroup.position.y, shipGroup.position.z - 30);

        pointLight.position.copy(shipGroup.position);
        pointLight.position.z += 1;

        const currentDist = Math.abs(shipGroup.position.z);
        
        const milestoneIdx = MILESTONES.findIndex(m => m.zDistance > currentDist - 100 && m.zDistance < currentDist + 100);
        if (milestoneIdx !== -1 && milestoneIdx !== gameStateRef.current.currentMilestoneIndex) {
          audioService.playMilestoneChime();
          onGameUpdate({ currentMilestoneIndex: milestoneIdx });
        }
        onGameUpdate({ distance: Math.floor(currentDist) });

        if (currentDist >= GAME_CONFIG.TOTAL_DISTANCE) {
             onGameUpdate({ gamePhase: 'ending' });
        }

        // 3. COMBAT & SPAWNING
        if (input.current.fire && time - lastShot > GAME_CONFIG.LASER_COOLDOWN) {
          audioService.playLaser();
          lastShot = time;
          
          const laserGeo = new THREE.BoxGeometry(0.2, 0.2, 4);
          const laserMat = new THREE.MeshBasicMaterial({ color: COLORS.NEON_GREEN });
          
          shipGroup.updateMatrixWorld();

          [-1.5, 1.5].forEach(xOffset => {
            const laser = new THREE.Mesh(laserGeo, laserMat);
            const spawnPos = new THREE.Vector3(xOffset, 0, -2);
            shipGroup.localToWorld(spawnPos);
            
            laser.position.copy(spawnPos);
            laser.quaternion.copy(shipGroup.quaternion);
            
            scene.add(laser);
            projectiles.push({ mesh: laser, velocity: new THREE.Vector3(0, 0, -GAME_CONFIG.LASER_SPEED).applyQuaternion(shipGroup.quaternion), alive: true });
          });
        }

        for (let i = projectiles.length - 1; i >= 0; i--) {
          const p = projectiles[i];
          p.mesh.position.addScaledVector(p.velocity, dt);
          
          if (p.mesh.position.distanceTo(shipGroup.position) > 300) {
            scene.remove(p.mesh);
            projectiles.splice(i, 1);
            continue;
          }

          for (let j = enemies.length - 1; j >= 0; j--) {
            const e = enemies[j];
            if (!e.alive) continue;
            if (p.mesh.position.distanceTo(e.mesh.position) < 6) {
               scene.remove(p.mesh);
               projectiles.splice(i, 1);
               scene.remove(e.mesh);
               enemies.splice(j, 1);
               audioService.playExplosion();
               onGameUpdate({ score: gameStateRef.current.score + (e.type === 'drone' ? 500 : 100) });
               break; 
            }
          }
        }

        if (Math.random() < GAME_CONFIG.ENEMY_SPAWN_CHANCE) {
          spawnEnemy(shipGroup.position.z - 500);
        }

        for (let i = enemies.length - 1; i >= 0; i--) {
          const e = enemies[i];
          e.mesh.position.z += (e.type === 'drone' ? GAME_CONFIG.DRONE_SPEED : 0) * dt;
          e.mesh.rotation.x += dt;
          e.mesh.rotation.y += dt;

          if (e.mesh.position.distanceTo(shipGroup.position) < 5) {
            scene.remove(e.mesh);
            enemies.splice(i, 1);
            onGameUpdate({ shield: Math.max(0, gameStateRef.current.shield - GAME_CONFIG.ENEMY_DAMAGE) });
            
            camera.position.x += (Math.random() - 0.5) * 2;
            camera.position.y += (Math.random() - 0.5) * 2;
            audioService.playExplosion();
          }
          
          if (e.mesh.position.z > shipGroup.position.z + 20) {
             scene.remove(e.mesh);
             enemies.splice(i, 1);
          }
        }
        
        milestoneMarkers.forEach(g => {
            g.rotation.y += 0.1 * dt;
        });

        starField.position.z = shipGroup.position.z;

      } else if (gameStateRef.current.gamePhase === 'ending') {
         shipGroup.position.z -= 80 * dt; 
         camera.lookAt(shipGroup.position);

         shipGroup.position.x = THREE.MathUtils.lerp(shipGroup.position.x, 0, 0.05);
         shipGroup.position.y = THREE.MathUtils.lerp(shipGroup.position.y, 0, 0.05);
         
         camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.05);
         camera.position.y = THREE.MathUtils.lerp(camera.position.y, 6, 0.05);
         camera.position.z = shipGroup.position.z + 15;
         
         starField.position.z = shipGroup.position.z;
         pointLight.position.copy(shipGroup.position);
         pointLight.position.z += 1;
      } else {
        // Start screen animation - ship should be visible
        shipGroup.rotation.z = Math.sin(time * 0.001) * 0.1;
        shipGroup.rotation.x = Math.cos(time * 0.001) * 0.05;
        camera.position.x = Math.sin(time * 0.0005) * 2;
        camera.position.y = 6;
        camera.position.z = 12;
        camera.lookAt(shipGroup.position);
        
        // Ensure point light follows ship
        pointLight.position.copy(shipGroup.position);
        pointLight.position.z += 1;
        
        // Animate starfield - keep it centered
        starField.position.set(0, 0, 0);
        
        // Make milestone markers visible in start screen by rotating them
        milestoneMarkers.forEach(g => {
          g.rotation.y += 0.01 * (dt || 0.016);
        });
      }

      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
      frameId = requestAnimationFrame(animate);
    };

    // Initial render to show scene immediately
    if (composer) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
    console.log('Three.js initialized:', {
      shipPos: shipGroup.position,
      cameraPos: camera.position,
      children: scene.children.length,
      rendererSize: { width: renderer.domElement.width, height: renderer.domElement.height },
      containerSize: containerRef.current ? {
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      } : 'no container',
      composer: composer ? 'active' : 'disabled'
    });
    
    // Force a test render with a visible object
    const testGeometry = new THREE.BoxGeometry(2, 2, 2);
    const testMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const testMesh = new THREE.Mesh(testGeometry, testMaterial);
    testMesh.position.set(0, 0, -5);
    scene.add(testMesh);
    console.log('Added test red cube at (0, 0, -5)');
    
    frameId = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (composer) {
        composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 w-full h-full" 
      style={{ 
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }} 
    />
  );
};

export default GameScene;