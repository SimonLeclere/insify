import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { EditAccountDialog } from "./EditAccountDialog";
import { useMounted } from "@/hooks/useMounted";

export function AccountInfoSection() {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const [editOpen, setEditOpen] = useState(false);
    const mounted = useMounted();
    
    if (isPending || !mounted) {
        return (
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="w-30 h-30 sm:w-16 sm:h-16 text-xl font-bold">
                    <Skeleton className="w-16 h-16" />
                </Avatar>
                <div className="flex-1 space-y-1 text-center sm:text-left">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-8 w-20" />
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="w-30 h-30 sm:w-16 sm:h-16 text-xl font-bold">
                <AvatarImage src={user?.image || undefined} alt={user?.name || ''} />
                <AvatarFallback className="rounded-lg select-none">{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 text-center sm:text-left">
                <div className="font-medium text-lg">{user?.firstName} {user?.lastName}</div>
                <div className="text-muted-foreground text-sm">{user?.email}</div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>Éditer</Button>
            <EditAccountDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                initialValues={{
                  usualName: user?.name || "",
                  firstName: user?.firstName || "",
                  lastName: user?.lastName || "",
                  image: user?.image || "",
                }}
            />
        </div>
    );
}
