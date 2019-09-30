"use strict";

import { AppBackend } from "backend-plus";
import { emergeAppMiniRepo } from "./app-mini-repo";

var AppMiniRepo = emergeAppMiniRepo(AppBackend)
new AppMiniRepo().start();