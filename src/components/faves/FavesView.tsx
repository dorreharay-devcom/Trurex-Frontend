import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  ScrollView,
  Animated,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Plus, PackageOpen, Search } from 'lucide-react-native';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import {
  rexCoverStoragePathFromRecommendation,
  rexCoverRemoteHttpUrl,
} from '~/utils/recommendation/recContentDisplay';
import RecommendationCard from '~/components/recommendation/RecommendationCard';
import { useQueryClient } from '@tanstack/react-query';
import {
  useMyCollections,
  useMySavedCollections,
  useAddRexToCollection,
} from '~/hooks/useCollections';
import { useSavedRexes } from '~/hooks/useGems';
import { useAuth } from '~/services/AuthContext';
import { isWeb, webContainerStyle } from '~/utils';
import { Theme } from '~/theme/Theme';
import type {
  Recommendation,
  RecommendationOpenOptions,
} from '~/types/recommendation/recommendation';
import CollectionDetailView from '~/components/faves/CollectionDetailView';
import CreateCollectionModal from '~/components/faves/CreateCollectionModal';
import AddToCollectionSheet, { RecSummary } from '~/components/faves/AddToCollectionSheet';
import CollectionCard from '~/components/profile/CollectionCard';

type FavesViewProps = {
  commentCountByRexId?: Record<string, number>;
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
};

const FavesView: React.FC<FavesViewProps> = ({ onRecommendationPress }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  useWindowDimensions();

  const [searchQuery, setSearchQuery] = useState('');
  const [openCollectionId, setOpenCollectionId] = useState<string | null>(null);
  const [addToCollectionId, setAddToCollectionId] = useState<string | null>(null);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [addToCollectionRec, setAddToCollectionRec] = useState<RecSummary | null>(null);

  const { data: myCollections = [], isLoading: loadingMine } = useMyCollections(user?.id);
  const { data: savedCollections = [], isLoading: loadingSavedCollections } =
    useMySavedCollections();
  const collections = [...myCollections, ...savedCollections];
  const loadingCollections = loadingMine || loadingSavedCollections;
  const { data: savedRexes = [], isLoading: loadingSaved } = useSavedRexes({ uncollected: true });
  const { mutate: addRex } = useAddRexToCollection();

  const uncollectedRecs = savedRexes;

  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return collections;
    const q = searchQuery.toLowerCase();
    return collections.filter((c) => c.display_name.toLowerCase().includes(q));
  }, [collections, searchQuery]);

  const filteredUncollected = useMemo(() => {
    if (!searchQuery.trim()) return uncollectedRecs;
    const q = searchQuery.toLowerCase();
    return uncollectedRecs.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        (r.location?.toLowerCase() ?? '').includes(q),
    );
  }, [uncollectedRecs, searchQuery]);

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(400)).current;
  const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    if (addToCollectionId) {
      setSheetVisible(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          damping: 20,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(sheetTranslateY, { toValue: 400, duration: 220, useNativeDriver: true }),
      ]).start(() => setSheetVisible(false));
    }
  }, [addToCollectionId]);

  if (openCollectionId) {
    return (
      <>
        <CollectionDetailView
          collectionId={openCollectionId}
          onBack={() => {
            setOpenCollectionId(null);
            queryClient.invalidateQueries({ queryKey: ['my-collections'] });
            queryClient.invalidateQueries({ queryKey: ['my-saved-collections'] });
            queryClient.invalidateQueries({ queryKey: ['my-saved-rexes'] });
          }}
          onAddItem={(id) => setAddToCollectionId(id)}
        />
        <Modal
          visible={sheetVisible}
          transparent
          animationType="none"
          presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
          statusBarTranslucent={Platform.OS === 'android'}
          onRequestClose={() => setAddToCollectionId(null)}
        >
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdropOpacity }]}
            pointerEvents="box-none"
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setAddToCollectionId(null)} />
          </Animated.View>

          <View style={styles.overlay} pointerEvents="box-none">
            <Animated.View
              style={[{ width: '100%' }, { transform: [{ translateY: sheetTranslateY }] }]}
            >
              <View
                className="bg-card rounded-t-2xl border-t border-border"
                style={{ maxHeight: 400 }}
              >
                <View style={webContainerStyle} className="items-center py-3">
                  <View className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                </View>
                <View style={[{ paddingHorizontal: 16, paddingBottom: 12 }, webContainerStyle]}>
                  <Text className="text-base font-display font-medium text-foreground">
                    Pick a saved rex
                  </Text>
                </View>
                <View className="h-px bg-border mb-1" style={webContainerStyle} />
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {savedRexes.length === 0 ? (
                    <Text className="text-sm text-muted-foreground text-center py-6">
                      No saved rexes
                    </Text>
                  ) : (
                    <View
                      style={[
                        { paddingHorizontal: 16, paddingVertical: 8, gap: 4 },
                        webContainerStyle,
                      ]}
                    >
                      {savedRexes.map((rec) => (
                        <TouchableOpacity
                          key={rec.id}
                          activeOpacity={0.7}
                          onPress={() => {
                            if (!addToCollectionId) return;
                            addRex(
                              { collection_id: addToCollectionId, rex_id: rec.id },
                              {
                                onSuccess: () => {
                                  setAddToCollectionId(null);
                                },
                              },
                            );
                          }}
                          className="flex-row items-center gap-3 p-3 rounded-xl"
                        >
                          <View className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                            <SignedStorageImage
                              bucket={REX_IMAGES_BUCKET}
                              storagePath={rexCoverStoragePathFromRecommendation(rec)}
                              remoteUri={rexCoverRemoteHttpUrl(rec)}
                              className="w-full h-full"
                              accessibilityLabel={rec.title}
                            />
                          </View>
                          <View className="flex-1">
                            <Text
                              className="text-sm font-semibold text-foreground"
                              numberOfLines={1}
                            >
                              {rec.title}
                            </Text>
                            <Text className="text-xs text-muted-foreground">{rec.category}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  <View className="h-4" />
                </ScrollView>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </>
    );
  }

  const ListHeader = (
    <View className="px-4 pt-6">
      <View className="relative mb-4">
        <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
          <Search size={16} color={Theme.colors.muted} />
        </View>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search your saved gems..."
          placeholderTextColor={Theme.colors.muted}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground"
        />
      </View>

      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-lg font-display font-bold text-foreground">Gems</Text>
        <TouchableOpacity
          onPress={() => setShowCreateCollection(true)}
          activeOpacity={0.7}
          className="flex-row items-center gap-1.5 px-3 py-2 rounded-lg border border-border"
        >
          <Plus size={14} color={Theme.colors.foreground} />
          <Text className="text-xs font-medium text-foreground">New collection</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-xs text-muted-foreground mb-5">
        Showing {filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''}
      </Text>

      {loadingCollections ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <View className="flex-row gap-3">
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                style={{ width: 160, height: 204, borderRadius: 12 }}
                className="bg-muted"
              />
            ))}
          </View>
        </ScrollView>
      ) : filteredCollections.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3 pb-1 mb-6"
        >
          {filteredCollections.map((col) => (
            <CollectionCard
              key={col.id}
              collection={col}
              onPress={() => setOpenCollectionId(col.id)}
            />
          ))}
        </ScrollView>
      ) : (
        <View className="items-center mb-6 py-6 px-4 rounded-2xl border border-dashed border-border bg-muted/30">
          <View className="flex-row mb-5">
            {[
              { emoji: '🍜', bg: 'bg-purple-500' },
              { emoji: '🏕️', bg: 'bg-sky-500' },
              { emoji: '📚', bg: 'bg-amber-500' },
            ].map((item, idx) => (
              <View
                key={idx}
                className={`w-12 h-16 rounded-xl ${item.bg} items-center justify-center`}
                style={{
                  marginLeft: idx === 0 ? 0 : -8,
                  zIndex: idx,
                  transform: [{ rotate: `${(idx - 1) * 6}deg` }],
                }}
              >
                <Text className="text-2xl">{item.emoji}</Text>
              </View>
            ))}
          </View>
          <Text className="text-base font-display font-bold text-foreground mb-1">
            No collections yet
          </Text>
          <Text className="text-sm text-muted-foreground text-center mb-4">
            Group your saved Rex into collections — by vibe, city, or whoever you'd share them with.
          </Text>
          <View className="flex-row flex-wrap justify-center gap-2 mb-5">
            {['Best eats in Tokyo 🍜', 'Weekend escapes 🏕️', 'Hidden bars 🍸'].map((label) => (
              <TouchableOpacity
                key={label}
                activeOpacity={0.7}
                onPress={() => setShowCreateCollection(true)}
                className="px-3 py-1.5 rounded-full border border-border bg-card"
              >
                <Text className="text-xs text-foreground">{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => setShowCreateCollection(true)}
            activeOpacity={0.8}
            className="flex-row items-center gap-2 px-5 py-2.5 rounded-xl bg-primary"
          >
            <Plus size={16} color={Theme.colors.primaryForeground} />
            <Text className="text-sm font-semibold text-primary-foreground">
              Create first collection
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text className="text-base font-display font-medium text-foreground mb-1">
        Uncollected Rex
      </Text>
      <Text className="text-xs text-muted-foreground mb-4">
        Rex you've saved but haven't added to a collection yet
      </Text>

      {loadingSaved && (
        <View className="gap-3 mb-3">
          {[1, 2].map((i) => (
            <View key={i} className="h-16 rounded-xl bg-muted" />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <>
      <FlatList
        data={loadingSaved ? [] : filteredUncollected}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="pb-24"
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => (
          <View
            className="px-4 mb-4"
            style={isWeb ? { maxWidth: 680, width: '100%', alignSelf: 'center' } : undefined}
          >
            <RecommendationCard
              recommendation={item}
              onTap={onRecommendationPress}
              onSave={(rec) =>
                setAddToCollectionRec({
                  id: rec.id,
                  place_name: rec.title,
                  category_code: rec.categoryId,
                  location: rec.location,
                  isSaved: rec.isSaved,
                })
              }
            />
          </View>
        )}
        ListEmptyComponent={
          loadingSaved ? null : (
            <View className="items-center py-10 gap-2">
              <PackageOpen size={28} color={Theme.colors.muted} />
              <Text className="text-sm text-muted-foreground">
                {filteredUncollected.length === 0 && uncollectedRecs.length > 0
                  ? 'No matches'
                  : 'All your Rex are in collections. Nice work.'}
              </Text>
            </View>
          )
        }
      />

      <CreateCollectionModal
        open={showCreateCollection}
        onClose={() => setShowCreateCollection(false)}
        onCreated={(id) => {
          setShowCreateCollection(false);
          queryClient.invalidateQueries({ queryKey: ['my-collections'] });
          setOpenCollectionId(id);
        }}
      />

      <AddToCollectionSheet
        open={!!addToCollectionRec}
        rec={addToCollectionRec}
        onClose={() => {
          setAddToCollectionRec(null);
          queryClient.invalidateQueries({ queryKey: ['my-collections'] });
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.5)' },
  overlay: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
});

export default FavesView;
