import { ColorModeProvider, ColorModeScript } from "@kobalte/core"
import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { Suspense } from "solid-js"
import Header from "@/components/Header"
import "./app.css"
import Footer from "./components/Footer"
import { MetaProvider } from "@solidjs/meta"

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <div class="mx-auto flex max-w-screen-xl flex-col justify-center font-thin">
            <Header />
            <div class="md:min-h-[calc(100vh-128px)]">
              <Suspense fallback={<div>Loading...</div>}>
                <ColorModeScript />
                <ColorModeProvider>{props.children}</ColorModeProvider>
              </Suspense>
            </div>
            <Footer />
          </div>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
