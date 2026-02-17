import { ReactNode } from 'react';
import {
  BadgePlusIcon,
  ChartColumnIcon,
  Grid2x2Icon,
  LayersIcon,
  LogOutIcon,
} from 'lucide-react';

type NavItem = { icon?: ReactNode; href: string; label: string };

type UserAction = {
  icon?: ReactNode;
  href?: string;
  label: string | ReactNode;
  type: 'link' | 'sign-out';
};

export const NAVIGATION: NavItem[] = [
  { icon: <ChartColumnIcon />, href: '/', label: 'Strona główna' },
  { icon: <LayersIcon />, href: '/rounds', label: 'Rundy' },
  { icon: <Grid2x2Icon />, href: '/leaderboard', label: 'Tabele' },
];

export const USER_ACTIONS: UserAction[] = [
  {
    icon: <BadgePlusIcon />,
    href: '/rounds/new',
    label: 'Dodaj nowe zdarzenie',
    type: 'link',
  },
  { icon: <LogOutIcon />, label: 'Wyloguj', type: 'sign-out' },
];
