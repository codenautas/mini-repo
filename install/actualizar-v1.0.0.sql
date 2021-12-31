set search_path = mini_repo;

alter table indicadores add column nombre_cuadro text;
alter table indicadores add column ultima_actualizacion text;

alter table dimensiones add column abreviacion text;

alter table parametros add column modelo_ficha text;
alter table parametros add column logos jsonb;
alter table parametros add column mostrar_codigo_dimension boolean;
alter table parametros add column nombre_sistema text;
