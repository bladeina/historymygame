# Своя Игра (Realtime, Supabase)

Веб-приложение викторины в стиле Jeopardy на тему Древнерусского государства.

## Экраны

- `/board` — главное табло с сеткой 7x5, активной командой и онлайн-обновлением очков.
- `/join` — регистрация команды и переход в уникальную ссылку команды.
- `/play/:teamName` — экран игрока конкретной команды с кнопкой "ОТВЕТИТЬ".
- `/admin` — панель администратора: выбор вопроса, судейство (верно/неверно/скип), удаление команд.

## Запуск

1. Установить зависимости:
   - `npm install`
2. Добавить переменные в `.env` (или экспортировать в окружение):
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
3. Запустить:
   - `npm start`

## SQL для Supabase

Имена таблиц без пробелов: `teams`, `game_state`.

```sql
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  score integer not null default 0,
  is_connected boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.game_state (
  id integer primary key,
  current_question_id text,
  active_team_id uuid references public.teams(id) on delete set null,
  is_locked boolean not null default false,
  opened_question_ids text[] not null default '{}',
  blocked_team_ids uuid[] not null default '{}',
  selector_team_id uuid references public.teams(id) on delete set null,
  created_at timestamptz not null default now()
);

insert into public.game_state (
  id,
  current_question_id,
  active_team_id,
  is_locked,
  opened_question_ids,
  blocked_team_ids,
  selector_team_id
)
values (1, null, null, false, '{}', '{}', null)
on conflict (id) do nothing;

-- Добавление колонок к существующей БД:
alter table public.teams add column if not exists is_connected boolean not null default false;
alter table public.game_state add column if not exists blocked_team_ids uuid[] not null default '{}';
alter table public.game_state add column if not exists selector_team_id uuid references public.teams(id) on delete set null;
alter table public.game_state add column if not exists created_at timestamptz not null default now();

-- Если раньше использовалось имя blocked_teams:
-- alter table public.game_state rename column blocked_teams to blocked_team_ids;

alter publication supabase_realtime add table public.teams;
alter publication supabase_realtime add table public.game_state;
```

## Realtime

Подписки через `@supabase/supabase-js` настроены на изменения таблиц:

- `teams`
- `game_state`
