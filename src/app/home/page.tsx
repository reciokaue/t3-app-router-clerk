'use client'

// import { api } from "@/trpc/server";
import { Plus } from 'lucide-react'
import { useState } from 'react'

import { FormCard } from '@/components/form-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/trpc/react'

export default function Home() {
  const [search, setSearch] = useState('')

  const {
    data: forms,
    refetch,
    isLoading,
    error,
  } = api.form.getFormsByUser.useQuery({
    query: '',
  })

  // const onChange = (event: any) => {
  //   setSearch(event.target.value)
  // }

  // useEffect(() => {
  //   if (search) {
  //     const timeoutId = setTimeout(() => {
  //       refetch()
  //     }, 500)
  //     return () => clearTimeout(timeoutId)
  //   }
  // }, [refetch, search])

  return (
    <div className="screen:px-0 mx-auto flex w-full max-w-6xl flex-col p-10">
      <div className="flex w-full items-center space-x-3">
        <div className="w-full">
          <Input
            type="email"
            placeholder="Procurar..."
            className="w-full"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <Button
          onClick={() => refetch()}
          // link="/form/new"
          type="submit"
          className="gap-2"
        >
          New
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* {forms?.map((form: any) => <FormCard data={form} key={form.id} />)} */}
        {JSON.stringify(forms)}
        {isLoading ? 'CARREGANDO...' : 'JA FOI'}
        {error
          ? 'Deu erro nessa merda' + JSON.stringify(error)
          : 'Ainda nao deu erro '}
      </div>
    </div>
  )
}

// async function CrudShowcase() {
//   const latestPost = await api.post.getAllPosts.query();

//   return (
//     <div className="w-full max-w-xs">
//       {/* Try posting when not logged in. You will see protected procedure gives an UNAUTHORIZED error.
//        Ideally you wouldn't even show the button if the user is not logged in, but this is just a demo to show
//        that tRPC protectedProcedures work.
//       */}
//       <CreatePost />
//       <div className="mt-6 flex flex-col">
//         <ul className="space-y-2">
//           {latestPost.map((post, index) => (
//             <li key={index} className="border border-gray-400">
//               <p className="text-sm">
//                 {`Posted by `}
//                 <span className="text-blue-400">
//                   <Link href={`/u/${post.clerkUser}`}>{post.email}</Link>
//                 </span>{" "}
//                 {`on ${post.createdAt.toLocaleDateString()}`}
//               </p>
//               <p className="text-xl text-pink-500">{post.name}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
// <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
//   <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
//     <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
//       Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
//     </h1>
//     <p>Next 14 App Router + tRPC + Clerk demo</p>
//     <div>
//       <SignedOut>
//         <span className="font-red-500">You are not signed in.</span>
//         <SignIn afterSignInUrl={"/"} />
//       </SignedOut>
//       <SignedIn>
//         <SignOutButton>Sign out &rarr;</SignOutButton>
//         <div className="flex flex-col">
//           <span className="text-green-500">You are signed in</span>{" "}
//           <ul>
//             <li>
//               {" "}
//               <span className="font-bold text-gray-400">
//                 Username:
//               </span>{" "}
//               {user?.username ?? "No username"}
//             </li>
//             <li>
//               {" "}
//               <span className="font-bold text-gray-400">Email:</span>{" "}
//               {user?.emailAddresses[0]?.emailAddress}
//             </li>
//             <li>
//               <span className="font-bold text-gray-400">Full name:</span>{" "}
//               {`${user?.firstName} ${user?.lastName}`}
//             </li>
//           </ul>
//         </div>
//       </SignedIn>
//     </div>
//     <div className="flex flex-col items-center gap-2">
//       <p className="text-2xl text-white">
//         {hello ? hello.greeting : "Loading tRPC query..."}
//       </p>
//     </div>

//     <CrudShowcase />
//   </div>
// </main>
