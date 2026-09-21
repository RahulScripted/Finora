export type DateRange = {
  start: string;
  end: string;
};

export type DateRangePickerProps = {
  visible: boolean;
  initial?: DateRange | null;
  onClose: () => void;
  onApply: (range: DateRange) => void;
};
