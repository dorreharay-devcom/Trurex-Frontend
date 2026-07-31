import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import type { CategoryTagOption } from '~/types/recommendation/rexCategoryCreateConfig';
import { groupTagOptionsByTagGroup } from '~/features/rex-create/lib/configMerge';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/utils/general';

type Props = {
  tagOptions: CategoryTagOption[];
  selectedSlugs: string[];
  onToggle: (slug: string) => void;
};

function groupKey(groupTitle: string): string {
  return groupTitle || '__ungrouped';
}

function groupLabel(groupTitle: string): string {
  return groupTitle.trim() ? groupTitle : 'Other';
}

function isOnlyOnTrurexGroup(groupTitle: string): boolean {
  return groupTitle.trim().toLowerCase() === 'only on trurex';
}

function ScorecardTagOptions({ tagOptions, selectedSlugs, onToggle }: Props) {
  const groups = useMemo(() => groupTagOptionsByTagGroup(tagOptions), [tagOptions]);
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setOpenGroups(new Set());
  }, [groups]);

  const toggleGroup = useCallback((key: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  if (groups.length === 0) return null;

  return (
    <View className="gap-3">
      <Text className="text-xs font-semibold uppercase tracking-wider text-foreground">
        What applies?
      </Text>
      {groups.map((g) => {
        const key = groupKey(g.groupTitle);
        const open = openGroups.has(key);
        const selectedInGroup = g.tags.filter((t) => selectedSlugs.includes(t.slug)).length;
        const emphasize = isOnlyOnTrurexGroup(g.groupTitle);

        return (
          <View
            key={key}
            className={cn(
              'overflow-hidden rounded-xl border',
              emphasize ? 'border-border bg-primary/20' : 'border-border bg-card',
            )}
          >
            <Pressable
              onPress={() => toggleGroup(key)}
              className="flex-row items-center justify-between gap-2 px-3 py-3 active:opacity-90"
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              accessibilityLabel={`${groupLabel(g.groupTitle)}${selectedInGroup > 0 ? `, ${selectedInGroup} selected` : ''}`}
            >
              <Text className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-wide text-foreground">
                {groupLabel(g.groupTitle).toUpperCase()}
                {selectedInGroup > 0 ? ` · ${selectedInGroup}` : ''}
              </Text>
              {open ? (
                <ChevronUp size={16} color={Theme.colors.secondaryText} />
              ) : (
                <ChevronDown size={16} color={Theme.colors.secondaryText} />
              )}
            </Pressable>
            {open ? (
              <View className="flex-row flex-wrap gap-2 px-3 pb-3">
                {g.tags.map((t) => {
                  const on = selectedSlugs.includes(t.slug);
                  return (
                    <Pressable
                      key={t.slug}
                      onPress={() => onToggle(t.slug)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 active:opacity-90',
                        on && 'border-primary bg-primary',
                        !on && emphasize && 'border-border bg-primary/20',
                        !on && !emphasize && 'border-border bg-muted/50',
                      )}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                    >
                      <Text
                        className={cn(
                          'text-sm',
                          on ? 'text-primary-foreground' : 'text-foreground',
                        )}
                      >
                        {t.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

export default ScorecardTagOptions;
