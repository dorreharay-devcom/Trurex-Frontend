import { describe, expect, it } from 'vitest';
import { CLAIM_FLOW_ENTRY, CLAIM_FLOW_STEP } from '~/features/business-account/config/claim';
import {
  claimFlowReducer,
  INITIAL_CLAIM_FLOW_STATE,
  type ClaimFlowState,
} from '~/features/business-account/lib/claimFlow';
import type { ClaimSubject } from '~/features/business-account/types/claim';

const placeSubject: ClaimSubject = {
  kind: 'place',
  target: { placeId: 'place-1', placeName: 'Acme' },
};

const opened = claimFlowReducer(INITIAL_CLAIM_FLOW_STATE, { type: 'open', subject: null });
const picked = claimFlowReducer(opened, { type: 'pick', rexId: 'rex-1', title: 'Acme' });
const instructions = claimFlowReducer(picked, { type: 'startVerification' });

describe('claimFlowReducer', () => {
  it('opens on search without a subject and on the prompt with one', () => {
    expect(opened).toEqual({
      open: true,
      step: CLAIM_FLOW_STEP.find,
      subject: null,
      entry: CLAIM_FLOW_ENTRY.find,
    });
    expect(
      claimFlowReducer(INITIAL_CLAIM_FLOW_STATE, { type: 'open', subject: placeSubject }),
    ).toEqual({
      open: true,
      step: CLAIM_FLOW_STEP.prompt,
      subject: placeSubject,
      entry: CLAIM_FLOW_ENTRY.subject,
    });
  });

  it('moves from search to the prompt when a rex is picked', () => {
    expect(picked.step).toBe(CLAIM_FLOW_STEP.prompt);
    expect(picked.subject).toEqual({ kind: 'rex', rexId: 'rex-1', title: 'Acme' });
    expect(claimFlowReducer(picked, { type: 'pick', rexId: 'rex-2', title: 'Other' })).toBe(picked);
  });

  it('starts verification only from the prompt with a subject', () => {
    expect(instructions.step).toBe(CLAIM_FLOW_STEP.instructions);
    expect(claimFlowReducer(opened, { type: 'startVerification' })).toBe(opened);
    const subjectless: ClaimFlowState = { ...picked, subject: null };
    expect(claimFlowReducer(subjectless, { type: 'startVerification' })).toBe(subjectless);
  });

  it('marks the claim submitted only from the instructions step', () => {
    expect(claimFlowReducer(instructions, { type: 'submitted' }).step).toBe(
      CLAIM_FLOW_STEP.submitted,
    );
    expect(claimFlowReducer(picked, { type: 'submitted' })).toBe(picked);
  });

  it('walks back through the steps and closes at the start', () => {
    expect(claimFlowReducer(instructions, { type: 'back' }).step).toBe(CLAIM_FLOW_STEP.prompt);
    expect(claimFlowReducer(picked, { type: 'back' })).toEqual({ ...opened });
    expect(claimFlowReducer(opened, { type: 'back' }).open).toBe(false);
    const fromPlace = claimFlowReducer(INITIAL_CLAIM_FLOW_STATE, {
      type: 'open',
      subject: placeSubject,
    });
    expect(claimFlowReducer(fromPlace, { type: 'back' }).open).toBe(false);
  });

  it('keeps the step while closing and resets afterwards', () => {
    const closed = claimFlowReducer(instructions, { type: 'close' });
    expect(closed.open).toBe(false);
    expect(closed.step).toBe(CLAIM_FLOW_STEP.instructions);
    expect(claimFlowReducer(closed, { type: 'reset' })).toBe(INITIAL_CLAIM_FLOW_STATE);
  });
});
