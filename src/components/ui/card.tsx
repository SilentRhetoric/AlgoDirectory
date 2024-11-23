import { cn } from "@/lib/utils"
import type { ComponentProps, ParentComponent } from "solid-js"
import { splitProps } from "solid-js"

export const Card = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class"])

  return (
    <div
      class={cn("rounded-xl border bg-card text-card-foreground", local.class)}
      {...rest}
    />
  )
}

export const CardHeader = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class"])

  return (
    <div
      class={cn("flex flex-col p-4", local.class)}
      {...rest}
    />
  )
}

export const CardTitle: ParentComponent<ComponentProps<"h1">> = (props) => {
  const [local, rest] = splitProps(props, ["class"])

  return (
    <h2
      class={cn("uppercase leading-none", local.class)}
      {...rest}
    />
  )
}

export const CardDescription: ParentComponent<ComponentProps<"h3">> = (props) => {
  const [local, rest] = splitProps(props, ["class"])

  return (
    <h3
      class={cn("text-sm text-muted-foreground", local.class)}
      {...rest}
    />
  )
}

export const CardContent = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class"])

  return (
    <div
      class={cn("p-4", local.class)}
      {...rest}
    />
  )
}

export const CardFooter = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class"])

  return (
    <div
      class={cn("flex items-center p-4", local.class)}
      {...rest}
    />
  )
}
