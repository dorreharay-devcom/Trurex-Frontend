import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import type { AssignmentSheetState } from '~/features/circles/hooks/assignment/useAssignmentSheet';
import CircleFormFields from '~/features/circles/ui/form/CircleFormFields';
import CircleSubmitButton from '~/features/circles/ui/form/CircleSubmitButton';
import { Theme } from '~/shared/theme/Theme';

type Props = { sheet: AssignmentSheetState };

const CreateAndAssignForm = ({ sheet }: Props) => {
  return (
    <View
      className="gap-3 rounded-xl border border-border bg-background p-4"
      onLayout={sheet.autofocus.onFormLayout}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-foreground">New Circle</Text>
        <Pressable onPress={sheet.closeCreateForm} hitSlop={8}>
          <X size={16} color={Theme.colors.muted} />
        </Pressable>
      </View>

      <CircleFormFields
        form={sheet.form}
        fieldBg="bg-search-field"
        nameInputRef={sheet.autofocus.nameInputRef}
      />

      <CircleSubmitButton
        label="Create & Assign"
        disabled={!sheet.form.canSubmit || sheet.inFlight}
        pending={sheet.inFlight}
        onPress={() => void sheet.submitCreateAndAssign()}
      />
    </View>
  );
};

export default CreateAndAssignForm;
