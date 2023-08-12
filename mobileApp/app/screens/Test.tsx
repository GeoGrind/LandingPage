import React, { useRef, useEffect } from "react";
import SegmentedPicker from "react-native-segmented-picker";

const Test = () => {
  const segmentedPicker = useRef<SegmentedPicker | null>(null);

  useEffect(() => {
    // Equivalent of componentDidMount

    if (segmentedPicker.current) {
      segmentedPicker.current.show();
    }
  }, []);

  const onConfirm = (selections: any) => {
    console.info(selections);
    // => { col_1: "option_1", col_2: "option_3" }
  };

  return (
    <SegmentedPicker
      ref={segmentedPicker}
      onConfirm={onConfirm}
      options={[
        {
          key: "col_1",
          items: [
            { label: "Option 1", value: "option_1" },
            { label: "Option 2", value: "option_2" },
          ],
        },
        {
          key: "col_2",
          items: [{ label: "Option 3", value: "option_3" }],
        },
      ]}
    />
  );
};

export default Test;
