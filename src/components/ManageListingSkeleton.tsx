import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ManageListingSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle class="text-base">
          <Skeleton class="h-5 w-[250px]" />
        </CardTitle>
      </CardHeader>
      <CardContent class="flex h-48 w-full flex-col justify-between space-y-2">
        <div class="mt-2 flex w-full flex-col gap-2">
          <div class="flex flex-row justify-between">
            <Skeleton class="h-5 w-[80px]" />
            <Skeleton class="h-5 w-[120px]" />
          </div>
          <div class="flex flex-row items-center justify-between">
            <Skeleton class="h-5 w-[120px]" />
            <div class="flex flex-row items-center gap-1">
              <Skeleton class="h-5 w-[60px]" />
              <Skeleton class="h-5 w-[25px]" />
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-end gap-3">
          <div class="flex flex-wrap justify-start gap-2">
            <Skeleton class="h-5 w-[50px]" />
            <Skeleton class="h-5 w-[60px]" />
            <Skeleton class="h-5 w-[70px]" />
            <Skeleton class="h-5 w-[90px]" />
            <Skeleton class="h-5 w-[50px]" />
          </div>
          <Skeleton class="h-9 w-full" />
        </div>
      </CardContent>
      <div class="px-6">
        <div class="-mx-6 mb-4 h-px bg-border" />
      </div>
      <CardFooter class="flex flex-col items-center justify-center gap-2">
        <Skeleton class="h-9 w-full" />
        <Skeleton class="h-9 w-full" />
      </CardFooter>
    </Card>
  )
}

export default ManageListingSkeleton
