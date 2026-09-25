import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gift, MoreVertical } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  onAddToWishList: () => void;
};

function CardHeaderMenuButton({ onAddToWishList }: Props) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={() => setShowMenu((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel="More options"
      >
        <MoreVertical size={16} color={Theme.colors.muted} />
      </TouchableOpacity>
      {showMenu ? (
        <>
          <Pressable
            onPress={() => setShowMenu(false)}
            style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
          />
          <View
            className="absolute right-0 top-8 z-20 min-w-[220px] rounded-xl border border-border bg-card p-2 shadow-lg"
            style={{ elevation: 8 }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setShowMenu(false);
                onAddToWishList();
              }}
              className="mx-1 flex-row items-center gap-3 rounded-md px-3 py-2.5 hover:bg-zinc-100"
            >
              <Gift size={15} color={Theme.colors.foreground} />
              <Text className="text-sm text-foreground">Add this product to my Wish List</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </View>
  );
}

export default CardHeaderMenuButton;
