import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Platform,
  StyleSheet,
  Animated,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useAddRexToCollection } from '~/hooks/useCollections';
import { useSavedRexes } from '~/hooks/useGems';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { rexCoverStoragePathFromRecommendation, rexCoverRemoteHttpUrl } from '~/utils/recommendation/recContentDisplay';
import { toastError, toastSuccess } from '~/utils/appToast';
import { webContainerStyle } from '~/utils';
import { Theme } from '~/theme/Theme';

interface AddRexToCollectionSheetProps {
  open: boolean;
  collectionId: string | null;
  onClose: () => void;
}

const AddRexToCollectionSheet: React.FC<AddRexToCollectionSheetProps> = ({ open, collectionId, onClose }) => {
  const queryClient = useQueryClient();
  const { data: savedRexes = [], isLoading } = useSavedRexes({ uncollected: true });
  const { mutateAsync: addRex } = useAddRexToCollection();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState(false);

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (open) {
      setSelected(new Set());
      setVisible(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(sheetTranslateY, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(sheetTranslateY, { toValue: 600, duration: 220, useNativeDriver: true }),
      ]).start(() => setVisible(false));
    }
  }, [open]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDone = async () => {
    if (!collectionId || selected.size === 0) { onClose(); return; }
    setSaving(true);
    try {
      await Promise.all(
        [...selected].map((rexId) => addRex({ collection_id: collectionId, rex_id: rexId })),
      );
      queryClient.invalidateQueries({ queryKey: ['collection-detail'] });
      queryClient.invalidateQueries({ queryKey: ['my-saved-rexes'] });
      toastSuccess(`Added ${selected.size} rex${selected.size !== 1 ? 'es' : ''}`);
    } catch {
      toastError('Failed to add rexes');
    }
    setSaving(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
      statusBarTranslucent={Platform.OS === 'android'}
      onRequestClose={onClose}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdropOpacity }]}
        pointerEvents="box-none"
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <View style={styles.outer} pointerEvents="box-none">
        <Animated.View style={{ width: '100%', transform: [{ translateY: sheetTranslateY }] }}>
          <View className="bg-card rounded-t-2xl border-t border-border" style={{ maxHeight: 500 }}>
            <View style={webContainerStyle} className="items-center py-3">
              <View className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </View>

            <View style={[{ paddingHorizontal: 16, paddingBottom: 8 }, webContainerStyle]} className="flex-row items-center justify-between">
              <Text className="text-base font-display font-medium text-foreground">
                Pick a saved rex
              </Text>
              <TouchableOpacity onPress={handleDone} activeOpacity={0.7} disabled={saving}>
                {saving ? (
                  <ActivityIndicator size="small" color={Theme.colors.primary} />
                ) : (
                  <Text className="text-sm font-semibold text-primary">
                    {selected.size > 0 ? `Add ${selected.size}` : 'Done'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="h-px bg-border" style={webContainerStyle} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[{ padding: 12, gap: 2 }, webContainerStyle]}
              style={{ flex: 1 }}
            >
              {isLoading ? (
                <View className="items-center py-8">
                  <ActivityIndicator color={Theme.colors.muted} />
                </View>
              ) : savedRexes.length === 0 ? (
                <Text className="text-sm text-muted-foreground text-center py-6">No saved rexes</Text>
              ) : (
                savedRexes.map((rec) => {
                  const isSelected = selected.has(rec.id);
                  return (
                    <TouchableOpacity
                      key={rec.id}
                      onPress={() => toggle(rec.id)}
                      activeOpacity={0.7}
                      style={isSelected ? { backgroundColor: `${Theme.colors.primary}14` } : undefined}
                      className="w-full flex-row items-center gap-3 p-3 rounded-xl"
                    >
                      <View className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <SignedStorageImage
                          bucket={REX_IMAGES_BUCKET}
                          storagePath={rexCoverStoragePathFromRecommendation(rec)}
                          remoteUri={rexCoverRemoteHttpUrl(rec)}
                          className="w-full h-full"
                          accessibilityLabel={rec.title}
                        />
                      </View>
                      <View className="flex-1 min-w-0">
                        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>{rec.title}</Text>
                        <Text className="text-xs" style={{ color: isSelected ? Theme.colors.primary : Theme.colors.muted }}>
                          {isSelected ? 'Selected' : rec.category}
                        </Text>
                      </View>
                      {isSelected && <Check size={18} color={Theme.colors.primary} />}
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)' },
  outer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
});

export default AddRexToCollectionSheet;
