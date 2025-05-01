import { auth } from "@/app/(auth)/auth";
import { getAllGroupsForUser } from "@/lib/db/queries/groups";
import { GroupsList } from "./GroupsList";

export default async function GroupsPage() {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return (
      <div className="text-center text-red-500 pt-12">
        Please sign in to access this page.
      </div>
    );
  }

  const groups = await getAllGroupsForUser(userEmail);

  return <GroupsList groups={groups} />;
}
