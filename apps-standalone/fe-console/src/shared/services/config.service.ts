import { Injectable } from '@angular/core';
import { AppInitConfig } from '@common/types';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  config: AppInitConfig;

  setConfig(config: AppInitConfig) {
    this.config = config;
  }
}
