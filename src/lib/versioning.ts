import { version } from "../../package.json"

export function checkAndUpdateVersion() {
  const currentVersion = version
  const storedVersion = localStorage.getItem("version")

  if (storedVersion !== currentVersion) {
    // Clear all local storage
    localStorage.clear()

    // Set the new version
    localStorage.setItem("version", currentVersion)
  }
}
