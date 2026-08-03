import { useEffect, useMemo, useState } from 'react';
import { CIRCLE_SYSTEM_KIND } from '~/shared/config/circles';
import { isUserCreatedCircle } from '~/features/circles/lib/display';
import { useMyCircleRows } from '~/features/circles/hooks/data/useMyCircleRows';
import { useAssignToCircle } from '~/features/circles/hooks/assignment/useAssignToCircle';
import { useCreateFormAutofocus } from '~/features/circles/hooks/assignment/useCreateFormAutofocus';
import { useScrollBottomFade } from '~/features/circles/hooks/assignment/useScrollBottomFade';
import { useCircleForm } from '~/features/circles/hooks/useCircleForm';

type Args = {
  open: boolean;
  memberId: string;
  onClose: () => void;
};

export type AssignmentSheetState = ReturnType<typeof useAssignmentSheet>;

export function useAssignmentSheet({ open, memberId, onClose }: Args) {
  const { circles, isLoading } = useMyCircleRows(open);
  const [showCreate, setShowCreate] = useState(false);
  const form = useCircleForm();
  const scrollFade = useScrollBottomFade();
  const autofocus = useCreateFormAutofocus(open && showCreate);
  const { assign, createAndAssign, pendingCircleId, inFlight } = useAssignToCircle({
    memberId,
    onAssigned: onClose,
  });

  const assignableCircles = useMemo(
    () =>
      circles.filter(
        (c) => c.system_kind === CIRCLE_SYSTEM_KIND.innerCircle || isUserCreatedCircle(c),
      ),
    [circles],
  );

  const closeCreateForm = () => {
    setShowCreate(false);
    form.reset();
    autofocus.reset();
  };

  const { reset: resetForm } = form;
  const { reset: resetScrollFade } = scrollFade;
  const { reset: resetAutofocus } = autofocus;

  useEffect(() => {
    if (open) return;
    setShowCreate(false);
    resetForm();
    resetScrollFade();
    resetAutofocus();
  }, [open, resetForm, resetScrollFade, resetAutofocus]);

  const openCreateForm = () => {
    autofocus.requestFocus();
    setShowCreate(true);
  };

  const submitCreateAndAssign = async () => {
    const assigned = await createAndAssign(form);
    if (assigned) closeCreateForm();
  };

  return {
    circlesLoading: isLoading,
    assignableCircles,
    form,
    showCreate,
    openCreateForm,
    closeCreateForm,
    submitCreateAndAssign,
    assign,
    pendingCircleId,
    inFlight,
    scrollFade,
    autofocus,
  };
}
