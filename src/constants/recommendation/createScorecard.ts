export const CREATE_REC_SCORE_ROWS = [
  'Drinks quality',
  'Value for money',
  'Atmosphere & vibe',
  'Music (too loud → perfect)',
  'Service speed & friendliness',
  'Crowd & energy',
  'Safety & comfort',
  'Food options (if applicable)',
] as const;

export const CREATE_REC_SCORE_CHIPS = [
  'Good for working/laptops',
  'Good for catchups',
  'Dog friendly',
  'Kid friendly',
  'Outdoor seating',
  'All day breakfast',
  'Vegetarian/vegan options',
  'Gluten free options',
  'Walk-ins welcome',
  'Dairy free milk options',
  'Wheelchair accessible',
  'Card only',
] as const;

export const CREATE_REC_REVIEW_MAX = 2000;
export const CREATE_REC_MUST_KNOW_MAX = 150;

export const CREATE_REC_SCORE_COUNT = CREATE_REC_SCORE_ROWS.length;
