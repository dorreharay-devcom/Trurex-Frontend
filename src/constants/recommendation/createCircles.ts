export type CreateRecCircle = {
  id: string;
  title: string;
  subtitle: string;
  variant: 'globe' | 'sphere';
  accent: string;
  iconBg: string;
};

export const CREATE_REC_CIRCLES: CreateRecCircle[] = [
  {
    id: 'public',
    title: 'Public',
    subtitle: 'Visible to anyone on TruRex',
    variant: 'globe',
    accent: '#16a34a',
    iconBg: '#dcfce7',
  },
  {
    id: 'inner',
    title: 'Inner Circle',
    subtitle: '6 members',
    variant: 'sphere',
    accent: '#2563eb',
    iconBg: '#dbeafe',
  },
  {
    id: 'friends-family',
    title: 'Friends & Family',
    subtitle: '24 members',
    variant: 'sphere',
    accent: '#16a34a',
    iconBg: '#dcfce7',
  },
  {
    id: 'work',
    title: 'Work Colleagues',
    subtitle: '11 members',
    variant: 'sphere',
    accent: '#ca8a04',
    iconBg: '#fef9c3',
  },
  {
    id: 'spiritual',
    title: 'Spiritual Friends',
    subtitle: '4 members',
    variant: 'sphere',
    accent: '#9333ea',
    iconBg: '#f3e8ff',
  },
  {
    id: 'neighbourhood',
    title: 'Neighbourhood Crew',
    subtitle: '9 members',
    variant: 'sphere',
    accent: '#dc2626',
    iconBg: '#fee2e2',
  },
];
