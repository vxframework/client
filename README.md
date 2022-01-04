# Vertex client package

##Decorators

**This package provides decorators that can be used on the client side of a fivem resource**

**Key binds**

```typescript
import {Controller, Vertex} from "@vxf/core";
import {OnKeyDown} from "./key-down.decorator";
import {OnKeyUp} from "./key-up.decorator";
import {KeyBindReader} from "./key-bind.reader";

@Controller('T')
class T {
  @OnKeyUp('keyboard', 'f1', 'Description')
  private onKeyUp(): void {
    // triggered when key is up after pressing
  }

  @OnKeyDown('keyboard', 'f1', 'Description')
  private onKeyDown(): void {
    // triggered when key is down
  }
}

(() => {
  const app = new Vertex({
    controllers: [T],
    metadataReaders: [KeyBindReader],
  });

  app.start();
})();

// This is pretty much the same
class T2 {
  constructor() {
    RegisterKeyMapping('+keyup', 'Description', 'keyboard', 'f1')
    RegisterCommand('+keyup', this.onKeyUp.bind(this))
    RegisterCommand('-keyup', this.onKeyDown.bind(this))
  }

  private onKeyUp(): void {
    // triggered when key is up after pressing
  }

  private onKeyDown(): void {
    // triggered when key is down
  }
}
```

**NUI**

```typescript
import {Controller, Vertex} from "@vxf/core";
import {NuiCallback} from "./nui-callback.decorator";
import {NuiReader} from "./nui.reader";

@Controller('T')
class T {
  @NuiCallback()
  private nuiCallback(data: unknown): number {
    return 228;
  }
}

(() => {
  const app = new Vertex({
    controllers: [T],
    metadataReaders: [NuiReader],
  });

  app.start();
})();


// without this package
class T2 {
  constructor() {
    // should be lowercase
    const cbName = 'controllerName/methodName'.toLowerCase();
    global.RegisterNuiCallbackType(cbName);
    global.on?.(
      `__cfx_nui:${cbName}`,
      (data: unknown, cb: (r: unknown) => void) => {
        const result = this.nuiCallback(data);
        if (result instanceof Promise) {
          return result.then(cb)
        }
        cb(result);
      },
    );
  }


  private nuiCallback(data: unknown): number {
    return 228;
  }
}
```