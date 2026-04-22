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
} from 'react-native';
import { Plus, PackageOpen, Search } from 'lucide-react-native';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { rexCoverStoragePathFromRecommendation, rexCoverRemoteHttpUrl } from '~/utils/recommendation/rexMediaPaths';
import RecommendationCard from '~/components/recommendation/RecommendationCard';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Backend } from '~/services/AuthService';
import { useMyCollections, useAddRexToCollection } from '~/hooks/useCollections';
import { useSavedRexes } from '~/hooks/useGems';
import { useAuth } from '~/services/AuthContext';
import { webContainerStyle } from '~/utils';
import { Theme } from '~/theme/Theme';
import type {
  Recommendation,
  RecommendationOpenOptions,
} from '~/types/recommendation/recommendation';
import CollectionDetailView from '~/components/faves/CollectionDetailView';
import CreateCollectionModal from '~/components/faves/CreateCollectionModal';
import AddToCollectionSheet, { RecSummary } from '~/components/faves/AddToCollectionSheet';
import CollectionCard from '~/components/profile/CollectionCard';

// ─── skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard: React.FC<{ width: number }> = ({ width }) => (
  <View
    style={{ width, height: Math.round(width * (4 / 3)), borderRadius: 12 }}
    className="bg-muted"
  />
);


// ─── main view ───────────────────────────────────────────────────────────────
type FavesViewProps = {
  commentCountByRexId?: Record<string, number>;
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
};

const FavesView: React.FC<FavesViewProps> = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [openCollectionId, setOpenCollectionId] = useState<string | null>(null);
  const [addToCollectionId, setAddToCollectionId] = useState<string | null>(null);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [addToCollectionRec, setAddToCollectionRec] = useState<RecSummary | null>(null);

  const { data: collections = [], isLoading: loadingCollections } = useMyCollections();
  const { data: savedRexes = [], isLoading: loadingSaved } = useSavedRexes();
  const { mutate: addRex } = useAddRexToCollection();

  // Rex IDs already in any of the user's collections
  const { data: collectedIds } = useQuery<Set<string>>({
    queryKey: ['collected-rex-ids', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await Backend.from('user_collection_rexes').select('rex_id');
      return new Set((data || []).map((r: any) => r.rex_id as string));
    },
  });

  const uncollectedRecs = useMemo(
    () => savedRexes.filter((r) => !collectedIds?.has(r.id)),
    [savedRexes, collectedIds],
  );

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

  const isDemo = collections.length === 0 && !loadingCollections;

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

  // ── collection detail screen ─────────────────────────────────────────────
  if (openCollectionId) {
    return (
      <>
        <CollectionDetailView
          collectionId={openCollectionId}
          onBack={() => {
            setOpenCollectionId(null);
            queryClient.invalidateQueries({ queryKey: ['my-collections'] });
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
            <Animated.View style={[{ width: '100%' }, { transform: [{ translateY: sheetTranslateY }] }]}>
              <View className="bg-card rounded-t-2xl border-t border-border" style={{ maxHeight: 400 }}>
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
                    <View style={[{ paddingHorizontal: 16, paddingVertical: 8, gap: 4 }, webContainerStyle]}>
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
                                  queryClient.invalidateQueries({
                                    queryKey: ['collected-rex-ids'],
                                  });
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

  // ── header (everything above the uncollected list) ───────────────────────
  const ListHeader = (
    <View>
      {/* Search */}
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

      {/* Title row */}
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

      {/* Demo banner */}
      {isDemo && (
        <View className="mb-4 px-3 py-2 rounded-lg bg-muted/60 border border-border">
          <Text className="text-xs text-muted-foreground text-center">
            ✨ This is a preview — create your first collection to get started!
          </Text>
        </View>
      )}

      {/* Collections horizontal scroll */}
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
        <View className="items-center py-12 gap-3 mb-6">
          <Text className="text-4xl">📚</Text>
          <Text className="font-display font-semibold text-foreground">No collections yet.</Text>
          <Text className="text-sm text-muted-foreground text-center max-w-xs">
            Start with something you know well — your favourite weekend walk, the best spots in your
            city.
          </Text>
          <TouchableOpacity
            onPress={() => setShowCreateCollection(true)}
            activeOpacity={0.8}
            className="flex-row items-center gap-2 px-5 py-2.5 rounded-xl bg-primary mt-2"
          >
            <Plus size={16} color={Theme.colors.primaryForeground} />
            <Text className="text-sm font-semibold text-primary-foreground">
              Create your first collection
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Uncollected section header */}
      <Text className="text-base font-display font-medium text-foreground mb-1">
        Uncollected Rex
      </Text>
      <Text className="text-xs text-muted-foreground mb-4">
        Rex you've saved but haven't added to a collection yet
      </Text>

      {(loadingSaved || !collectedIds) && (
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
        data={loadingSaved || !collectedIds ? [] : filteredUncollected}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="px-4 pt-6 pb-24"
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => (
          <View className="px-0 mb-4">
            <RecommendationCard
              recommendation={item}
              onSave={() =>
                setAddToCollectionRec({
                  id: item.id,
                  place_name: item.title,
                  category_code: item.category,
                  location: item.location,
                })
              }
            />
          </View>
        )}
        ListEmptyComponent={
          loadingSaved || !collectedIds ? null : (
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
          queryClient.invalidateQueries({ queryKey: ['collected-rex-ids'] });
          queryClient.invalidateQueries({ queryKey: ['my-collections'] });
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default FavesView;
