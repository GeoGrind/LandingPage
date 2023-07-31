import { RefObject } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
interface Props {
  bottomSheetRef: RefObject<BottomSheet>;
  sheetContent: string;
}

export const CustomizableBottomSheet: React.FC<Props> = ({
  bottomSheetRef,

  sheetContent,
}) => (
  <BottomSheet
    ref={bottomSheetRef}
    index={1}
    snapPoints={["25%", "50%"]}
    enablePanDownToClose={true}
  >
    <View style={styles.customizableBottomSheetContentContainer}>
      <Text>{sheetContent}</Text>
    </View>
  </BottomSheet>
);

const styles = StyleSheet.create({
  customizableBottomSheetContentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
