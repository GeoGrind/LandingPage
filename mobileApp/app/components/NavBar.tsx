import React from 'react';
import { View, Button } from 'react-native';

interface NavbarProps {
  onProfilePress: () => void;
  onMapPress: () => void;
  onLogoutPress: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onProfilePress,
  onMapPress,
  onLogoutPress,
}) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Button onPress={onProfilePress} title="See my profile" />
      <Button onPress={onMapPress} title="Open Map" />
      <Button onPress={onLogoutPress} title="Log out" />
    </View>
  );
};

export default Navbar;
