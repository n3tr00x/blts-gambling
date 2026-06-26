export type ActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

export type AuthActionResult = {
  success: boolean;
  message: string;
};
