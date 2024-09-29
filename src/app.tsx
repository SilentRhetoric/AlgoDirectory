import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { Suspense } from "solid-js"
import Header from "~/components/Header"
import "./app.css"
import Footer from "./components/Footer"
import { MetaProvider } from "@solidjs/meta"

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Header />
          <div class="mb-auto flex min-h-[calc(100vh-248px)] flex-col items-center justify-start p-4 md:min-h-[calc(100vh-168px)]">
            <Suspense>{props.children}</Suspense>
          </div>
          <Footer />
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
