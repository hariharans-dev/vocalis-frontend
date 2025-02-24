"use client";

import { PageClient } from "./page-client";

export const metadata = {
  title: "Dashboard - Stack Template",
};

export default function Dashboard() {
  return <PageClient />;
}

// "use client";

// import { useSession, signOut } from "next-auth/react";

// export default function Dashboard() {
//   const { data: session } = useSession();

//   return (
//     <div>
//       {session ? (
//         <div>
//           <h1>Welcome, {session.user?.name}</h1>
//           <button onClick={() => signOut()}>Sign Out</button>
//         </div>
//       ) : (
//         <p>You are not signed in.</p>
//       )}
//     </div>
//   );
// }
