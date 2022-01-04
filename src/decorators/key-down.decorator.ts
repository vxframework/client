import { Reflector } from '@vxf/core';
import { KeyBindMetadata } from '../types';
import { KEY_BIND_KEY } from '../const';

export function OnKeyDown(
  layout: string,
  key: string,
  description: string,
): MethodDecorator {
  return (target, method: string): void => {
    Reflector.extend<KeyBindMetadata>(target, KEY_BIND_KEY, {
      method,
      layout,
      key,
      description,
      type: 'down',
    });
  };
}
