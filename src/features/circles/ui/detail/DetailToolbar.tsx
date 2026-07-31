import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  canManage: boolean;
  deletePending: boolean;
  deleteModalOpen: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const DeleteButtonContent = ({ pending }: { pending: boolean }) => {
  if (pending) return <ActivityIndicator size="small" color={Theme.colors.destructive} />;
  return (
    <>
      <Trash2 size={14} color={Theme.colors.destructive} />
      <Text className="text-xs font-medium text-destructive">
        Delete
      </Text>
    </>
  );
};

const DetailToolbar = ({
  canManage,
  deletePending,
  deleteModalOpen,
  onBack,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <View className="mb-4 flex-row items-center justify-between gap-2">
      <Pressable onPress={onBack} className="flex-row items-center gap-1.5 active:opacity-70">
        <ArrowLeft size={16} color={Theme.colors.muted} />
        <Text className="text-sm text-muted-foreground">Back to circles</Text>
      </Pressable>
      {canManage && (
        <View className="flex-row gap-2">
          <Pressable
            onPress={onEdit}
            className="flex-row items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 active:opacity-90"
          >
            <Pencil size={14} color={Theme.colors.foreground} />
            <Text className="text-xs font-medium text-foreground">Edit</Text>
          </Pressable>
          <Pressable
            onPress={onDelete}
            disabled={deletePending || deleteModalOpen}
            className="flex-row items-center gap-1 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 active:opacity-90"
          >
            <DeleteButtonContent pending={deletePending} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default DetailToolbar;
