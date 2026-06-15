"use client";

/**
 * @fileOverview Gestor de Audio para ISO CORE.
 * Controla música ambiental, SFX espaciales y persistencia de sonidos por estado.
 */

class AudioManager {
  private static instance: AudioManager;
  private ambientAudio: Record<string, HTMLAudioElement> = {};
  private sfxCache: Record<string, HTMLAudioElement> = {};
  private managedSounds: Map<string, HTMLAudioElement> = new Map();
  private ambientVolume: number = 0.6;
  private sfxVolume: number = 0.5;
  private initialized: boolean = false;
  
  private lastPlayedTime: Record<string, number> = {};

  private constructor() {
    if (typeof window !== 'undefined') {
      this.preloadSfx();
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public getAmbientVolume(): number {
    return this.ambientVolume;
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setAmbientVolume(volume: number) {
    this.ambientVolume = volume;
    Object.entries(this.ambientAudio).forEach(([key, audio]) => {
      audio.volume = key === 'lab' ? volume * 0.5 : volume;
    });
  }

  public setSfxVolume(volume: number) {
    this.sfxVolume = volume;
  }

  private preloadSfx() {
    const assets = {
      'select': '/audio/ui/ui_select_neon.mp3',
      'menu_open': '/audio/ui/ui_menu_open.mp3',
      'menu_close': '/audio/ui/ui_menu_close.mp3',
      'alert': '/audio/ui/ui_alert_critical.mp3',
      'walk': '/audio/sfx/actions/action_walk_grass.mp3',
      'chop': '/audio/sfx/actions/action_wood_chop.mp3',
      'mine': '/audio/sfx/actions/action_stone_mine.mp3',
      'collect': '/audio/sfx/actions/action_berry_pick.mp3',
      'ambient_day': '/audio/ambient/ambient_forest_day.mp3',
      'ambient_night': '/audio/ambient/ambient_forest_night.mp3',
      'lab_hum': '/audio/ambient/ambient_lab_hum.mp3',
      'murmur': '/audio/sfx/social/social_murmur_loop.mp3',
      'wolf_growl': '/audio/sfx/combat/animal_wolf_growl.mp3',
      'death': '/audio/sfx/combat/combat_death_cry.mp3'
    };

    Object.entries(assets).forEach(([id, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.sfxCache[id] = audio;
    });
  }

  public startAmbient() {
    if (this.initialized) {
      this.resumeAmbient();
      return;
    }

    if (this.sfxCache['lab_hum']) {
      const hum = this.sfxCache['lab_hum'];
      hum.loop = true;
      hum.volume = this.ambientVolume * 0.5;
      hum.play().catch(() => {
        const retry = () => {
          hum.play();
          window.removeEventListener('click', retry);
        };
        window.addEventListener('click', retry);
      });
      this.ambientAudio['lab'] = hum;
    }

    if (this.sfxCache['ambient_day']) {
      const forest = this.sfxCache['ambient_day'];
      forest.loop = true;
      forest.volume = this.ambientVolume;
      forest.play().catch(() => {});
      this.ambientAudio['forest'] = forest;
    }

    this.initialized = true;
  }

  public resumeAmbient() {
    Object.values(this.ambientAudio).forEach(audio => {
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    });
  }

  public updateAmbientTheme(luz: number) {
    const isNight = luz < 0.5;
    const currentKey = isNight ? 'ambient_night' : 'ambient_day';
    
    if (this.sfxCache[currentKey] && this.ambientAudio['forest'] !== this.sfxCache[currentKey]) {
      const oldAudio = this.ambientAudio['forest'];
      if (oldAudio) {
        oldAudio.pause();
        oldAudio.currentTime = 0;
      }

      const newAudio = this.sfxCache[currentKey];
      newAudio.loop = true;
      newAudio.volume = this.ambientVolume;
      newAudio.play().catch(() => {});
      this.ambientAudio['forest'] = newAudio;
    }
  }

  public syncEntitySound(entityId: string, soundId: string | null, pos: { x: number, y: number }, cameraPos: { x: number, y: number }) {
    const currentSound = this.managedSounds.get(entityId);
    
    const dx = pos.x - cameraPos.x;
    const dy = pos.y - cameraPos.y;
    const distance = Math.hypot(dx, dy);
    const maxRange = 35;
    const attenuation = Math.max(0, 1 - (distance / maxRange));
    
    let volume = this.sfxVolume * attenuation;
    if (soundId === 'murmur') volume *= 0.35;

    // Persistencia: Si el sonido es el mismo, solo actualizar volumen y salir
    if (currentSound && (currentSound as any)._soundId === soundId) {
      currentSound.volume = volume;
      return;
    }

    // Si el sonido ha cambiado o se ha detenido, pausar el anterior
    if (currentSound) {
      currentSound.pause();
      currentSound.currentTime = 0;
      this.managedSounds.delete(entityId);
    }

    // Iniciar nuevo sonido si aplica
    if (soundId) {
      const source = this.sfxCache[soundId];
      if (source) {
        const audio = source.cloneNode() as HTMLAudioElement;
        audio.loop = true;
        (audio as any)._soundId = soundId;
        audio.volume = volume;
        audio.play().catch(() => {});
        this.managedSounds.set(entityId, audio);
      }
    }
  }

  public playUi(id: string) {
    const sound = this.sfxCache[id];
    if (sound) {
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = this.sfxVolume;
      clone.play().catch(() => {});
    }
  }

  public playSpatial(id: string, entityPos: { x: number, y: number }, cameraPos: { x: number, y: number }) {
    const sound = this.sfxCache[id];
    if (!sound) return;

    const now = Date.now();
    // Cooldown de pisadas para mantener rítmica
    const cooldown = id === 'walk' ? 400 : 150;
    if (this.lastPlayedTime[id] && now - this.lastPlayedTime[id] < cooldown) {
      return;
    }

    const dx = entityPos.x - cameraPos.x;
    const dy = entityPos.y - cameraPos.y;
    const distance = Math.hypot(dx, dy);
    const maxRange = 15; // Rango más corto para pisadas
    if (distance > maxRange) return;

    let typeMultiplier = 1.0;
    if (id === 'walk') typeMultiplier = 0.02; // Reducción drástica solicitada

    const attenuation = 1 - (distance / maxRange);
    const volume = Math.max(0, this.sfxVolume * attenuation * typeMultiplier);

    if (volume < 0.005) return;

    const clone = sound.cloneNode() as HTMLAudioElement;
    clone.volume = volume;
    this.lastPlayedTime[id] = now;
    clone.play().catch(() => {});
  }
}

export const audioManager = AudioManager.getInstance();