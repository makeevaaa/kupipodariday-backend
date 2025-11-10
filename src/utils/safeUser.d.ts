export declare function safeUser<T extends { password?: string }>(
  user: T
): Omit<T, 'password'>;
