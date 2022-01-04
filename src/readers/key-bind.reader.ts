import { IMetadataReader, Injectable, Logger, Reflector } from '@vxf/core';
import { KEY_BIND_KEY } from '../const';
import { KeyBindMetadata } from '../types';

@Injectable()
export class KeyBindReader implements IMetadataReader {
  public static log = true;
  private logger = new Logger('KeyBind');

  constructor() {
    RegisterCommand('+keypress', this.onKeyDown.bind(this), false);
    RegisterCommand('-keypress', this.onKeyUp.bind(this), false);
  }

  private onKeyUp(source: string, [layout, key, ...params]: string[]): void {
    if (!layout || !key) {
      return null;
    }
    emit(`key:up:${layout.toLowerCase()}:${key.toLowerCase()}`, ...params);
  }

  private onKeyDown(source: string, [layout, key, ...params]: string[]): void {
    if (!layout || !key) {
      return null;
    }
    emit(`key:down:${layout.toLowerCase()}:${key.toLowerCase()}`, ...params);
  }

  public read(target: unknown): void {
    const ctor = target.constructor;
    const controllerName = Reflector.getControllerName(ctor);
    const keys = Reflector.get<KeyBindMetadata[]>(target, KEY_BIND_KEY) || [];

    keys.forEach(({ method, description, key, layout, type }) => {
      global.RegisterKeyMapping?.(
        `+keypress ${layout} ${key}`,
        description,
        layout,
        key,
      );
      const event = type === 'down' ? 'key:down' : 'key:up';

      global.on?.(`${event}:${layout}:${key}`, target[method].bind(target));

      if (!KeyBindReader.log) {
        return null;
      }
      this.logger.success(
        `Key [${layout}.${key}] is bound to ${controllerName}.${method}`,
      );
    });
  }
}
