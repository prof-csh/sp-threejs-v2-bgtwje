export class ThreeJsModelRenderer {
  container: HTMLElement = null;
  camera: any;
  scene: any;
  renderer: any;
  model: any;
  controls: any;
  ambientLight: any;
  directionalLight: any;

  constructor() {
    this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  render(container: HTMLElement, model: any): void {
    this.container = container;
    this.model = model;

    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(8, 10, 8);
    this.camera.lookAt(new THREE.Vector3(3, 0, 0));

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x000000 );
    this.scene.add(this.model);

    this.ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(1, 1, 0).normalize();
    this.scene.add(this.directionalLight);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(Window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.enableZoom = true;

    this.container.appendChild(this.renderer.domElement);
    this.addEventListeners();
    this.animate();
  }

  addEventListeners(): void {
    window.addEventListener('resize', this.onResize, false);
  }

  removeEventListeners(): void {
    window.removeEventListener('resize', this.onResize);
  }

  animate(): void {
    requestAnimationFrame(this.animate);
    this.update();
  }

  update(): void {
    this.renderer.render(this.scene, this.camera);
  }

  onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  destroy(): void {
    if (this.container) {
      this.container.innerHTML = "";
      this.container = null;
    }

    this.removeEventListeners();
  }
}