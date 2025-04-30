// "use client";

// import { useEffect } from "react";
// import { useSession } from "next-auth/react";

// const APP_NAME = "next-auth-drizzle-neon-template";

// export function DynamicTitleUpdater() {
//   const { data: session, status } = useSession();

//   useEffect(() => {
//     if (status === "loading") {
//       // Optionally handle loading state, maybe keep default title
//       return;
//     }

//     if (session) {
//       // User is logged in - Customize title as needed
//       // Example: Using user's name or a generic dashboard title
//       const pageTitle =
//         document.location.pathname.split("/").pop() || "Dashboard";
//       const capitalizedTitle =
//         pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);
//       document.title = `${capitalizedTitle} - ${APP_NAME}`;
//     } else {
//       // User is logged out
//       document.title = `Login - ${APP_NAME}`;
//     }
//     // Update title when session status changes or pathname changes
//   }, [session, status, document.location.pathname]);

//   // This component doesn't render anything itself
//   return null;
// }
