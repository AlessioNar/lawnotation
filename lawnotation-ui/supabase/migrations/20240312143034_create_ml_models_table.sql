create table "public"."ml_models" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text default ''::text,
    "type" text,
    "labelset_id" bigint
);


alter table "public"."ml_models" enable row level security;

CREATE UNIQUE INDEX ml_models_pkey ON public.ml_models USING btree (id);

alter table "public"."ml_models" add constraint "ml_models_pkey" PRIMARY KEY using index "ml_models_pkey";

alter table "public"."ml_models" add constraint "ml_models_labelset_id_fkey" FOREIGN KEY (labelset_id) REFERENCES labelsets(id) not valid;

alter table "public"."ml_models" validate constraint "ml_models_labelset_id_fkey";

grant delete on table "public"."ml_models" to "anon";

grant insert on table "public"."ml_models" to "anon";

grant references on table "public"."ml_models" to "anon";

grant select on table "public"."ml_models" to "anon";

grant trigger on table "public"."ml_models" to "anon";

grant truncate on table "public"."ml_models" to "anon";

grant update on table "public"."ml_models" to "anon";

grant delete on table "public"."ml_models" to "authenticated";

grant insert on table "public"."ml_models" to "authenticated";

grant references on table "public"."ml_models" to "authenticated";

grant select on table "public"."ml_models" to "authenticated";

grant trigger on table "public"."ml_models" to "authenticated";

grant truncate on table "public"."ml_models" to "authenticated";

grant update on table "public"."ml_models" to "authenticated";

grant delete on table "public"."ml_models" to "service_role";

grant insert on table "public"."ml_models" to "service_role";

grant references on table "public"."ml_models" to "service_role";

grant select on table "public"."ml_models" to "service_role";

grant trigger on table "public"."ml_models" to "service_role";

grant truncate on table "public"."ml_models" to "service_role";

grant update on table "public"."ml_models" to "service_role";

