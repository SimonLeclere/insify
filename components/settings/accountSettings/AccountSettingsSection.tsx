import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountInfoSection } from "./AccountInfoSection";
import { AccountProvidersSection } from "./AccountProvidersSection";

export default function AccountSettingsSection() {

  return (
    <section id="account" className="scroll-mt-24">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <AccountInfoSection />
          <Separator />
          <AccountProvidersSection />
        </CardContent>
      </Card>
    </section>
  );
}
