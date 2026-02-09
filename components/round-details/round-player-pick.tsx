import { RoundDetails } from '@/lib/supabase/database';

type RoundPlayerPickProps = { pick: RoundDetails['picks'][number] };

export function RoundPlayerPick({ pick }: RoundPlayerPickProps) {
  const { player, league, isHit, odd, isChosen } = pick;

  return (
    <div className="bg-accent flex flex-col justify-between gap-0.5 rounded-md border p-2">
      <span className="font mb-2 font-semibold -tracking-wide">{player.username}</span>
      <div className="flex justify-between">
        <span>Liga</span>
        <span className="font-semibold">
          {league.name} ({league.country})
        </span>
      </div>
      <div className="flex justify-between">
        <span>Czy został wybrany?</span>
        <span className="font-semibold">{isChosen ? '✅ Tak' : '❌ Nie'}</span>
      </div>
      <div className="flex justify-between">
        <span>Czy trafiony?</span>
        <span className="font-semibold">{isHit ? '✅ Tak' : '❌ Nie'}</span>
      </div>
      <div className="flex justify-between">
        <span>Kurs</span>
        <span className="font-semibold">{odd}</span>
      </div>
    </div>
  );
}
