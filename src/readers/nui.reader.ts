import { IMetadataReader, Injectable, Logger, Reflector } from '@vxf/core';
import { NUICallbackMetadata } from '../types';
import { KEY_BIND_KEY, NUI_CALLBACK_KEY } from '../const';

@Injectable()
export class NuiReader implements IMetadataReader {
  public static log = true;
  private logger = new Logger('NUI');

  private mask(controller: string, method: string): string {
    return `${controller}/${method}`.toLowerCase();
  }

  public read(target: unknown): void {
    const ctor = target.constructor;
    const controllerName = Reflector.getControllerName(ctor);
    const cbs =
      Reflector.get<NUICallbackMetadata[]>(target, NUI_CALLBACK_KEY) || [];

    cbs.forEach(({ method }) => {
      const name = this.mask(controllerName, method);
      global.RegisterNuiCallbackType?.(name);
      global.on?.(
        `__cfx_nui:${name}`,
        (data: unknown, cb: (r: unknown) => void) => {
          const result = target[method](data);
          if (result instanceof Promise) {
            return result.then(cb).catch(e => {
              this.logger.error(`Error on NUI Callback ${name}.`, e.message);
              cb(null);
            });
          }
          cb(result);
        },
      );
      if (!NuiReader.log) {
        return null;
      }
      this.logger.success(
        `Nui callback [${name}] is bound to ${controllerName}.${method}`,
      );
    });
  }
}
