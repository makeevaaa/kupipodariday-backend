// src/utils/safeUser.ts
/**
 * Безопасно возвращает объект пользователя без поля password.
 * Используется при авторизации, регистрации и выдаче данных профиля.
 */
export function safeUser<T extends { password?: string }>(
  user: T
): Omit<T, 'password'> {
  if (!user) return user;
  const { password, ...rest } = user;
  return rest;
}
