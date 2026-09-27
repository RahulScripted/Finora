/** Result of the `useBirthday` hook. */
export type UseBirthdayResult = {
  /** Whether the celebration should currently be shown. */
  visible: boolean;
  /** Dismiss the celebration for this session. */
  dismiss: () => void;
};
