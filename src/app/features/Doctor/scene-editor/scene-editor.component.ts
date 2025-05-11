import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-scene-editor',
  standalone:true,
  imports: [RouterModule],
  templateUrl: './scene-editor.component.html',
  styleUrls: ['./scene-editor.component.css']
})
export class SceneEditorComponent implements AfterViewInit {
  @ViewChild('sceneContainer', { static: false }) containerRef!: ElementRef;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private objects: THREE.Mesh[] = [];
  private selectedObject: THREE.Mesh | null = null;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private gridHelper!: THREE.GridHelper;

  ngAfterViewInit(): void {

    this.initScene();
    this.animate();
    window.addEventListener('click', (event) => this.onMouseClick(event));
    window.addEventListener('mousemove', (event) => this.onMouseMove(event));
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.containerRef.nativeElement.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);

    this.createFloor();
    this.createObjects();
    this.camera.position.set(0, 5, 5);
    this.controls.update();
  }

  private createFloor(): void {
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);

    this.gridHelper = new THREE.GridHelper(10, 10);
    this.scene.add(this.gridHelper);
  }

  private createObjects(): void {
    // Create a desk (cube) and a wall (rectangle)
    const deskGeometry = new THREE.BoxGeometry(1, 0.5, 1);
    const deskMaterial = new THREE.MeshBasicMaterial({ color: 0xff5733 });
    const desk = new THREE.Mesh(deskGeometry, deskMaterial);
    desk.position.set(-1, 0.25, 0);
    this.scene.add(desk);
    this.objects.push(desk);

    const wallGeometry = new THREE.BoxGeometry(2, 1, 0.1);
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x3498db });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(1, 0.5, 0);
    this.scene.add(wall);
    this.objects.push(wall);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onMouseClick(event: MouseEvent): void {
    this.updateMousePosition(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.objects);

    if (intersects.length > 0) {
      this.selectedObject = intersects[0].object as THREE.Mesh;
      console.log('Selected:', this.selectedObject);
    } else {
      this.selectedObject = null;
    }
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.selectedObject) return;

    this.updateMousePosition(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.selectedObject.position.x = Math.round(this.mouse.x * 5);
    this.selectedObject.position.z = Math.round(this.mouse.y * 5);
  }

  private updateMousePosition(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
}
