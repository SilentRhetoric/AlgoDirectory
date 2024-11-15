// @refresh reload
import { mount, StartClient } from "@solidjs/start/client"
import { checkAndUpdateVersion } from "./lib/versioning"

checkAndUpdateVersion()

mount(() => <StartClient />, document.getElementById("app")!)
