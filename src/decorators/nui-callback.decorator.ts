import { Reflector } from '@vxf/core';
import { NUICallbackMetadata } from '../types';
import { NUI_CALLBACK_KEY } from '../const';

export const NuiCallback =
  (): MethodDecorator =>
  (target, method: string): void => {
    Reflector.extend<NUICallbackMetadata>(target, NUI_CALLBACK_KEY, { method });
  };
