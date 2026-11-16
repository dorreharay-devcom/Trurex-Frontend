import {
  CLAIM_FLOW_ENTRY,
  CLAIM_FLOW_STEP,
  type ClaimFlowEntry,
  type ClaimFlowStep,
} from '~/features/business-account/config/claim';
import type { ClaimSubject } from '~/features/business-account/types/claim';

export type ClaimFlowState = {
  open: boolean;
  step: ClaimFlowStep;
  subject: ClaimSubject | null;
  entry: ClaimFlowEntry;
};

export type ClaimFlowAction =
  | { type: 'open'; subject: ClaimSubject | null }
  | { type: 'pick'; rexId: string; title: string }
  | { type: 'startVerification' }
  | { type: 'back' }
  | { type: 'submitted' }
  | { type: 'close' }
  | { type: 'reset' };

export const INITIAL_CLAIM_FLOW_STATE: ClaimFlowState = {
  open: false,
  step: CLAIM_FLOW_STEP.find,
  subject: null,
  entry: CLAIM_FLOW_ENTRY.find,
};

function openState(subject: ClaimSubject | null): ClaimFlowState {
  if (!subject) return { ...INITIAL_CLAIM_FLOW_STATE, open: true };
  return { open: true, step: CLAIM_FLOW_STEP.prompt, subject, entry: CLAIM_FLOW_ENTRY.subject };
}

function backState(state: ClaimFlowState): ClaimFlowState {
  if (state.step === CLAIM_FLOW_STEP.instructions) {
    return { ...state, step: CLAIM_FLOW_STEP.prompt };
  }
  if (state.step === CLAIM_FLOW_STEP.prompt && state.entry === CLAIM_FLOW_ENTRY.find) {
    return { ...state, step: CLAIM_FLOW_STEP.find, subject: null };
  }
  return { ...state, open: false };
}

export function claimFlowReducer(state: ClaimFlowState, action: ClaimFlowAction): ClaimFlowState {
  switch (action.type) {
    case 'open':
      return openState(action.subject);
    case 'pick':
      if (state.step !== CLAIM_FLOW_STEP.find) return state;
      return {
        ...state,
        step: CLAIM_FLOW_STEP.prompt,
        subject: { kind: 'rex', rexId: action.rexId, title: action.title },
      };
    case 'startVerification':
      if (state.step !== CLAIM_FLOW_STEP.prompt || !state.subject) return state;
      return { ...state, step: CLAIM_FLOW_STEP.instructions };
    case 'back':
      return backState(state);
    case 'submitted':
      if (state.step !== CLAIM_FLOW_STEP.instructions) return state;
      return { ...state, step: CLAIM_FLOW_STEP.submitted };
    case 'close':
      return { ...state, open: false };
    case 'reset':
      return INITIAL_CLAIM_FLOW_STATE;
  }
}
