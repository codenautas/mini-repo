export const defConfig=`
server:
  port: 3030
  base-url: /mini-repo
  session-store: memory-saved
db:
  motor: postgresql
  host: localhost
  database: mini_repo_db
  schema: mini_repo
  user: mini_repo_user
  search_path: 
  - mini_repo
  - public
install:
  dump:
    db:
      owner: mini_repo_owner
      apply-generic-user-replaces: true
      user4special-scripts: mini_repo_admin
      owner4special-scripts: mini_repo_owner
      extensions:
      - pg_trgm
    enances: inline
    skip-content: true
    scripts:
      prepare:
      post-adapt: 
      - ../node_modules/pg-triggers/lib/recreate-his.sql
      - ../node_modules/pg-triggers/lib/table-changes.sql
      - ../node_modules/pg-triggers/lib/function-changes-trg.sql
      - ../node_modules/pg-triggers/lib/enance.sql
login:
  table: usuarios
  userFieldName: usuario
  passFieldName: md5clave
  rolFieldName: rol
  infoFieldList: [usuario, rol]
  activeClausule: activo
  plus:
    maxAge-5-sec: 5000    
    maxAge: 864000000
    maxAge-10-day: 864000000
    allowHttpLogin: true
    fileStore: false
    skipCheckAlreadyLoggedIn: true
    noLoggedUrlPath: /vi
    loginForm:
      formTitle: mini-repo
      usernameLabel: usuario
      passwordLabel: clave
      buttonLabel: entrar
      formImg: img/login-lock-icon.png
    chPassForm:
      usernameLabel: usuario
      oldPasswordLabel: clave anterior
      newPasswordLabel: nueva clave
      repPasswordLabel: repetir nueva clave
      buttonLabel: Cambiar
      formTitle: Cambio de clave
  messages:
    userOrPassFail: el nombre de usuario no existe o la clave no corresponde
    lockedFail: el usuario se encuentra bloqueado
    inactiveFail: es usuario está marcado como inactivo
client-setup:
  title: mini-repo
  cursors: true
  lang: es
  menu: true
  initial-scale: 1.0
  user-scalable: no
  x-grid-buffer: wsql
`