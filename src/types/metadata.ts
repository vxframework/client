export type NUICallbackMetadata = {
  method: string;
};

export type KeyBindMetadata = {
  method: string;
  type: 'up' | 'down';
  layout: string;
  key: string;
  description?: string;
};
