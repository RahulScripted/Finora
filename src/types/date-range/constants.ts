export type DateRange = {
  /** ISO date string (yyyy-mm-dd) */
  start: string;
  /** ISO date string (yyyy-mm-dd) */
  end: string;
};

export type DateRangePickerProps = {
  visible: boolean;
  initial?: DateRange | null;
  onClose: () => void;
  onApply: (range: DateRange) => void;
};
